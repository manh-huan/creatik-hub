import { Request, Response } from 'express';
import { validateEmail } from '../utils/auth';
import { requestMagicLink, verifyMagicLink, requestOTP, verifyOTP } from '../services/passwordless-service';
import { rotateRefreshToken } from '../services/token-service';
import { DeviceInfo } from '../types/auth.types';

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Helper to extract device info from request
 */
function getDeviceInfo(req: Request): DeviceInfo {
  return {
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
    deviceType: undefined, // Could be enhanced with ua-parser-js
  };
}

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear both HttpOnly cookies
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// ============================================================================
// PASSWORDLESS AUTHENTICATION
// ============================================================================

/**
 * Request magic link for passwordless login/signup
 * POST /auth/passwordless/request
 */
export const requestPasswordlessMagicLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const deviceInfo = getDeviceInfo(req);
    const result = await requestMagicLink(email, deviceInfo);

    res.json(result);
  } catch (error) {
    console.error('Request magic link error:', error);
    res.status(500).json({ error: 'Failed to send magic link' });
  }
};

/**
 * Verify magic link token
 * POST /auth/passwordless/verify
 */
export const verifyPasswordlessMagicLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const deviceInfo = getDeviceInfo(req);
    const result = await verifyMagicLink(token, deviceInfo);

    if (!result) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Set both tokens in httpOnly cookies
    res.cookie('access_token', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: result.isNewUser ? 'Account created successfully' : 'Login successful',
      user: result.user,
      isNewUser: result.isNewUser,
    });
  } catch (error) {
    console.error('Verify magic link error:', error);
    res.status(500).json({ error: 'Failed to verify magic link' });
  }
};

/**
 * Request OTP for passwordless login/signup
 * POST /auth/passwordless/otp/request
 */
export const requestPasswordlessOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const deviceInfo = getDeviceInfo(req);
    const result = await requestOTP(email, deviceInfo);

    res.json(result);
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

/**
 * Verify OTP code
 * POST /auth/passwordless/otp/verify
 */
export const verifyPasswordlessOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const deviceInfo = getDeviceInfo(req);
    const result = await verifyOTP(email, otp, deviceInfo);

    if (!result) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // Set both tokens in httpOnly cookies
    res.cookie('access_token', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: result.isNewUser ? 'Account created successfully' : 'Login successful',
      user: result.user,
      isNewUser: result.isNewUser,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// ============================================================================
// TOKEN REFRESH
// ============================================================================

/**
 * Refresh access token using refresh token
 * POST /auth/token/refresh
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const deviceInfo = getDeviceInfo(req);
    const result = await rotateRefreshToken(refreshToken, deviceInfo);

    if (!result) {
      // Clear invalid refresh token
      res.clearCookie('refresh_token');
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Set new tokens in httpOnly cookies
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ message: 'Token refreshed successfully' });
  } catch (error: any) {
    console.error('Token refresh error:', error);

    if (error.message === 'TOKEN_REUSE_DETECTED') {
      res.clearCookie('refresh_token');
      return res.status(401).json({
        error: 'Token reuse detected. Please login again.',
        securityAlert: true,
      });
    }

    res.status(500).json({ error: 'Failed to refresh token' });
  }
};
