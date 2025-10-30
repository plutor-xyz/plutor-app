import { pgTable, text, timestamp, uuid, boolean, varchar, jsonb, index } from 'drizzle-orm/pg-core';

/**
 * Users table - Core user identity linked to Solana wallet
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: varchar('wallet_address', { length: 44 }).notNull().unique(),
  did: varchar('did', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 64 }),
  emailVerificationExpiry: timestamp('email_verification_expiry'),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  walletAddressIdx: index('wallet_address_idx').on(table.walletAddress),
  didIdx: index('did_idx').on(table.did),
  emailIdx: index('email_idx').on(table.email),
}));

/**
 * User profiles - Extended business/company information
 */
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),

  companyName: varchar('company_name', { length: 255 }).notNull(),
  companyType: varchar('company_type', { length: 50 }), // LLC, Inc, Ltd, Sole Proprietor, etc.
  taxId: varchar('tax_id', { length: 50 }), // Business tax ID / VAT number

  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 2 }), // ISO 3166-1 alpha-2 country code

  phone: varchar('phone', { length: 20 }),
  website: varchar('website', { length: 255 }),

  industry: varchar('industry', { length: 100 }),
  bio: text('bio'),
  logoUrl: text('logo_url'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('profile_user_id_idx').on(table.userId),
  companyNameIdx: index('profile_company_name_idx').on(table.companyName),
}));

/**
 * DID metadata - Additional information about DIDs
 */
export const didMetadata = pgTable('did_metadata', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),

  didDocument: jsonb('did_document').notNull(),

  trustScore: varchar('trust_score', { length: 3 }).default('0'), // 0-100
  verificationStatus: varchar('verification_status', { length: 20 }).notNull().default('unverified'), // unverified, basic, verified, fully_verified

  emailVerifiedAt: timestamp('email_verified_at'),
  domainVerifiedAt: timestamp('domain_verified_at'),
  businessVerifiedAt: timestamp('business_verified_at'),

  verificationData: jsonb('verification_data'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('did_metadata_user_id_idx').on(table.userId),
  verificationStatusIdx: index('did_verification_status_idx').on(table.verificationStatus),
}));

/**
 * Email verification codes
 */
export const emailVerifications = pgTable('email_verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(), // 6-digit code
  token: varchar('token', { length: 64 }).notNull().unique(), // URL-safe token
  expiresAt: timestamp('expires_at').notNull(),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('email_verification_user_id_idx').on(table.userId),
  tokenIdx: index('email_verification_token_idx').on(table.token),
  emailIdx: index('email_verification_email_idx').on(table.email),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type DidMetadata = typeof didMetadata.$inferSelect;
export type NewDidMetadata = typeof didMetadata.$inferInsert;

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type NewEmailVerification = typeof emailVerifications.$inferInsert;
