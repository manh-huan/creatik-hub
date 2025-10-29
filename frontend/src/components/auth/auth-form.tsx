'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { AuthService } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import OTPVerifyForm from './otp-verify-form';

export default function AuthForm({ text }: { text: any }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const { requestMagicLink, requestOTP, error } = useAuth();
  const isSignUpForm = text.isSignUpForm;

  // If OTP sent, show OTP verification form
  if (otpSent) {
    return (
      <OTPVerifyForm
        email={email}
        onBack={() => {
          setOtpSent(false);
          setEmail('');
          setStatusMessage(null);
        }}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Check if email exists
      const { exists } = await AuthService.checkEmailExists(email);

      if (isSignUpForm) {
        // SIGNUP FLOW
        if (exists) {
          // Email already exists - send OTP for login
          await requestOTP(email);
          setOtpSent(true);
        } else {
          // Email doesn't exist - create account and send magic link
          await requestMagicLink(email);
          setMagicLinkSent(true);
          setStatusMessage({
            type: 'success',
            text: `Check your email! We've sent a verification link to ${email} to complete your signup.`,
          });
        }
      } else {
        // LOGIN FLOW
        if (exists) {
          // Email exists - send OTP for login
          await requestOTP(email);
          setOtpSent(true);
        } else {
          // Email doesn't exist - send magic link to create account
          await requestMagicLink(email);
          setMagicLinkSent(true);
          setStatusMessage({
            type: 'info',
            text: `No account found with ${email}. We've sent you a link to create your account.`,
          });
        }
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setOtpSent(false);
    setMagicLinkSent(false);
    setStatusMessage(null);
  };

  return (
    <div className="sm:flex sm:justify-center overflow-y-hidden">
      <div className="rounded-2xl absolute top-1/2 -translate-y-1/2 flex flex-col overflow-hidden sm:w-[400px]">
        <div className="card">
          <div className="flex flex-col gap-1 items-center text-center mb-4">
            <h1 className="text-lg text-gray-900 mb-2">{text.heading}</h1>
            <p className="font-medium text-gray-500 mt-2">{text.subHeading}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button className="btn-secondary">
              <div className="flex items-center justify-center">
                <Image
                  src="/images/google-icon.svg"
                  alt="Google"
                  className="w-[1.1rem] h-[1.2rem] mr-2"
                  width={15} // Set the width in pixels
                  height={15}
                />
                <span>{text.authGoogle}</span>
              </div>
            </button>
            <button className="btn-secondary">
              <div className="flex items-center justify-center">
                <Image
                  src="/images/apple-icon.svg"
                  alt="Apple"
                  className="w-[1.1rem] h-[1.2rem] mr-2"
                  width={15} // Set the width in pixels
                  height={15}
                />
                <span>{text.authApple}</span>
              </div>
            </button>
            <button className="btn-secondary">
              <div className="flex items-center justify-center">
                <Image
                  src="/images/facebook-icon.svg"
                  alt="Facebook"
                  className="w-[1.1rem] h-[1.2rem] mr-2"
                  width={15} // Set the width in pixels
                  height={15}
                />
                <span>{text.authFacebook}</span>
              </div>
            </button>
          </div>

          <div className="flex items-center my-2 gap-2">
            <hr className="w-full" />
            <p className="text-gray-400 ">OR</p>
            <hr className="w-full" />
          </div>

          {/* Only show this text in signup page */}
          {isSignUpForm && <p className="text-gray-400 my-0 text-center">We recommend using your work email.</p>}

          {/* Status Message */}
          {statusMessage && (
            <div className={`mt-4 p-4 border rounded-lg ${statusMessage.type === 'success' ? 'bg-green-50 border-green-200' : statusMessage.type === 'info' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm text-center ${statusMessage.type === 'success' ? 'text-green-700' : statusMessage.type === 'info' ? 'text-blue-700' : 'text-red-700'}`}>{statusMessage.text}</p>
            </div>
          )}

          {/* Email Input Form (shown when no email sent yet) */}
          {!otpSent && !magicLinkSent && (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col w-full">
              <div className="flex w-full">
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input h-12 placeholder:text-gray-400" placeholder="Ex: creatikhub@gmail.com" required />
              </div>
              <button type="submit" className="btn-primary mt-4 py-2 px-4 " disabled={isLoading}>
                <span>{isLoading ? 'Checking...' : isSignUpForm ? 'Sign Up' : 'Sign In'}</span>
              </button>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </form>
          )}

          {/* Magic Link Sent Message */}
          {magicLinkSent && (
            <div className="mt-4">
              <button type="button" onClick={handleReset} className="btn-primary">
                Try another email
              </button>
            </div>
          )}

          <div className="flex flex-col gap-1 items-center text-center mb-4 mt-4">
            <p className="font-medium text-gray-500 mt-2">{text.terms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
