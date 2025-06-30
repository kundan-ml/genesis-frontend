'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/utils/auth';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session } = useSession(); // Use the useSession hook
  const [emailid, setEmailid] = useState('');

  useEffect(() => {
    if (session?.user?.email) {
      try {
        setEmailid(session.user.email); // Set the email from the session
      } catch (err) {
        console.log(err);
      }
    }
  }, [session]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);
    if (emailid) {
      login(emailid, 'password');
      // router.push('/');
    }
    try {
      const result = await signIn('github', { redirect: false });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Failed to sign in with GitHub');
    } finally {
      setIsLoading(false);
      router.push('/');
    }
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-neutral-800 sm:px-4">
      <div className="w-full space-y-6 text-neutral-300 sm:max-w-md">
        <div className="text-center">
          {/* <img src="" width={150} className="mx-auto" alt="Logo" /> */}
          <div className="mt-5 space-y-2">
            <h3 className="text-neutral-100 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
            <p>
              Don't have an account? 
              <Link href="signin" className="font-medium text-indigo-400 hover:text-indigo-300"> Sign up</Link>
            </p>
          </div>
        </div>
        <div className="bg-neutral-900 shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full mt-2 px-3 py-2 text-neutral-300 bg-neutral-700 outline-none border border-neutral-600 focus:border-indigo-500 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full mt-2 px-3 py-2 text-neutral-300 bg-neutral-700 outline-none border border-neutral-600 focus:border-indigo-500 shadow-sm rounded-lg"
              />
            </div>
            <button
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg duration-150"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
          <div className="text-center mt-6">
            {/* Uncomment if needed
            <button
              className="w-full px-4 py-2 text-white font-medium bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 rounded-lg duration-150"
              onClick={handleGitHubLogin}
            >
              Sign in with GitHub
            </button>
            */}
          </div>
        </div>
        {/* Uncomment if needed
        <div className="text-center">
          <Link href="javascript:void(0)" className="hover:text-indigo-400">Forgot password?</Link>
        </div>
        */}
      </div>
    </main>
  );
};

export default LoginPage;
