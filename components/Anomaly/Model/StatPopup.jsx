import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';
const StatsPopup = ({ stats, onClose }) => {
  // Detect current theme
  const isDarkTheme = true

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  return (
    <div className={`fixed inset-0 ${isDarkTheme ? 'bg-gray-900' : 'bg-black'} bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out`}>
      <div
        className={`relative ${isDarkTheme ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600' : 'bg-gradient-to-br from-blue-500 via-teal-500 to-green-500'} p-8 rounded-lg shadow-2xl ${isDarkTheme ? 'text-gray-100' : 'text-white'} transform scale-95 transition-transform duration-500 ease-out hover:scale-100 animate-popup`}
      >
        <button
          className={`absolute top-4 right-4 ${isDarkTheme ? 'text-gray-300' : 'text-white'} hover:text-gray-400 transition-colors duration-300 ease-in-out`}
          onClick={onClose}
        >
          <FaTimes className="text-3xl" />
        </button>
        <h2 className={`text-4xl font-extrabold mb-6 tracking-wide text-center drop-shadow-xl ${isDarkTheme ? 'text-gray-100' : 'text-white'}`}>Image Statistics</h2>
        <div className="space-y-4">
          {[
            { label: 'Total Images', value: stats.totalImages, icon: <FaCheckCircle className={isDarkTheme ? 'text-yellow-300' : 'text-yellow-400'} /> },
            { label: 'Pass Images', value: stats.passImages, icon: <FaCheckCircle className={isDarkTheme ? 'text-green-400' : 'text-green-300'} /> },
            { label: 'Fail Images', value: stats.failImages, icon: <FaTimesCircle className={isDarkTheme ? 'text-red-500' : 'text-red-400'} /> },
            { label: 'Pass Percentage', value: `${stats.passPercentage}%`, icon: <FaCheckCircle className={isDarkTheme ? 'text-blue-400' : 'text-blue-300'} /> },
            { label: 'Fail Percentage', value: `${stats.failPercentage}%`, icon: <FaTimesCircle className={isDarkTheme ? 'text-red-500' : 'text-red-400'} /> }
          ].map(({ label, value, icon }, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-lg border ${isDarkTheme ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-100'} shadow-md hover:bg-opacity-30 transition-colors duration-300 ease-in-out`}
            >
              {icon}
              <div className="flex-grow flex justify-between items-center">
                <span className={`text-lg font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-900'}`}>{label}:</span>
                <span className={`text-lg font-semibold ${isDarkTheme ? 'text-gray-100' : 'text-gray-800'}`}>{value}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          className={`mt-8 w-full ${isDarkTheme ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'} text-white font-bold py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105`}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatsPopup;
