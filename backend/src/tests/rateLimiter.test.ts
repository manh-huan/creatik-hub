/**
 * Rate Limiter Tests
 * Manual testing guide for rate limiting functionality
 */

/**
 * Test 1: Email Rate Limiting (Magic Link/OTP Request)
 *
 * Expected: 3 requests per 5 minutes per email
 *
 * Steps:
 * 1. Make POST request to /api/v1/auth/passwordless/request with email
 * 2. Repeat 3 times - should succeed
 * 3. Make 4th request - should return 429 (Too Many Requests)
 * 4. Wait 5 minutes or reset manually
 *
 * Example with curl:
 * ```bash
 * curl -X POST http://localhost:3001/api/v1/auth/passwordless/request \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"test@example.com"}'
 * ```
 */

/**
 * Test 2: OTP Verification Rate Limiting
 *
 * Expected: 5 attempts per 15 minutes per email
 *
 * Steps:
 * 1. Request OTP for an email
 * 2. Make POST request to /api/v1/auth/passwordless/otp/verify
 * 3. Repeat 5 times - should succeed (even with wrong OTP)
 * 4. Make 6th request - should return 429
 *
 * Example with curl:
 * ```bash
 * curl -X POST http://localhost:3001/api/v1/auth/passwordless/otp/verify \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"test@example.com","otp":"123456"}'
 * ```
 */

/**
 * Test 3: Check Email Rate Limiting
 *
 * Expected: 10 requests per minute per IP
 *
 * Steps:
 * 1. Make POST request to /api/v1/auth/check-email
 * 2. Repeat 10 times - should succeed
 * 3. Make 11th request - should return 429
 *
 * Example with curl:
 * ```bash
 * curl -X POST http://localhost:3001/api/v1/auth/check-email \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"test@example.com"}'
 * ```
 */

/**
 * Test 4: Auth Verification Rate Limiting
 *
 * Expected: 5 requests per 15 minutes per IP
 *
 * Steps:
 * 1. Make POST request to /api/v1/auth/passwordless/verify
 * 2. Repeat 5 times - should succeed or fail with invalid token
 * 3. Make 6th request - should return 429
 *
 * Example with curl:
 * ```bash
 * curl -X POST http://localhost:3001/api/v1/auth/passwordless/verify \
 *   -H "Content-Type: application/json" \
 *   -d '{"token":"invalid-token"}'
 * ```
 */

/**
 * Test 5: Rate Limit Headers
 *
 * Expected headers in response:
 * - X-RateLimit-Limit: Maximum requests allowed
 * - X-RateLimit-Remaining: Remaining requests
 * - X-RateLimit-Reset: When the limit resets (ISO timestamp)
 *
 * Steps:
 * 1. Make any rate-limited request
 * 2. Check response headers
 *
 * Example with curl (verbose):
 * ```bash
 * curl -v -X POST http://localhost:3001/api/v1/auth/check-email \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"test@example.com"}'
 * ```
 */

/**
 * Expected Response when rate limited:
 *
 * Status: 429 Too Many Requests
 *
 * Body:
 * {
 *   "error": "Too many requests, please try again later.",
 *   "retryAfter": 900 // seconds
 * }
 *
 * Headers:
 * X-RateLimit-Limit: 5
 * X-RateLimit-Remaining: 0
 * X-RateLimit-Reset: 2025-01-08T12:00:00.000Z
 */

export default {
  // This is just a documentation file
  // Run manual tests using the curl commands above
};
