/**
 * Token Management Service
 * Handles refresh token creation, rotation, and revocation
 */

import { generateSecureToken, hashRefreshToken, compareRefreshToken } from '../utils/crypto';
import { generateAccessToken } from '../utils/jwt';
import RefreshToken from '../models/refresh-token';
import { logTokenRefresh, logTokenReuseDetected } from './audit-service';
import { DeviceInfo, TokenPair } from '../types/auth.types';

const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '30', 10);

/**
 * Create a new refresh token for a user
 */
export async function createRefreshToken(userId: string, deviceInfo?: DeviceInfo, parentTokenId?: string): Promise<{ token: string; tokenId: string }> {
  // Generate secure random token
  const token = generateSecureToken(32);

  // Hash token for storage
  const tokenHash = await hashRefreshToken(token);

  // Calculate expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  // Store in database
  const refreshToken = await RefreshToken.create({
    userId,
    tokenHash,
    deviceInfo: deviceInfo?.userAgent,
    ipAddress: deviceInfo?.ip,
    userAgent: deviceInfo?.userAgent,
    expiresAt,
    parentTokenId: parentTokenId || null,
  });

  return {
    token, // Plain token (send to client)
    tokenId: refreshToken.id, // Token ID (for tracking)
  };
}

/**
 * Verify refresh token and check for reuse
 * Returns user ID if valid, throws error if invalid or reused
 */
export async function verifyRefreshToken(token: string, deviceInfo?: DeviceInfo): Promise<{ userId: string; tokenId: string; isValid: boolean; reuseDetected: boolean }> {
  // Hash the token to look it up
  const tokenHash = await hashRefreshToken(token);

  // Find token in database
  const refreshToken = await RefreshToken.findOne({
    where: { tokenHash },
  });

  if (!refreshToken) {
    return {
      userId: '',
      tokenId: '',
      isValid: false,
      reuseDetected: false,
    };
  }

  // Check if token is revoked
  if (refreshToken.isRevoked) {
    // Check if this token has been used to generate a child token
    const hasChildren = await RefreshToken.count({
      where: { parentTokenId: refreshToken.id },
    });

    if (hasChildren > 0) {
      // SECURITY: Token reuse detected!
      // Revoke entire token family
      await revokeTokenFamily(refreshToken.userId);

      // Log security event
      await logTokenReuseDetected(refreshToken.userId, refreshToken.id, deviceInfo?.ip, deviceInfo?.userAgent);

      return {
        userId: refreshToken.userId,
        tokenId: refreshToken.id,
        isValid: false,
        reuseDetected: true,
      };
    }

    return {
      userId: refreshToken.userId,
      tokenId: refreshToken.id,
      isValid: false,
      reuseDetected: false,
    };
  }

  // Check if token is expired
  if (new Date() > refreshToken.expiresAt) {
    return {
      userId: refreshToken.userId,
      tokenId: refreshToken.id,
      isValid: false,
      reuseDetected: false,
    };
  }

  // Token is valid
  return {
    userId: refreshToken.userId,
    tokenId: refreshToken.id,
    isValid: true,
    reuseDetected: false,
  };
}

/**
 * Rotate refresh token (revoke old, create new)
 * This is the core of the token rotation security mechanism
 */
export async function rotateRefreshToken(oldToken: string, deviceInfo?: DeviceInfo): Promise<TokenPair | null> {
  // Verify old token
  const verification = await verifyRefreshToken(oldToken, deviceInfo);

  if (!verification.isValid) {
    if (verification.reuseDetected) {
      throw new Error('TOKEN_REUSE_DETECTED');
    }
    return null;
  }

  const { userId, tokenId: oldTokenId } = verification;

  // Revoke old token
  await RefreshToken.update(
    {
      isRevoked: true,
      revokedAt: new Date(),
    },
    {
      where: { id: oldTokenId },
    },
  );

  // Get user role for access token
  const User = (await import('../models/user')).default;
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Create new refresh token (with old token as parent)
  const { token: newRefreshToken } = await createRefreshToken(userId, deviceInfo, oldTokenId);

  // Generate new access token
  const newAccessToken = generateAccessToken(userId, user.role as 'CUSTOMER' | 'ADMIN');

  // Log token refresh
  await logTokenRefresh(userId, deviceInfo?.ip, deviceInfo?.userAgent);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

/**
 * Revoke a specific refresh token
 */
export async function revokeRefreshToken(tokenId: string): Promise<void> {
  await RefreshToken.update(
    {
      isRevoked: true,
      revokedAt: new Date(),
    },
    {
      where: { id: tokenId },
    },
  );
}

/**
 * Revoke all refresh tokens for a user (logout from all devices)
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  await RefreshToken.update(
    {
      isRevoked: true,
      revokedAt: new Date(),
    },
    {
      where: {
        userId,
        isRevoked: false,
      },
    },
  );
}

/**
 * Revoke entire token family (used when reuse is detected)
 * This finds the root token and revokes all descendants
 */
export async function revokeTokenFamily(userId: string): Promise<void> {
  // For simplicity, revoke all tokens for the user
  // In a more complex implementation, you could trace the parent chain
  await revokeAllUserTokens(userId);

  console.warn(`⚠️ SECURITY: Revoked all tokens for user ${userId} due to reuse detection`);
}

/**
 * Clean up expired refresh tokens (should be run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await RefreshToken.destroy({
    where: {
      expiresAt: {
        [require('sequelize').Op.lt]: new Date(),
      },
    },
  });

  if (result > 0) {
    console.log(`🧹 Cleaned up ${result} expired refresh tokens`);
  }

  return result;
}

/**
 * Get active refresh tokens for a user
 */
export async function getUserActiveTokens(userId: string): Promise<RefreshToken[]> {
  return await RefreshToken.findAll({
    where: {
      userId,
      isRevoked: false,
      expiresAt: {
        [require('sequelize').Op.gt]: new Date(),
      },
    },
    order: [['createdAt', 'DESC']],
  });
}

export default {
  createRefreshToken,
  verifyRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  revokeTokenFamily,
  cleanupExpiredTokens,
  getUserActiveTokens,
};
