// components/CustomAlert.js
import React from 'react';
import { motion } from 'framer-motion';

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark overlay with a smooth fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black bg-opacity-70 w-full h-full absolute"
        onClick={onClose}
      ></motion.div>

      {/* Animated Alert Box with pop-up effect */}
      <motion.div
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="relative z-10 max-w-lg w-full p-8 bg-neutral-900 rounded-xl shadow-xl border border-neutral-700 backdrop-blur-lg"
      >
        {/* Glowing Gradient Border */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-lg"></div>

        {/* Alert Heading */}
        <h2 className="text-3xl font-extrabold text-neutral-100 mb-4 relative z-10 tracking-wider">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
            Important Alert
          </span>
        </h2>

        {/* Message Body with soft fading effect */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-300 mb-6 relative z-10"
        >
          {message}
        </motion.p>

        {/* Action Buttons with glowing hover effect */}
        <div className="flex justify-end space-x-4 relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-2xl transition-shadow duration-300"
            onClick={onClose}
          >
            Close
          </motion.button>
        </div>

        {/* Subtle corner lighting effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-700 opacity-20 blur-2xl rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-700 opacity-20 blur-2xl rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default CustomAlert;


