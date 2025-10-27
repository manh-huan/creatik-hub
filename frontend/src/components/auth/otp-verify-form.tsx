'use client';

import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth';
import { ArrowLeft, Mail, Heart } from 'lucide-react';
import Image from 'next/image';

interface OTPVerifyFormProps {
  email: string;
  onBack?: () => void;
}

export default function OTPVerifyForm({ email, onBack }: OTPVerifyFormProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const { verifyOTP, requestOTP } = useAuth();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) setCanResend(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter all 6 digits',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      await verifyOTP(email, otpCode);
      router.push('/dashboard');
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid code. Please try again.',
      });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await requestOTP(email);
      setCountdown(45);
      setCanResend(false);
      setStatusMessage({
        type: 'success',
        text: 'Code resent successfully!',
      });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to resend code',
      });
    }
  };

  const openEmail = (provider: 'gmail' | 'outlook') => {
    const urls = {
      gmail: 'https://mail.google.com',
      outlook: 'https://outlook.live.com',
    };
    window.open(urls[provider], '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-xl p-8 md:p-10">
        {/* Back Button */}
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        {/* Envelope Icon with Hearts */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
              <Mail size={40} className="text-white transform -rotate-3" />
            </div>
            {/* Floating Hearts */}
            <Heart size={16} className="absolute -top-1 -right-2 text-pink-400 fill-pink-400 animate-pulse" />
            <Heart size={12} className="absolute -bottom-1 -left-2 text-pink-300 fill-pink-300 animate-pulse delay-150" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Confirm your email</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We sent you an email to <strong className="text-gray-900">{email}</strong> that contains the pin code to sign you in.
          </p>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mb-6 p-3 rounded-xl text-sm text-center ${
              statusMessage.type === 'success'
                ? 'bg-green-50 text-green-700'
                : statusMessage.type === 'info'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-red-50 text-red-700'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6-Digit Code Inputs */}
          <div className="flex justify-center gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={setInputRef(index)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-semibold rounded-xl transition-all ${
                  digit
                    ? 'border-2 border-blue-500 bg-blue-50 text-blue-900'
                    : index === otp.findIndex((d) => !d)
                      ? 'border-2 border-blue-500 bg-white'
                      : 'border-2 border-gray-200 bg-white'
                } focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500`}
              />
            ))}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isLoading || otp.some((d) => !d)}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Verifying...' : 'Continue with login code'}
          </button>
        </form>

        {/* Resend Code */}
        <div className="text-center mt-4">
          {canResend ? (
            <button onClick={handleResend} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Didn't receive the code? <span className="underline">Resend code</span>
            </button>
          ) : (
            <p className="text-sm text-gray-500">Didn't receive the code? Resend code ({countdown}s)</p>
          )}
        </div>

        {/* Email Client Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => openEmail('gmail')}
            className="flex-1 h-11 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all bg-white hover:bg-gray-50"
          >
            <Image src="/images/google-icon.svg" alt="Gmail" width={20} height={20} />
            <span className="text-sm font-medium text-gray-700">Open Gmail</span>
          </button>
          <button
            type="button"
            onClick={() => openEmail('outlook')}
            className="flex-1 h-11 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all bg-white hover:bg-gray-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="#0078D4" />
              <path d="M6 8L12 12L18 8V18H6V8Z" fill="white" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Open Outlook</span>
          </button>
        </div>

        {/* Wrong Email Link */}
        {onBack && (
          <div className="text-center mt-6">
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">
              Wrong email? <span className="underline">Try again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
