'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyMagicLink } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your magic link...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await verifyMagicLink(token);
        setStatus('success');
        setMessage(response.isNewUser ? 'Account created successfully!' : 'Login successful!');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Invalid or expired magic link. Please try again.');
      }
    };

    verify();
  }, [token, verifyMagicLink, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-xl p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'verifying' && (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Loader2 size={40} className="text-white animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 size={40} className="text-white" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <XCircle size={40} className="text-white" />
              </div>
            )}
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {status === 'verifying' && 'Verifying...'}
            {status === 'success' && 'Welcome!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{message}</p>

          {/* Actions */}
          {status === 'success' && (
            <div className="w-full">
              <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
                <Loader2 size={16} className="animate-spin" />
                <span>Redirecting to dashboard...</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="w-full space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Back to Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all hover:bg-gray-50"
              >
                Create New Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
