// app/app/LoadingPopup.js
'use client';
import { useEffect } from 'react';

const LoadingPopup = () => {
  useEffect(() => {
    const fetchData = async () => {
      // Simulate data fetch or loading
      setTimeout(() => {
        // You can redirect to the main content or perform actions once loading is done
      }, 5000); // Adjust time as necessary
    };

    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-90 z-50">
      <div className="relative p-8 bg-gradient-to-r from-indigo-700 via-purple-800 to-blue-900 rounded-xl text-center text-white w-96 shadow-xl transform scale-110 animate-pulse">
        {/* Title and Text Animation */}
        <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse">
          Loading...
        </div>

        {/* Spinning Loader */}
        <div className="mt-6 w-24 h-24 border-8 border-t-transparent border-indigo-500 rounded-full animate-spin mx-auto">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-ping"></div>
        </div>

        {/* Message */}
        <div className="mt-6 text-lg font-medium text-gray-200">
          <p>Processing your request...</p>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full animate-ping"></div>
          <div className="absolute w-3 h-3 bg-gradient-to-r from-yellow-300 to-red-500 rounded-full animate-ping delay-200"></div>
          <div className="absolute w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-ping delay-400"></div>
        </div>

        {/* Floating Circles with Glow Effect */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 opacity-70 rounded-full animate-bounce"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-400 opacity-70 rounded-full animate-bounce delay-500"></div>
      </div>
    </div>
  );
};

export default LoadingPopup;
