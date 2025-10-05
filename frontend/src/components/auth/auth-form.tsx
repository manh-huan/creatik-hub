'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { Input } from "@/components/ui/input";
import GoogleIcon from "@/public/icons/google-icon.svg";
import Image from "next/image";

export default function AuthForm({ text }: { text: any}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="sm:flex sm:justify-center overflow-y-hidden">
          <div className="rounded-2xl flex flex-col overflow-hidden sm:w-[400px]">
            <div className="p-6 font-medium md:p-10 bg-blue-50">
              <div className="flex flex-col gap-1 items-center text-center mb-4">
                <h1 className="text-lg text-gray-900 mb-2">
                  {text.heading}
                </h1>
                <p className="font-medium text-gray-500 mt-2">
                  {text.subHeading}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="rounded-lg border h-10 bg-blue-50 hover:bg-blue-100">
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
                <button className="rounded-lg border h-10 bg-blue-50 hover:bg-blue-100">
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
                <button className="rounded-lg border h-10 bg-blue-50 hover:bg-blue-100">
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

              <div className="flex items-center my-2">
                <hr className="h-px bg-base-100 w-full" />
                <p className="text-gray-400">OR</p>
                <hr className="h-px bg-base-100 w-full" />
              </div>

              {/* Only show this text in signup page */}
              {text.showEmailRecommendation && (
              <p className="text-gray-400 my-0 text-center">
                We recommend using your work email.
              </p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mt-4 w">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-gray-500 text-white placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
  );
}