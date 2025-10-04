/**
 * Audit Logging Service
 * Records security-relevant events for compliance and monitoring
 */

import sequelize from '../config/database';
import { AuditLogData } from '../types/auth.types';

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await sequelize.query(
      `INSERT INTO audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address,
        user_agent,
        device_type,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      {
        bind: [data.userId || null, data.action, data.resourceType || null, data.resourceId || null, data.oldValues ? JSON.stringify(data.oldValues) : null, data.newValues ? JSON.stringify(data.newValues) : null, data.ipAddress || null, data.userAgent || null, data.deviceType || null],
      },
    );

    console.log(`📝 Audit log created: ${data.action}${data.userId ? ` by user ${data.userId}` : ''}`);
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Log user signup event
 */
export async function logUserSignup(userId: string, method: 'passwordless' | 'google' | 'facebook' | 'apple', ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'user_signup',
    resourceType: 'user',
    resourceId: userId,
    newValues: { method },
    ipAddress,
    userAgent,
  });
}

/**
 * Log user login event
 */
export async function logUserLogin(userId: string, method: 'passwordless' | 'google' | 'facebook' | 'apple' | 'password', ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'user_login',
    resourceType: 'user',
    resourceId: userId,
    newValues: { method },
    ipAddress,
    userAgent,
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(email: string, reason: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    action: 'failed_login',
    resourceType: 'user',
    newValues: { email, reason },
    ipAddress,
    userAgent,
  });
}

/**
 * Log user logout event
 */
export async function logUserLogout(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'user_logout',
    resourceType: 'user',
    resourceId: userId,
    ipAddress,
    userAgent,
  });
}

/**
 * Log token refresh event
 */
export async function logTokenRefresh(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'token_refreshed',
    resourceType: 'refresh_token',
    ipAddress,
    userAgent,
  });
}

/**
 * Log token reuse detection (security event)
 */
export async function logTokenReuseDetected(userId: string, tokenId: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'token_reuse_detected',
    resourceType: 'refresh_token',
    resourceId: tokenId,
    newValues: { severity: 'HIGH', threat: 'potential_token_theft' },
    ipAddress,
    userAgent,
  });
}

/**
 * Log account linking requested
 */
export async function logAccountLinkRequested(userId: string, provider: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'account_link_requested',
    resourceType: 'account_link_request',
    newValues: { provider },
    ipAddress,
    userAgent,
  });
}

/**
 * Log account linked successfully
 */
export async function logAccountLinked(userId: string, provider: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'account_linked',
    resourceType: 'user',
    resourceId: userId,
    newValues: { provider },
    ipAddress,
    userAgent,
  });
}

/**
 * Log passwordless magic link requested
 */
export async function logPasswordlessRequested(email: string, type: 'magic_link' | 'otp', ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    action: 'passwordless_requested',
    resourceType: 'user',
    newValues: { email, type },
    ipAddress,
    userAgent,
  });
}

/**
 * Log email verification
 */
export async function logEmailVerified(userId: string, email: string, ipAddress?: string, userAgent?: string): Promise<void> {
  await createAuditLog({
    userId,
    action: 'email_verified',
    resourceType: 'user',
    resourceId: userId,
    newValues: { email },
    ipAddress,
    userAgent,
  });
}

export default {
  createAuditLog,
  logUserSignup,
  logUserLogin,
  logFailedLogin,
  logUserLogout,
  logTokenRefresh,
  logTokenReuseDetected,
  logAccountLinkRequested,
  logAccountLinked,
  logPasswordlessRequested,
  logEmailVerified,
};
