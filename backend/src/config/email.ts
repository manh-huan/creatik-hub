/**
 * Email Service Configuration
 * Supports SendGrid (production) and MailDev (development)
 */

import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'maildev'; // 'sendgrid' or 'maildev'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@creatik-hub.com';
const SENDGRID_FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Creatik Hub';
const MAILDEV_HOST = process.env.MAILDEV_HOST || 'localhost';
const MAILDEV_PORT = parseInt(process.env.MAILDEV_PORT || '1025', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

let nodemailerTransporter: nodemailer.Transporter | null = null;

/**
 * Initialize email service
 */
export function initializeEmailService(): void {
  if (EMAIL_PROVIDER === 'sendgrid') {
    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is required when EMAIL_PROVIDER=sendgrid');
    }
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('✓ Email service initialized (SendGrid)');
  } else {
    // Use MailDev for local development
    nodemailerTransporter = nodemailer.createTransport({
      host: MAILDEV_HOST,
      port: MAILDEV_PORT,
      ignoreTLS: true,
    });
    console.log(`✓ Email service initialized (MailDev at ${MAILDEV_HOST}:${MAILDEV_PORT})`);
  }
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  const { to, subject, html, text } = options;

  try {
    if (EMAIL_PROVIDER === 'sendgrid') {
      await sgMail.send({
        to,
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: SENDGRID_FROM_NAME,
        },
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      });
      console.log(`📧 Email sent to ${to} via SendGrid`);
    } else {
      if (!nodemailerTransporter) {
        initializeEmailService();
      }
      await nodemailerTransporter!.sendMail({
        from: `"${SENDGRID_FROM_NAME}" <${SENDGRID_FROM_EMAIL}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      });
      console.log(`📧 Email sent to ${to} via MailDev`);
    }
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Email template: Magic link for passwordless login
 */
export function getMagicLinkEmailTemplate(email: string, token: string): { subject: string; html: string } {
  const magicLink = `${FRONTEND_URL}/auth/verify?token=${token}`;

  return {
    subject: 'Your Magic Link to Sign In',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign In to Creatik Hub</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #333; font-size: 24px;">🎬 Creatik Hub</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <h2 style="color: #333; font-size: 20px; margin: 0 0 20px;">Sign in to your account</h2>
                    <p style="color: #666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                      Click the button below to sign in to your Creatik Hub account. This link will expire in <strong>5 minutes</strong>.
                    </p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${magicLink}" style="display: inline-block; padding: 14px 40px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                            Sign In Now
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #666; font-size: 14px; line-height: 20px; margin: 20px 0 0;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="color: #4F46E5; font-size: 14px; word-break: break-all; margin: 10px 0 0;">
                      ${magicLink}
                    </p>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                    <p style="color: #999; font-size: 13px; line-height: 18px; margin: 0;">
                      <strong>Didn't request this email?</strong><br>
                      If you didn't request this sign-in link, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                    <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                      © 2025 Creatik Hub. All rights reserved.<br>
                      Questions? Contact us at <a href="mailto:support@creatik-hub.com" style="color: #4F46E5;">support@creatik-hub.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}

/**
 * Email template: OTP code for passwordless login
 */
export function getOTPEmailTemplate(email: string, otp: string): { subject: string; html: string } {
  return {
    subject: 'Your One-Time Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #333; font-size: 24px;">🎬 Creatik Hub</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 40px 40px;">
                    <h2 style="color: #333; font-size: 20px; margin: 0 0 20px;">Your verification code</h2>
                    <p style="color: #666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                      Enter this code to sign in. This code will expire in <strong>5 minutes</strong>.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <div style="display: inline-block; padding: 20px 40px; background-color: #f0f0f0; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                    <p style="color: #999; font-size: 13px; line-height: 18px; margin: 0;">
                      <strong>Didn't request this code?</strong><br>
                      If you didn't request this verification code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                    <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                      © 2025 Creatik Hub. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}

/**
 * Email template: Welcome email for new users
 */
export function getWelcomeEmailTemplate(firstName: string): { subject: string; html: string } {
  return {
    subject: 'Welcome to Creatik Hub! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Creatik Hub</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #333; font-size: 28px;">🎉 Welcome to Creatik Hub!</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 40px 40px;">
                    <p style="color: #666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                      Hi ${firstName || 'there'},
                    </p>
                    <p style="color: #666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">
                      Thanks for signing up! We're excited to have you on board. Creatik Hub makes it easy to create professional-quality videos faster than ever.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; padding: 14px 40px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                            Get Started
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #666; font-size: 16px; line-height: 24px; margin: 20px 0 0;">
                      If you have any questions, feel free to reach out to our support team.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px;">
                    <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                      © 2025 Creatik Hub. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}

export default {
  initializeEmailService,
  sendEmail,
  getMagicLinkEmailTemplate,
  getOTPEmailTemplate,
  getWelcomeEmailTemplate,
};
