/**
 * Cryptographic Utilities
 * Secure token generation and hashing functions
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a cryptographically secure random token
 * @param bytes Number of random bytes (default: 32)
 * @returns Hex-encoded token string
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hash a token using SHA-256 (for single-use tokens like magic links)
 * @param token Plain token to hash
 * @returns SHA-256 hash in hex format
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Hash a refresh token using bcrypt (for reusable tokens)
 * @param token Plain refresh token
 * @param rounds Bcrypt rounds (default: 10)
 * @returns Bcrypt hash
 */
export async function hashRefreshToken(token: string, rounds: number = 10): Promise<string> {
  return await bcrypt.hash(token, rounds);
}

/**
 * Compare a plain refresh token with its bcrypt hash
 * @param plainToken Plain refresh token
 * @param hashedToken Bcrypt hashed token
 * @returns True if tokens match
 */
export async function compareRefreshToken(plainToken: string, hashedToken: string): Promise<boolean> {
  return await bcrypt.compare(plainToken, hashedToken);
}

/**
 * Generate OAuth state parameter (for CSRF protection)
 * @returns Secure random state string
 */
export function generateOAuthState(): string {
  return generateSecureToken(32);
}

/**
 * Generate OAuth nonce (for replay attack protection)
 * @returns Secure random nonce string
 */
export function generateOAuthNonce(): string {
  return generateSecureToken(32);
}

/**
 * Generate a secure OTP (One-Time Password)
 * @param length OTP length (default: 6)
 * @returns Numeric OTP string
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}

/**
 * Hash a password using bcrypt
 * @param password Plain password
 * @param rounds Bcrypt rounds (default: 12)
 * @returns Bcrypt hash
 */
export async function hashPassword(password: string, rounds: number = 12): Promise<string> {
  return await bcrypt.hash(password, rounds);
}

/**
 * Compare a plain password with its bcrypt hash
 * @param plainPassword Plain password
 * @param hashedPassword Bcrypt hashed password
 * @returns True if passwords match
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a fingerprint for device tracking
 * @param userAgent User agent string
 * @param ip IP address
 * @returns Device fingerprint hash
 */
export function generateDeviceFingerprint(userAgent: string, ip: string): string {
  const data = `${userAgent}:${ip}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Timing-safe string comparison (prevents timing attacks)
 * @param a First string
 * @param b Second string
 * @returns True if strings are equal
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const bufferA = Buffer.from(a, 'utf-8');
  const bufferB = Buffer.from(b, 'utf-8');

  return crypto.timingSafeEqual(bufferA, bufferB);
}

export default {
  generateSecureToken,
  hashToken,
  hashRefreshToken,
  compareRefreshToken,
  generateOAuthState,
  generateOAuthNonce,
  generateOTP,
  hashPassword,
  comparePassword,
  generateDeviceFingerprint,
  timingSafeEqual,
};
