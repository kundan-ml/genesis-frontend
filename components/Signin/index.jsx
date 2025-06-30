'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const BACKEND_URL = process.env.BACKEND_URL;

  async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/createuser/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.');
      }

      const data = await response.json();
      console.log('Response from backend:', data);
      router.push('/login');
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-full flex bg-neutral-800 my-10">
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-lg space-y-8 px-4 bg-neutral-800 text-gray-300 sm:px-0 rounded-lg ">
          <div>
            <img src="https://floatui.com/logo.svg" width={150} className="lg:hidden" />
            <div className="mt-5 space-y-2 text-center  ">
              <h3 className="text-white text-2xl font-bold sm:text-3xl">Sign up</h3>
              <p>
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <form onSubmit={handleRegister} className=" bg-neutral-900 shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
            <div>
              <label className="font-medium">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full mt-2 px-3 py-2 text-neutral-300 bg-neutral-700 outline-none border border-neutral-600 focus:border-indigo-500 shadow-sm rounded-lg"
              />
            </div>
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
            <div>
              <label className="font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full mt-2 px-3 py-2 text-neutral-300 bg-neutral-700 outline-none border border-neutral-600 focus:border-indigo-500 shadow-sm rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg duration-150"
            >
              {isLoading ? 'Registering...' : 'Create account'}
            </button>
            {error && (
              <div className="relative bg-red-200 text-red-800 px-4 py-3 rounded">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">{error}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <svg
                    className="fill-current h-6 w-6 text-red-800"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path
                      d="M14.348 5.652a1 1 0 1 0-1.414-1.414L10 7.172 7.066 4.238a1 1 0 0 0-1.414 1.414L8.828 10l-3.176 3.176a1 1 0 1 0 1.414 1.414L10 12.828l3.176 3.176a1 1 0 1 0 1.414-1.414L11.172 10l3.176-3.176z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
