/**
 * Redis Service
 * Handles token storage, OAuth state, and temporary data in Redis
 */

import { getRedisClient } from '../config/redis';
import { PasswordlessTokenData, OAuthStateData } from '../types/auth.types';

// Key prefixes for different data types
const KEYS = {
  PASSWORDLESS_TOKEN: 'auth:passwordless:',
  OAUTH_STATE: 'auth:oauth:state:',
  OTP: 'auth:otp:',
  RATE_LIMIT: 'ratelimit:',
};

// TTL (Time To Live) in seconds
const TTL = {
  PASSWORDLESS_TOKEN: 5 * 60, // 5 minutes
  OAUTH_STATE: 5 * 60, // 5 minutes
  OTP: 5 * 60, // 5 minutes
  RATE_LIMIT: 15 * 60, // 15 minutes
};

/**
 * Store passwordless token data (magic link or OTP)
 * @param tokenHash Hashed token
 * @param data Token data
 * @param ttl TTL in seconds (default: 5 minutes)
 */
export async function storePasswordlessToken(tokenHash: string, data: PasswordlessTokenData, ttl: number = TTL.PASSWORDLESS_TOKEN): Promise<void> {
  const client = await getRedisClient();
  const key = `${KEYS.PASSWORDLESS_TOKEN}${tokenHash}`;
  await client.setEx(key, ttl, JSON.stringify(data));
}

/**
 * Get passwordless token data
 * @param tokenHash Hashed token
 * @returns Token data or null if not found/expired
 */
export async function getPasswordlessToken(tokenHash: string): Promise<PasswordlessTokenData | null> {
  const client = await getRedisClient();
  const key = `${KEYS.PASSWORDLESS_TOKEN}${tokenHash}`;
  const data = await client.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as PasswordlessTokenData;
}

/**
 * Delete passwordless token (for single-use)
 * @param tokenHash Hashed token
 */
export async function deletePasswordlessToken(tokenHash: string): Promise<void> {
  const client = await getRedisClient();
  const key = `${KEYS.PASSWORDLESS_TOKEN}${tokenHash}`;
  await client.del(key);
}

/**
 * Store OAuth state data
 * @param state OAuth state string
 * @param data State data
 * @param ttl TTL in seconds (default: 5 minutes)
 */
export async function storeOAuthState(state: string, data: OAuthStateData, ttl: number = TTL.OAUTH_STATE): Promise<void> {
  const client = await getRedisClient();
  const key = `${KEYS.OAUTH_STATE}${state}`;
  await client.setEx(key, ttl, JSON.stringify(data));
}

/**
 * Get OAuth state data
 * @param state OAuth state string
 * @returns State data or null if not found/expired
 */
export async function getOAuthState(state: string): Promise<OAuthStateData | null> {
  const client = await getRedisClient();
  const key = `${KEYS.OAUTH_STATE}${state}`;
  const data = await client.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as OAuthStateData;
}

/**
 * Delete OAuth state (after validation)
 * @param state OAuth state string
 */
export async function deleteOAuthState(state: string): Promise<void> {
  const client = await getRedisClient();
  const key = `${KEYS.OAUTH_STATE}${state}`;
  await client.del(key);
}

/**
 * Store OTP for email
 * @param email User email
 * @param otp OTP code
 * @param ttl TTL in seconds (default: 5 minutes)
 */
export async function storeOTP(email: string, otp: string, ttl: number = TTL.OTP): Promise<void> {
  const client = await getRedisClient();
  const key = `${KEYS.OTP}${email.toLowerCase()}`;
  await client.setEx(key, ttl, otp);
}

/**
 * Get OTP for email
 * @param email User email
 * @returns OTP code or null if not found/expired
 */
export async function getOTP(email: string): Promise<string | null> {
  const client = await getRedisClient();
  const key = `${KEYS.OTP}${email.toLowerCase()}`;
  return await client.get(key);
}

/**
 * Delete OTP (after verification)
 * @param email User email
 */
export async function deleteOTP(email: string): Promise<void> {
  const client = await getRedisClient();
  const key = `${KEYS.OTP}${email.toLowerCase()}`;
  await client.del(key);
}

/**
 * Rate limiting: Increment counter
 * @param key Rate limit key (e.g., 'ip:123.456.789.0:login')
 * @param ttl TTL in seconds (default: 15 minutes)
 * @returns Current count
 */
export async function incrementRateLimit(key: string, ttl: number = TTL.RATE_LIMIT): Promise<number> {
  const client = await getRedisClient();
  const rateLimitKey = `${KEYS.RATE_LIMIT}${key}`;

  const count = await client.incr(rateLimitKey);

  // Set expiry on first increment
  if (count === 1) {
    await client.expire(rateLimitKey, ttl);
  }

  return count;
}

/**
 * Rate limiting: Get current count
 * @param key Rate limit key
 * @returns Current count
 */
export async function getRateLimitCount(key: string): Promise<number> {
  const client = await getRedisClient();
  const rateLimitKey = `${KEYS.RATE_LIMIT}${key}`;
  const count = await client.get(rateLimitKey);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Rate limiting: Reset counter
 * @param key Rate limit key
 */
export async function resetRateLimit(key: string): Promise<void> {
  const client = await getRedisClient();
  const rateLimitKey = `${KEYS.RATE_LIMIT}${key}`;
  await client.del(rateLimitKey);
}

/**
 * Store arbitrary data with expiration
 * @param key Redis key
 * @param value Data to store
 * @param ttl TTL in seconds
 */
export async function setWithExpiry(key: string, value: any, ttl: number): Promise<void> {
  const client = await getRedisClient();
  const data = typeof value === 'string' ? value : JSON.stringify(value);
  await client.setEx(key, ttl, data);
}

/**
 * Get arbitrary data
 * @param key Redis key
 * @param parseJSON Whether to parse as JSON (default: true)
 * @returns Data or null if not found
 */
export async function get(key: string, parseJSON: boolean = true): Promise<any> {
  const client = await getRedisClient();
  const data = await client.get(key);

  if (!data) {
    return null;
  }

  if (parseJSON) {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  return data;
}

/**
 * Delete key from Redis
 * @param key Redis key
 */
export async function del(key: string): Promise<void> {
  const client = await getRedisClient();
  await client.del(key);
}

/**
 * Check if key exists
 * @param key Redis key
 * @returns True if exists
 */
export async function exists(key: string): Promise<boolean> {
  const client = await getRedisClient();
  const result = await client.exists(key);
  return result === 1;
}

export default {
  storePasswordlessToken,
  getPasswordlessToken,
  deletePasswordlessToken,
  storeOAuthState,
  getOAuthState,
  deleteOAuthState,
  storeOTP,
  getOTP,
  deleteOTP,
  incrementRateLimit,
  getRateLimitCount,
  resetRateLimit,
  setWithExpiry,
  get,
  del,
  exists,
};
