import { eq, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { users, profiles, didMetadata, emailVerifications } from '../schema';
import type { NewUser, NewProfile, NewDidMetadata, NewEmailVerification } from '../schema';
import {
  generateDID,
  generateDIDDocument,
  generateVerificationCode,
  generateSecureToken,
  calculateTrustScore,
  getVerificationStatus,
} from '../../lib/did';

/**
 * Check if user exists by wallet address
 */
export async function checkUserExists(walletAddress: string): Promise<boolean> {
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.walletAddress, walletAddress))
    .limit(1);

  return result.length > 0;
}

/**
 * Get user by wallet address with profile and DID metadata
 */
export async function getUserByWallet(walletAddress: string) {
  const result = await db
    .select()
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(didMetadata, eq(users.id, didMetadata.userId))
    .where(eq(users.walletAddress, walletAddress))
    .limit(1);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    user: row.users,
    profile: row.profiles,
    didMetadata: row.did_metadata,
  };
}

/**
 * Get user by DID
 */
export async function getUserByDID(did: string) {
  const result = await db
    .select()
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(didMetadata, eq(users.id, didMetadata.userId))
    .where(eq(users.did, did))
    .limit(1);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    user: row.users,
    profile: row.profiles,
    didMetadata: row.did_metadata,
  };
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create a new user with DID
 * This is the main onboarding function
 */
export async function createUser(data: {
  walletAddress: string;
  email: string;
}): Promise<{ user: typeof users.$inferSelect; did: string; verificationToken: string }> {
  const existingUser = await checkUserExists(data.walletAddress);
  if (existingUser) {
    throw new Error('User with this wallet address already exists');
  }

  const existingEmail = await getUserByEmail(data.email);
  if (existingEmail) {
    throw new Error('Email is already registered');
  }

  const did = generateDID(data.walletAddress);

  const didDocument = generateDIDDocument(did, data.walletAddress);

  const verificationToken = generateSecureToken(32);
  const verificationCode = generateVerificationCode();
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const result = await db.transaction(async (tx) => {
    const [newUser] = await tx
      .insert(users)
      .values({
        walletAddress: data.walletAddress,
        email: data.email,
        did,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
        onboardingCompleted: false,
      })
      .returning();

    await tx.insert(didMetadata).values({
      userId: newUser.id,
      didDocument,
      trustScore: '0',
      verificationStatus: 'unverified',
    });

    await tx.insert(emailVerifications).values({
      userId: newUser.id,
      email: data.email,
      code: verificationCode,
      token: verificationToken,
      expiresAt: verificationExpiry,
    });

    return newUser;
  });

  return {
    user: result,
    did,
    verificationToken,
  };
}

/**
 * Complete user profile during onboarding
 */
export async function completeUserProfile(
  userId: string,
  profileData: Omit<NewProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  return await db.transaction(async (tx) => {
    const [profile] = await tx
      .insert(profiles)
      .values({
        userId,
        ...profileData,
      })
      .returning();

    const [user] = await tx
      .update(users)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return { user, profile };
  });
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<boolean> {
  const verification = await db
    .select()
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.token, token),
        sql`${emailVerifications.expiresAt} > NOW()`,
        sql`${emailVerifications.verifiedAt} IS NULL`
      )
    )
    .limit(1);

  if (verification.length === 0) {
    return false;
  }

  const record = verification[0];

  await db.transaction(async (tx) => {
    await tx
      .update(emailVerifications)
      .set({ verifiedAt: new Date() })
      .where(eq(emailVerifications.id, record.id));

    await tx
      .update(users)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, record.userId));

    const currentMetadata = await tx
      .select()
      .from(didMetadata)
      .where(eq(didMetadata.userId, record.userId))
      .limit(1);

    if (currentMetadata.length > 0) {
      const newTrustScore = calculateTrustScore({ emailVerified: true });
      const newStatus = getVerificationStatus(newTrustScore);

      await tx
        .update(didMetadata)
        .set({
          emailVerifiedAt: new Date(),
          trustScore: newTrustScore.toString(),
          verificationStatus: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(didMetadata.userId, record.userId));
    }
  });

  return true;
}

/**
 * Verify email with code
 */
export async function verifyEmailWithCode(userId: string, code: string): Promise<boolean> {
  const verification = await db
    .select()
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.userId, userId),
        eq(emailVerifications.code, code),
        sql`${emailVerifications.expiresAt} > NOW()`,
        sql`${emailVerifications.verifiedAt} IS NULL`
      )
    )
    .limit(1);

  if (verification.length === 0) {
    return false;
  }

  const record = verification[0];

  await db.transaction(async (tx) => {
    await tx
      .update(emailVerifications)
      .set({ verifiedAt: new Date() })
      .where(eq(emailVerifications.id, record.id));

    await tx
      .update(users)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    const currentMetadata = await tx
      .select()
      .from(didMetadata)
      .where(eq(didMetadata.userId, userId))
      .limit(1);

    if (currentMetadata.length > 0) {
      const newTrustScore = calculateTrustScore({ emailVerified: true });
      const newStatus = getVerificationStatus(newTrustScore);

      await tx
        .update(didMetadata)
        .set({
          emailVerifiedAt: new Date(),
          trustScore: newTrustScore.toString(),
          verificationStatus: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(didMetadata.userId, userId));
    }
  });

  return true;
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<NewProfile, 'id' | 'userId' | 'createdAt'>>
) {
  const [profile] = await db
    .update(profiles)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId))
    .returning();

  return profile;
}

/**
 * Get DID metadata with trust score
 */
export async function getDIDMetadata(userId: string) {
  const result = await db
    .select()
    .from(didMetadata)
    .where(eq(didMetadata.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update DID trust score
 */
export async function updateTrustScore(userId: string, verifications: {
  emailVerified?: boolean;
  domainVerified?: boolean;
  businessVerified?: boolean;
  invoiceCount?: number;
  onTimePaymentRate?: number;
}) {
  const newTrustScore = calculateTrustScore(verifications);
  const newStatus = getVerificationStatus(newTrustScore);

  const [updated] = await db
    .update(didMetadata)
    .set({
      trustScore: newTrustScore.toString(),
      verificationStatus: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(didMetadata.userId, userId))
    .returning();

  return updated;
}

/**
 * Search users by company name (using pg_trgm for fuzzy search)
 */
export async function searchUsersByCompany(searchTerm: string, limit: number = 10) {
  const result = await db
    .select({
      user: users,
      profile: profiles,
      didMetadata: didMetadata,
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(didMetadata, eq(users.id, didMetadata.userId))
    .where(sql`${profiles.companyName} ILIKE ${`%${searchTerm}%`}`)
    .limit(limit);

  return result;
}

/**
 * Get user public profile by DID (safe for public display)
 */
export async function getPublicProfile(did: string) {
  const result = await db
    .select({
      did: users.did,
      companyName: profiles.companyName,
      industry: profiles.industry,
      bio: profiles.bio,
      logoUrl: profiles.logoUrl,
      country: profiles.country,
      website: profiles.website,
      trustScore: didMetadata.trustScore,
      verificationStatus: didMetadata.verificationStatus,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(didMetadata, eq(users.id, didMetadata.userId))
    .where(eq(users.did, did))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}