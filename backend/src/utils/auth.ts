
import type { StringValue } from "ms";
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

// Validate JWT secret exists and is secure
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set and at least 32 characters long');
  process.exit(1);
}

const JWT_EXPIRES_IN: StringValue | number = process.env.JWT_EXPIRES_IN
  ? isNaN(Number(process.env.JWT_EXPIRES_IN))
    ? (process.env.JWT_EXPIRES_IN as StringValue)
    : Number(process.env.JWT_EXPIRES_IN)
  : '7d';

const SALT_ROUNDS = 12; 

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

// Enhanced password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Sanitize user data for logging (remove sensitive info)
export const sanitizeUserForLogging = (user: any) => {
  const { password, passwordHash, password_hash, ...sanitized } = user;
  return sanitized;
};