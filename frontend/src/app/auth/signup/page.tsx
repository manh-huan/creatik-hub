"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(email, firstName, lastName, password);
      router.push("/dashboard");
    } catch (error) {
      // Error handled by useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col p-0 bg-blue-100 h-full sm:p-8">
        <div className="flex-1 relative sm:flex sm:items-center sm:justify-center overflow-y-hidden">
          <div className="rounded-2xl z-10 flex flex-col h-full w-full overflow-hidden sm:h-auto sm:max-h-[80vh] sm:w-[400px]">
            <div className="flex flex-col justify-center p-6 h-full font-medium md:p-10 bg-blue-50">
              <div className="flex flex-col gap-1 items-center text-center mb-4">
                <h1 className="text-lg text-gray-900 mb-2">
                  Create your account
                </h1>
                <p className="font-medium text-gray-500 mt-2">
                  Join Creatik-hub to make professional quality videos faster.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="items-center gap-2 font-medium rounded-lg border border-solid h-10 px-6 bg-blue-50 hover:bg-blue-100">
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 48 48"
                      width="16"
                      height="16"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
                      />
                      <path
                        fill="#FF3D00"
                        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </div>
                </button>
                <button className="items-center gap-2 font-medium rounded-lg border border-solid h-10 px-6 bg-blue-50 hover:bg-blue-100">
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 17 17"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M12.4812 8.45515C12.4741 7.14431 13.0622 6.15492 14.2524 5.42628C13.5864 4.46547 12.5804 3.93684 11.252 3.83326C9.9945 3.73325 8.62007 4.57262 8.11706 4.57262C7.58571 4.57262 6.36715 3.86898 5.41072 3.86898C3.4341 3.90112 1.3335 5.45842 1.3335 8.6266C1.3335 9.56241 1.50353 10.5292 1.84359 11.5269C2.29701 12.8377 3.93357 16.0523 5.64097 15.9988C6.53364 15.9773 7.16417 15.3594 8.32606 15.3594C9.45252 15.3594 10.037 15.9988 11.0324 15.9988C12.754 15.9738 14.2347 13.052 14.6668 11.7376C12.3572 10.6411 12.4812 8.52302 12.4812 8.45515ZM10.4763 2.59028C11.4433 1.43302 11.3548 0.379342 11.3264 0.000732422C10.4727 0.0507374 9.4844 0.586506 8.92117 1.24729C8.30126 1.9545 7.9364 2.82959 8.01433 3.8154C8.93888 3.88684 9.78196 3.40822 10.4763 2.59028Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Sign up with Apple</span>
                  </div>
                </button>
                <button className="items-center gap-2 font-medium rounded-lg border border-solid h-10 px-6 bg-blue-50 hover:bg-blue-100">
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 23 23"
                      width="16"
                      height="16"
                    >
                      <path
                        fill="#1877F2"
                        d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.243 0-1.63.771-1.63 1.562v1.874h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"
                      />
                    </svg>
                    <span>Sign up with Facebook</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center my-2">
                <hr className="h-px bg-base-100 w-full" />
                <p className="text-gray-400">OR</p>
                <hr className="h-px bg-base-100 w-full" />
              </div>
              <p className="text-gray-400 my-0 text-center">
                We recommend using your work email.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mt-4 w">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-gray-500 text-white placeholder:text-gray-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// <div className="rounded-2xl z-10 flex flex-col h-full w-full overflow-hidden sm:h-auto sm:max-h-[80vh] sm:w-[400px]">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
//           <div className='shadow-sm -space-y-px'>
//             <input
//               id="firstName"
//               name="firstName"
//               type="text"
//               autoComplete="given-name"
//               required
//               className="appearance-none rounded-sm relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               placeholder="First name"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//             />
//           </div>

//           <div className='shadow-sm -space-y-px'>
//             <input
//               id="lastName"
//               name="lastName"
//               type="text"
//               autoComplete="family-name"
//               required
//               className="appearance-none rounded-sm relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               placeholder="Last name"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//             />
//           </div>
//           <div className='mt-2 mb-2'>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="new-password"
//               required
//               minLength={6}
//               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               placeholder="Password (min 6 characters)"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//             >
//               {isLoading ? 'Creating account...' : 'Sign up'}
//             </button>
//           </div>

//           <div className="text-center">
//             <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
//               Already have an account? Sign in
//             </Link>
//           </div>
//         </form>
//       </div>
