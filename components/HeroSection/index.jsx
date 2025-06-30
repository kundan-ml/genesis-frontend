'use client';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <>
      <section className="py-28 flex sm:py-20 dark:bg-neutral-800 bg-neutral-200">
        <div className="max-w-screen-xl mx-auto flex w-full dark:text-gray-200 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
          <div className="flex-row w-100 sm:mx-auto space-y-5 w-auto px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
            <h1 className="text-sm dark:text-indigo-400 text-indigo-700 font-medium italic">
              Generate Images with our Generative AI Model
            </h1>
            <h2 className="text-4xl dark:text-white font-extrabold md:text-5xl text-gray-800">
              Generate images with{' '}
              <span className=" text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">
                Genie Genesis
              </span>
            </h2>
            <p>
              Genie Genesis allows you to transform text descriptions into
              stunning images using our state-of-the-art diffusion model.
            </p>
            <div className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <Link
                href="/app"
                className="block py-2 px-4 text-center text-white font-medium bg-gradient-to-r from-[#4F46E5] to-[#E114E5] duration-150 hover:bg-indigo-600 active:bg-indigo-700 rounded-lg shadow-lg hover:shadow-none"
              >
                Let's get started
              </Link>
              <Link
                href="/tutorial2"
                className="flex items-center justify-center gap-x-2 py-2 px-4 dark:text-gray-200 hover:text-gray-400 font-medium duration-150 active:bg-gray-700 border dark:border-gray-600 rounded-lg md:inline-flex"
              >
                How to use
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 10a.75.75 0 011.5 0h12.59l-2.1-1.95a.75.75 0 011.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H3.5a.75.75 0 010-1.5H17.5"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
