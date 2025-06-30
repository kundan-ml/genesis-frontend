'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const ServerDownPopup = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Define the event handler without type annotations
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const backgroundOffsetX = (mousePosition.x - window.innerWidth / 2) / 25;
  const backgroundOffsetY = (mousePosition.y - window.innerHeight / 2) / 25;
  const iconOffsetX = (mousePosition.x - window.innerWidth / 2) / 50;
  const iconOffsetY = (mousePosition.y - window.innerHeight / 2) / 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-neutral-800 bg-neutral-800 bg-opacity-95 overflow-hidden">
      {/* Background Animated Particles */}
      <div className="absolute inset-0 -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-gradient-to-br dark:from-orange-500 dark:to-red-600 from-orange-500 to-red-600 rounded-full blur-3xl opacity-50"
            animate={{
              x: [Math.random() * 1000, Math.random() * -1000],
              y: [Math.random() * -500, Math.random() * 500],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Popup */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative max-w-xl w-full p-8 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 rounded-3xl shadow-2xl border border-neutral-600 overflow-hidden"
        style={{
          transform: `translate(${backgroundOffsetX}px, ${backgroundOffsetY}px)`,
        }}
      >
        {/* Glow Ring */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-red-600 to-orange-500 rounded-full blur-3xl opacity-50 animate-ping"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="relative w-28 h-28 flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: 'linear',
            }}
            style={{
              transform: `translate(${iconOffsetX}px, ${iconOffsetY}px)`,
            }}
          >
            <span className="text-6xl font-extrabold text-white drop-shadow-md">⚠️</span>
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            Server Unreachable
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Looks like our servers took an unexpected coffee break. Don’t worry, we’re on it!
          </p>
        </div>

        {/* Animated Button */}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: '0px 0px 20px rgba(255, 105, 135, 0.8)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform"
          >
            Retry Now
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Reach out to{' '}
            <a
              href="mailto:support@geniegenesis.com"
              className="text-orange-400 underline hover:text-red-400"
            >
              support@geniegenesis.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerDownPopup;
