/**
 * JWT (JSON Web Token) Utilities
 * Token generation, verification, and management
 */

import jwt, { Secret } from 'jsonwebtoken';
import { JWTPayload } from '../types/auth.types';
import type { StringValue } from "ms";


if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required');
  process.exit(1);
}
if( !process.env.JWT_ACCESS_EXPIRY || !process.env.JWT_REFRESH_EXPIRY) {
  console.error('JWT_ACCESS_EXPIRY and JWT_REFRESH_EXPIRY are required');
  process.exit(1);
}


// TODO: Move to environment variables in production
const JWT_ACCESS_SECRET : Secret = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET : Secret = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRY : StringValue | number = isNaN(Number(process.env.JWT_REFRESH_EXPIRY)) ? process.env.JWT_REFRESH_EXPIRY as StringValue : Number(process.env.JWT_REFRESH_EXPIRY);
const JWT_ACCESS_EXPIRY : StringValue | number = isNaN(Number(process.env.JWT_ACCESS_EXPIRY)) ? process.env.JWT_ACCESS_EXPIRY as StringValue : Number(process.env.JWT_ACCESS_EXPIRY);
/**
 * Generate a JWT access token
 * @param userId User ID
 * @param role User role (CUSTOMER or ADMIN)
 * @returns Signed JWT access token
 */
export function generateAccessToken(userId: string, role: 'CUSTOMER' | 'ADMIN'): string {
  const payload: JWTPayload = {
    sub: userId,
    role,
  };

  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY as StringValue | number,
    issuer: 'creatik-hub-api',
    audience: 'creatik-hub-frontend',
  });
}

/**
 * Generate a JWT refresh token
 * Note: This is just for the JWT structure. The actual refresh token
 * should be a random string that's hashed and stored in the database.
 * This function is kept for compatibility if you want JWT-based refresh tokens.
 *
 * @param userId User ID
 * @returns Signed JWT refresh token
 */
export function generateRefreshTokenJWT(userId: string): string {
  const payload = {
    sub: userId,
    type: 'refresh',
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
    issuer: 'creatik-hub-api',
    audience: 'creatik-hub-frontend',
  });
}

/**
 * Verify and decode a JWT access token
 * @param token JWT access token
 * @returns Decoded payload or null if invalid
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
      issuer: 'creatik-hub-api',
      audience: 'creatik-hub-frontend',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null;
  }
}

/**
 * Verify and decode a JWT refresh token
 * @param token JWT refresh token
 * @returns Decoded payload or null if invalid
 */
export function verifyRefreshTokenJWT(token: string): { sub: string; type: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'creatik-hub-api',
      audience: 'creatik-hub-frontend',
    }) as { sub: string; type: string };

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Decode a JWT token without verification (for debugging)
 * WARNING: Do not use for authentication! Always verify first.
 * @param token JWT token
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

/**
 * Get token expiration date
 * @param token JWT token
 * @returns Expiration date or null
 */
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeToken(token);

  if (decoded && decoded.exp) {
    return new Date(decoded.exp * 1000);
  }

  return null;
}

/**
 * Check if token is expired
 * @param token JWT token
 * @returns True if expired
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token);

  if (!expiration) {
    return true;
  }

  return expiration < new Date();
}

/**
 * Get time until token expiration (in seconds)
 * @param token JWT token
 * @returns Seconds until expiration, or 0 if expired
 */
export function getTimeUntilExpiration(token: string): number {
  const expiration = getTokenExpiration(token);

  if (!expiration) {
    return 0;
  }

  const now = new Date();
  const diff = Math.floor((expiration.getTime() - now.getTime()) / 1000);

  return Math.max(0, diff);
}

/**
 * Extract user ID from token (without full verification)
 * Useful for logging/debugging, but should not be used for authentication
 * @param token JWT token
 * @returns User ID or null
 */
export function extractUserId(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.sub || null;
}

/**
 * Generate token pair (access + refresh)
 * @param userId User ID
 * @param role User role
 * @returns Object with accessToken and refreshToken
 */
export function generateTokenPair(userId: string, role: 'CUSTOMER' | 'ADMIN'): {
  accessToken: string;
  refreshTokenJWT: string;
} {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshTokenJWT: generateRefreshTokenJWT(userId),
  };
}

export default {
  generateAccessToken,
  generateRefreshTokenJWT,
  verifyAccessToken,
  verifyRefreshTokenJWT,
  decodeToken,
  getTokenExpiration,
  isTokenExpired,
  getTimeUntilExpiration,
  extractUserId,
  generateTokenPair,
};
