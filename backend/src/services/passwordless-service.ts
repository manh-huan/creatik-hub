/**
 * Passwordless Authentication Service
 * Handles magic link and OTP authentication flows
 */

import { generateSecureToken, hashToken, generateOTP } from '../utils/crypto';
import { generateAccessToken } from '../utils/jwt';
import { storePasswordlessToken, getPasswordlessToken, deletePasswordlessToken, storeOTP, getOTP, deleteOTP } from './redis-service';
import { sendEmail, getMagicLinkEmailTemplate, getOTPEmailTemplate, getWelcomeEmailTemplate } from '../config/email';
import { createRefreshToken } from './token-service';
import { logPasswordlessRequested, logUserLogin, logUserSignup, logEmailVerified, logFailedLogin } from './audit-service';
import User from '../models/user';
import { DeviceInfo, TokenPair, PasswordlessTokenData } from '../types/auth.types';

/**
 * Request magic link for passwordless authentication
 */
export async function requestMagicLink(email: string, deviceInfo?: DeviceInfo): Promise<{ success: boolean; message: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ where: { email: normalizedEmail } });
    let isNewUser = false;

    if (!user) {
      // Create new user (they'll complete signup after verification)
      user = await User.create({
        email: normalizedEmail,
        provider: 'local',
        emailVerified: false,
        role: 'CUSTOMER',
      });
      isNewUser = true;
    }

    // Generate secure token
    const token = generateSecureToken(32);
    const tokenHash = hashToken(token);

    // Store token data in Redis (5 min expiry)
    const tokenData: PasswordlessTokenData = {
      userId: user.id,
      email: normalizedEmail,
      type: 'magic_link',
    };

    await storePasswordlessToken(tokenHash, tokenData, 5 * 60);

    // Send magic link email
    const emailTemplate = getMagicLinkEmailTemplate(normalizedEmail, token);
    await sendEmail({
      to: normalizedEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    // Log event
    await logPasswordlessRequested(normalizedEmail, 'magic_link', deviceInfo?.ip, deviceInfo?.userAgent);

    return {
      success: true,
      message: 'Magic link sent to your email',
    };
  } catch (error) {
    console.error('Magic link request error:', error);
    throw new Error('Failed to send magic link');
  }
}

/**
 * Verify magic link token and authenticate user
 */
export async function verifyMagicLink(token: string, deviceInfo?: DeviceInfo): Promise<{ user: any; tokens: TokenPair; isNewUser: boolean } | null> {
  try {
    // Hash token to look it up
    const tokenHash = hashToken(token);

    // Get token data from Redis
    const tokenData = await getPasswordlessToken(tokenHash);

    if (!tokenData) {
      await logFailedLogin('unknown', 'Invalid or expired magic link', deviceInfo?.ip, deviceInfo?.userAgent);
      return null;
    }

    // Delete token (single-use)
    await deletePasswordlessToken(tokenHash);

    // Get user
    const user = await User.findByPk(tokenData.userId);

    if (!user) {
      await logFailedLogin(tokenData.email, 'User not found', deviceInfo?.ip, deviceInfo?.userAgent);
      return null;
    }

    const isNewUser = !user.emailVerified;

    // Update user
    await user.update({
      emailVerified: true,
      lastLoginAt: new Date(),
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role as 'CUSTOMER' | 'ADMIN');
    const { token: refreshToken } = await createRefreshToken(user.id, deviceInfo);

    // Log events
    if (isNewUser) {
      await logUserSignup(user.id, 'passwordless', deviceInfo?.ip, deviceInfo?.userAgent);
      await logEmailVerified(user.id, user.email, deviceInfo?.ip, deviceInfo?.userAgent);

      // Send welcome email
      try {
        const welcomeTemplate = getWelcomeEmailTemplate(user.firstName);
        await sendEmail({
          to: user.email,
          subject: welcomeTemplate.subject,
          html: welcomeTemplate.html,
        });
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't fail the auth flow if welcome email fails
      }
    } else {
      await logUserLogin(user.id, 'passwordless', deviceInfo?.ip, deviceInfo?.userAgent);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
      isNewUser,
    };
  } catch (error) {
    console.error('Magic link verification error:', error);
    throw new Error('Failed to verify magic link');
  }
}

/**
 * Request OTP for passwordless authentication
 */
export async function requestOTP(email: string, deviceInfo?: DeviceInfo): Promise<{ success: boolean; message: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      // Create new user
      user = await User.create({
        email: normalizedEmail,
        provider: 'local',
        emailVerified: false,
        role: 'CUSTOMER',
      });
    }

    // Generate OTP
    const otp = generateOTP(6);

    // Store OTP in Redis (5 min expiry)
    await storeOTP(normalizedEmail, otp, 5 * 60);

    // Send OTP email
    const emailTemplate = getOTPEmailTemplate(normalizedEmail, otp);
    await sendEmail({
      to: normalizedEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    // Log event
    await logPasswordlessRequested(normalizedEmail, 'otp', deviceInfo?.ip, deviceInfo?.userAgent);

    return {
      success: true,
      message: 'OTP sent to your email',
    };
  } catch (error) {
    console.error('OTP request error:', error);
    throw new Error('Failed to send OTP');
  }
}

/**
 * Verify OTP and authenticate user
 */
export async function verifyOTP(email: string, otp: string, deviceInfo?: DeviceInfo): Promise<{ user: any; tokens: TokenPair; isNewUser: boolean } | null> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Get stored OTP
    const storedOTP = await getOTP(normalizedEmail);

    if (!storedOTP || storedOTP !== otp) {
      await logFailedLogin(normalizedEmail, 'Invalid OTP', deviceInfo?.ip, deviceInfo?.userAgent);
      return null;
    }

    // Delete OTP (single-use)
    await deleteOTP(normalizedEmail);

    // Get user
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      await logFailedLogin(normalizedEmail, 'User not found', deviceInfo?.ip, deviceInfo?.userAgent);
      return null;
    }

    const isNewUser = !user.emailVerified;

    // Update user
    await user.update({
      emailVerified: true,
      lastLoginAt: new Date(),
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role as 'CUSTOMER' | 'ADMIN');
    const { token: refreshToken } = await createRefreshToken(user.id, deviceInfo);

    // Log events
    if (isNewUser) {
      await logUserSignup(user.id, 'passwordless', deviceInfo?.ip, deviceInfo?.userAgent);
      await logEmailVerified(user.id, user.email, deviceInfo?.ip, deviceInfo?.userAgent);

      // Send welcome email
      try {
        const welcomeTemplate = getWelcomeEmailTemplate(user.firstName);
        await sendEmail({
          to: user.email,
          subject: welcomeTemplate.subject,
          html: welcomeTemplate.html,
        });
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    } else {
      await logUserLogin(user.id, 'passwordless', deviceInfo?.ip, deviceInfo?.userAgent);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
      isNewUser,
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    throw new Error('Failed to verify OTP');
  }
}

export default {
  requestMagicLink,
  verifyMagicLink,
  requestOTP,
  verifyOTP,
};
