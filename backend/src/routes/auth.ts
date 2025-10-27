import { Router } from 'express';
import { logout, getProfile, requestPasswordlessMagicLink, verifyPasswordlessMagicLink, requestPasswordlessOTP, verifyPasswordlessOTP, refreshAccessToken, checkEmailExists } from '../controllers/auth-controller';
import { authenticateToken } from '../middleware/auth';
import { authRateLimiter, emailRateLimiter, otpVerificationRateLimiter, checkEmailRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================
router.post('/check-email', checkEmailRateLimiter, checkEmailExists);

// ============================================================================
// PASSWORDLESS AUTH (Magic Link & OTP)
// ============================================================================
// Magic link flow
router.post('/passwordless/request', emailRateLimiter, requestPasswordlessMagicLink);
router.post('/passwordless/verify', authRateLimiter, verifyPasswordlessMagicLink);

// OTP flow
router.post('/passwordless/otp/request', emailRateLimiter, requestPasswordlessOTP);
router.post('/passwordless/otp/verify', otpVerificationRateLimiter, verifyPasswordlessOTP);

// ============================================================================
// SSO AUTH (Google, Facebook, Apple)
// ============================================================================
// TODO: Add SSO routes here
// router.get('/oauth/:provider', initiateOAuth);
// router.get('/oauth/callback', handleOAuthCallback);

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================
router.post('/token/refresh', authRateLimiter, refreshAccessToken);
router.post('/logout', logout); // No rate limit needed for logout

// ============================================================================
// PROTECTED ROUTES
// ============================================================================
router.get('/profile', authenticateToken, getProfile);

export default router;
