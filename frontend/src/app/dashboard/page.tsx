'use client';

import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/20">
      <div className="flex h-100dvh w-100dvh flex-col flex-nowrap">
        <header className="flex-1 sticky py-4 rounded-2xl">
          <Navigation isAuthenticated={isAuthenticated} />
        </header>
        <div className="flex-1 bg-transparent border-transparent h-fit rounded-[32px] justify-items-center m-4">
          <div className="flex w-fit m-12 items-center justify-items-center text-center">
            <span className="text-2xl font-semibold">Your personal Creative Studio</span>
            <span className="ml-2 text-4xl animate-pulse">🎬</span>
            <span className="ml-2 text-2xl font-semibold">is waiting for you!</span>
          </div>
          <div className="border-transparent h-[20.75rem] w-3/4 border m-4 rounded-2xl justify-items-center">
            <div className="flex flex-col h-fit items-center justify-center p-4">
              <span className="text-2xl font-semibold text-gray-800 mb-4">AI-generated content and UGC-style creators to educate, promote, and sell.</span>
            </div>
            <div className="border-4 bg-transparent flex h-[13rem] w-3/4 rounded-2xl bg-white m-3 justify-items-center items-center">
              <textarea id="prompts-textarea" className="outline-none h-full w-full m-6" placeholder="Type in your idea or paste your script here..."></textarea>
              <div className="flex h-3/4 w-fit items-center justify-centerp-4 mr-2">
                <Button size="lg" className="btn-vertical mr-8" variant="secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path
                      fill="#B197FC"
                      d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L384 512C419.3 512 448 483.3 448 448L448 192C448 156.7 419.3 128 384 128L128 128zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
