import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { rotateRefreshToken } from "../services/token-service";
import User from "../models/user";
import { DeviceInfo } from "../types/auth.types";

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
    deviceType: undefined,
  };
}

/**
 * Authenticate token middleware with automatic refresh
 * Supports both Authorization header (Bearer token) and cookies
 * Automatically refreshes expired access tokens using refresh token
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Try to get access token from Authorization header
    const authHeader = req.headers.authorization;
    let accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    // Also check cookie
    if (!accessToken) {
      accessToken = req.cookies["access_token"];
    }

    // 2. Get refresh token from cookie
    const refreshTokenCookie = req.cookies["refresh_token"];

    // 3. If no tokens at all, return 401
    if (!accessToken && !refreshTokenCookie) {
      return res.status(401).json({
        error: "Access token required",
        message: "Please provide an access token via Authorization header or login"
      });
    }

    // 4. Try to verify access token
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);

      if (decoded) {
        // Access token is valid, get user and continue
        const user = await User.findByPk(decoded.sub);

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        return next();
      }
    }

    // 5. Access token is expired or invalid, try to refresh automatically
    if (refreshTokenCookie) {
      console.log('Access token expired, attempting automatic refresh...');

      const deviceInfo = getDeviceInfo(req);
      const result = await rotateRefreshToken(refreshTokenCookie, deviceInfo);

      if (!result) {
        // Refresh failed - token invalid or expired
        res.clearCookie('refresh_token');
        return res.status(401).json({
          error: "Session expired",
          message: "Please login again",
          refreshRequired: true
        });
      }

      // Refresh successful - set new refresh token cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Set the new access token in response header for client to update
      res.setHeader('X-New-Access-Token', result.accessToken);

      // Decode the new access token to get user info
      const decoded = verifyAccessToken(result.accessToken);
      if (!decoded) {
        return res.status(500).json({ error: "Failed to decode refreshed token" });
      }

      const user = await User.findByPk(decoded.sub);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      console.log('✅ Token automatically refreshed for user:', user.email);
      return next();
    }

    // 6. No valid tokens
    return res.status(401).json({
      error: "Invalid or expired token",
      message: "Please login again"
    });

  } catch (error: any) {
    console.error('Authentication error:', error);

    // Handle token reuse detection
    if (error.message === 'TOKEN_REUSE_DETECTED') {
      res.clearCookie('refresh_token');
      return res.status(401).json({
        error: 'Security alert: Token reuse detected',
        message: 'Please login again',
        securityAlert: true,
      });
    }

    return res.status(401).json({
      error: "Authentication failed",
      message: error.message || "Invalid token"
    });
  }
};

// Optional middleware for routes that don't require auth
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies["access_token"];

    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      if (decoded) {
        const user = await User.findByPk(decoded.sub);
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        }
      }
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};
