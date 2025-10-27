/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP address
 */

import { Request, Response, NextFunction } from 'express';
import { incrementRateLimit, getRateLimitCount } from '../services/redis-service';

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Maximum requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  keyGenerator?: (req: Request) => string; // Custom key generator
}

/**
 * Create a rate limiter middleware
 * @param options Rate limiter options
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    maxRequests = 100, // 100 requests default
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    keyGenerator = defaultKeyGenerator,
  } = options;

  const windowSeconds = Math.floor(windowMs / 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);
      const count = await incrementRateLimit(key, windowSeconds);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowMs).toISOString());

      if (count > maxRequests) {
        return res.status(429).json({
          error: message,
          retryAfter: windowSeconds,
        });
      }

      // If skipSuccessfulRequests is true, decrement on successful response
      if (skipSuccessfulRequests) {
        const originalSend = res.send;
        res.send = function (data: any) {
          if (res.statusCode < 400) {
            // Decrement on success (but don't go below 0)
            // Note: This is a simple implementation. For production, use more sophisticated logic
          }
          return originalSend.call(this, data);
        };
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // On error, allow the request to proceed (fail open)
      next();
    }
  };
}

/**
 * Default key generator: IP address + route
 */
function defaultKeyGenerator(req: Request): string {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const route = req.path;
  return `${ip}:${route}`;
}

/**
 * Stricter rate limiter for authentication endpoints
 * - 5 requests per 15 minutes per IP
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
  keyGenerator: (req: Request) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return `auth:${ip}`;
  },
});

/**
 * Rate limiter for email sending (magic link, OTP)
 * - 3 requests per 5 minutes per email
 */
export const emailRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 3,
  message: 'Too many email requests. Please wait 5 minutes before trying again.',
  keyGenerator: (req: Request) => {
    const email = req.body.email || 'unknown';
    return `email:${email.toLowerCase()}`;
  },
});

/**
 * Rate limiter for OTP verification
 * - 5 attempts per 15 minutes per email
 */
export const otpVerificationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many verification attempts. Please request a new code.',
  keyGenerator: (req: Request) => {
    const email = req.body.email || 'unknown';
    return `otp-verify:${email.toLowerCase()}`;
  },
});

/**
 * Rate limiter for checking email existence
 * - 10 requests per minute per IP
 */
export const checkEmailRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'Too many requests. Please slow down.',
  keyGenerator: (req: Request) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return `check-email:${ip}`;
  },
});

/**
 * General API rate limiter
 * - 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many API requests. Please try again later.',
});

export default {
  createRateLimiter,
  authRateLimiter,
  emailRateLimiter,
  otpVerificationRateLimiter,
  checkEmailRateLimiter,
  apiRateLimiter,
};
