/**
 * Auth Utilities
 * Email validation and user data sanitization
 */

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
