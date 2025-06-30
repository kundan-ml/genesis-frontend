'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import Link from 'next/link';
import { useTheme } from 'next-themes'; // For theme management
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Requires Heroicons or similar

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { username } = useAuth(); // Ensure `username` is correctly initialized
  const { theme, setTheme } = useTheme(); // Access current theme and theme setter

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const baseBg = theme === 'dark' ? 'bg-neutral-900' : 'bg-white';
  const baseText = theme === 'dark' ? 'text-white' : 'text-black';
  const baseBorder = theme === 'dark' ? 'border-neutral-700' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-neutral-700' : 'hover:bg-neutral-200';

  return (
    <nav className={`dark:bg-neutral-900 bg-white  fixed w-full z-20 top-0 start-0 dark:border-neutral-400 border-gray-400 border-b`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1">
        <Link href="/" className="flex items-center sm:w-[200px] overflow-hidden space-x-3 rtl:space-x-reverse">
          <img
            src="/logo.png"
            className="h-10 dark:invert"
            alt="Logo"
          />

          {/* <span className={`self-center text-2xl font-extrabold italic whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r dark:from-white dark:to-[#E114E5] from-[#4F46E5] to-[#E114E5] `}>Genie Genesis</span> */}
        </Link>
        <div className="flex sm:w-[200px] overflow-hidden justify-end md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
          {isClient && (
            <Link href={username ? 'app' : 'login'}>
              <button
                type="button"
                className={`dark:text-white text-black  dark:bg-neutral-900 bg-white dark:hover:text-neutral-400 hover:text-gray-600 hidden sm:block focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-1 text-center`}
              >
                {username ? 'Get started' : 'Login'}
              </button>
            </Link>
          )}
          <button
            onClick={toggleTheme}
            className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg dark:hover:text-neutral-400 hover:text-gray-600`}
          >
            {theme === 'light' ? (
              <MoonIcon className="w-5 h-5 text-gray-800" aria-label="Switch to Dark Mode" />
            ) : (
              <SunIcon className="w-5 h-5 text-yellow-400" aria-label="Switch to Light Mode" />
            )}
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden  dark:bg-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-600`}
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'} mx-auto  dark:bg-neutral-900 bg-white`}
          id="navbar-sticky"
        >
          <ul className={`flex mx-auto sm:w-[580px] flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:text-white text-black`}>
            <li>
              <Link href="/" className={`block py-2 px-3 rounded md:bg-transparent md:p-0 dark:text-white text-black`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="app" className={`block py-2 px-3 rounded dark:hover:text-neutral-400 hover:text-gray-600 md:p-0`}>
                Gen AI
              </Link>
            </li>
            <li>
              <Link href="anomaly" className={`block py-2 px-3 rounded dark:hover:text-neutral-400 hover:text-gray-600 md:p-0`}>
                Anomaly
              </Link>
            </li>
            <li>
              <Link href="tutorial2" className={`block py-2 px-3 rounded dark:hover:text-neutral-400 hover:text-gray-600 md:p-0`}>
                Tutorial
              </Link>
            </li>
            <li>
              <Link href="contact" className={`block py-2 px-3 rounded dark:hover:text-neutral-400 hover:text-gray-600} md:p-0`}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/prompt-library" className={`block py-2 px-3 rounded dark:hover:text-neutral-400 hover:text-gray-600 md:p-0`}>
                prompt-library
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
