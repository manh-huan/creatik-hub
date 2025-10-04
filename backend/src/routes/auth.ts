import { Router } from 'express';
import {
  logout,
  getProfile,
  requestPasswordlessMagicLink,
  verifyPasswordlessMagicLink,
  requestPasswordlessOTP,
  verifyPasswordlessOTP,
  refreshAccessToken,
} from '../controllers/auth-controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ============================================================================
// PASSWORDLESS AUTH (Magic Link & OTP)
// ============================================================================
// Magic link flow
router.post('/passwordless/request', requestPasswordlessMagicLink);
router.post('/passwordless/verify', verifyPasswordlessMagicLink);

// OTP flow
router.post('/passwordless/otp/request', requestPasswordlessOTP);
router.post('/passwordless/otp/verify', verifyPasswordlessOTP);

// ============================================================================
// SSO AUTH (Google, Facebook, Apple)
// ============================================================================
// TODO: Add SSO routes here
// router.get('/oauth/:provider', initiateOAuth);
// router.get('/oauth/callback', handleOAuthCallback);

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================
router.post('/token/refresh', refreshAccessToken);
router.post('/logout', logout);

// ============================================================================
// PROTECTED ROUTES
// ============================================================================
router.get('/profile', authenticateToken, getProfile);

export default router;
