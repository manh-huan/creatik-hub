/**
 * Authentication Type Definitions
 */

export interface JWTPayload {
  sub: string; // User ID
  role: 'CUSTOMER' | 'ADMIN';
  iat?: number; // Issued at
  exp?: number; // Expiration
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedRequest {
  user?: {
    id: string;
    role: 'CUSTOMER' | 'ADMIN';
    email: string;
  };
}

export interface OAuthProvider {
  name: 'google' | 'facebook' | 'apple';
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
}

export interface OAuthProfile {
  provider: string;
  providerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

export interface PasswordlessTokenData {
  userId?: string;
  email: string;
  type: 'magic_link' | 'otp';
}

export interface AccountLinkTokenData {
  userId: string;
  provider: string;
  providerId: string;
  providerEmail: string;
}

export interface OAuthStateData {
  provider: string;
  nonce: string;
  redirectUrl?: string;
}

export interface DeviceInfo {
  ip?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

export interface AuditLogData {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
}

export type AuthProvider = 'local' | 'google' | 'facebook' | 'apple';

export interface CreateUserInput {
  email: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  provider?: AuthProvider;
  providerId?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
}
