import { randomBytes, createHash } from 'crypto';
import { PublicKey } from '@solana/web3.js';

/**
 * Generate a DID in the format: did:solana:<base58-encoded-hash>
 * The hash is derived from the wallet address to ensure uniqueness
 */
export function generateDID(walletAddress: string): string {
  try {
    new PublicKey(walletAddress);
  } catch (error) {
    throw new Error('Invalid Solana wallet address');
  }

  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(walletAddress + salt)
    .digest();

  const base58Hash = encodeBase58Hash(hash);

  return `did:solana:${base58Hash}`;
}

/**
 * Encode a hash to base58-like format (simplified for MVP)
 * In production, use proper base58 encoding library
 */
function encodeBase58Hash(hash: Buffer): string {
  const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < 32 && i < hash.length; i++) {
    const byte = hash[i];
    result += base58Chars[byte % base58Chars.length];
  }

  return result;
}

/**
 * Validate DID format
 */
export function isValidDID(did: string): boolean {
  const didRegex = /^did:solana:[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{32,44}$/;
  return didRegex.test(did);
}

/**
 * Extract method from DID (e.g., "solana" from "did:solana:...")
 */
export function extractDIDMethod(did: string): string | null {
  const match = did.match(/^did:([^:]+):/);
  return match ? match[1] : null;
}

/**
 * Extract identifier from DID (the hash part)
 */
export function extractDIDIdentifier(did: string): string | null {
  const match = did.match(/^did:[^:]+:(.+)$/);
  return match ? match[1] : null;
}

/**
 * Generate DID document structure
 * Based on W3C DID specification (simplified for MVP)
 */
export function generateDIDDocument(did: string, walletAddress: string) {
  return {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
    ],
    id: did,
    controller: did,
    verificationMethod: [
      {
        id: `${did}#key-1`,
        type: 'Ed25519VerificationKey2020',
        controller: did,
        publicKeyMultibase: walletAddress, // Using wallet address as public key
      },
    ],
    authentication: [`${did}#key-1`],
    assertionMethod: [`${did}#key-1`],
    service: [
      {
        id: `${did}#plutor-profile`,
        type: 'PlutorProfile',
        serviceEndpoint: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile/${did}`,
      },
    ],
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
}

/**
 * Calculate trust score based on verification status
 * 0-100 scale
 */
export function calculateTrustScore(verifications: {
  emailVerified?: boolean;
  domainVerified?: boolean;
  businessVerified?: boolean;
  invoiceCount?: number;
  onTimePaymentRate?: number;
}): number {
  let score = 0;

  if (verifications.emailVerified) {
    score += 20;
  }

  if (verifications.domainVerified) {
    score += 15;
  }

  if (verifications.businessVerified) {
    score += 40;
  }

  if (verifications.invoiceCount && verifications.invoiceCount > 0) {
    const historyScore = Math.min(10, verifications.invoiceCount * 0.5);
    score += historyScore;

    if (verifications.onTimePaymentRate) {
      const paymentScore = Math.min(15, verifications.onTimePaymentRate * 15);
      score += paymentScore;
    }
  }

  return Math.min(100, Math.round(score));
}

/**
 * Determine verification status based on trust score
 */
export function getVerificationStatus(trustScore: number): string {
  if (trustScore >= 70) return 'fully_verified';
  if (trustScore >= 50) return 'verified';
  if (trustScore >= 30) return 'basic';
  return 'unverified';
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a secure URL-safe token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('base64url');
}