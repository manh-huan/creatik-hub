"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle real login
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          {/* LEFT: form */}
          <section aria-label="Sign in form" className="max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to your account
            </h1>

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-neutral-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@gmail.com"
                  required
                  className="w-full rounded-full bg-neutral-900 px-5 py-3 outline-none ring-1 ring-neutral-800 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-neutral-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    required
                    className="w-full rounded-full bg-neutral-900 px-5 py-3 pr-12 outline-none ring-1 ring-neutral-800 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400"
                    defaultValue="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-neutral-400 hover:text-neutral-200"
                  >
                    {/* simple eye icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      {show ? (
                        <path d="M3.53 2.47a.75.75 0 1 0-1.06 1.06l2.04 2.04C2.53 7.02 1.3 8.69.64 9.8a1.94 1.94 0 0 0 0 1.9C2.73 14.93 6.86 19 12 19c2.06 0 3.97-.57 5.63-1.5l2.84 2.84a.75.75 0 1 0 1.06-1.06L3.53 2.47zM9.1 8.04l1.4 1.4a3 3 0 0 0 4.06 4.06l1.18 1.18A5 5 0 0 1 7 12c.59-.99 1.35-2.06 2.1-2.96z" />
                      ) : (
                        <path d="M12 5c-5.14 0-9.27 4.07-11.36 7.3a1.94 1.94 0 0 0 0 1.9C2.73 17.93 6.86 22 12 22s9.27-4.07 11.36-7.3a1.94 1.94 0 0 0 0-1.9C21.27 9.07 17.14 5 12 5zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-neutral-400 hover:text-neutral-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 font-medium hover:border-neutral-600 hover:bg-neutral-800"
              >
                Sign in
              </button>

              <p className="text-center text-sm text-neutral-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-neutral-200 hover:underline"
                >
                  Sign up
                </Link>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-800" />
                <span className="text-sm text-neutral-400">Or continue with</span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>

              {/* Google button */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 hover:border-neutral-600 hover:bg-neutral-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                    s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.048,6.053,28.738,4,24,4C12.955,4,4,12.955,4,24
                    s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.816C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                    C33.048,6.053,28.738,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c4.665,0,8.911-1.79,12.107-4.707l-5.594-4.727C28.492,35.847,26.369,36.5,24,36.5
                    c-5.202,0-9.611-3.317-11.271-7.95l-6.5,5.017C9.656,39.663,16.318,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.791,2.235-2.244,4.166-4.097,5.566l5.594,4.727
                    C36.545,39.18,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <span className="font-medium">Google</span>
              </button>

              <p className="text-xs leading-relaxed text-neutral-500">
                By clicking on sign in, you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </section>

          {/* RIGHT: social proof */}
          <aside className="hidden md:flex md:items-center md:justify-center">
            <div className="max-w-md">
              {/* Avatars + rating */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {/* Put real avatar images in /public/avatars/*.jpg */}
                  {["1","2","3","4","5"].map((n) => (
                    <Image
                      key={n}
                      src={`/images/${n}.jpg`}
                      alt={`avatar ${n}`}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full ring-2 ring-neutral-900 object-cover"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1" aria-label="rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-400"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.176 0L6.81 16.31c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.176 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              <p className="mt-2 text-sm text-neutral-400">
                Trusted by 27,000+ creators
              </p>

              <h2 className="mt-10 text-2xl font-semibold leading-snug">
                Join Thousands Of Content Creators
              </h2>
              <p className="mt-3 text-neutral-300">
                Who use StoryShort to create and share their stories.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
