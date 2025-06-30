'use client';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Tutorial = () => {
  return (

    <div className="bg-gradient-to-r dark:from-neutral-800 dark:to-neutral-800">
      <Header />
      <div className="min-h-screen text-white">
        {/* Hero Section */}
        <section className="relative text-center py-16 overflow-hidden">
          <motion.div
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 opacity-10 overflow-hidden"
          >
            <video
              className="w-full h-full object-cover"
              src="/Video/Background_1.mp4" // Replace with your video URL
              autoPlay
              loop
              muted
              playsInline
            />
          </motion.div>

          <h1 className="text-sm text-indigo-400 font-medium max-w-screen-xl mx-auto px-4">
            A highly trained Generative AI Model
          </h1>
          <h1 className="text-7xl font-extrabold mb-6 relative z-10 text-neon-pink glow-sm max-w-screen-xl mx-auto px-4">Welcome to <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]' > Genie Genesis </span></h1>
          <p className="text-3xl mb-12 relative z-10 text-neutral-300 max-w-screen-xl mx-auto px-4">Unlock the Power of AI-Driven Image Generation and Anomaly Detection!</p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-screen-xl mx-auto px-4"
          >
            <video className=" max-w-screen-xl border-neutral-600  mt-10 mx-auto w-3/4 rounded-lg shadow-2xl border-4 border-neon-pink hover:scale-105 transition-transform" controls>
              <source src="/Video/geniegenesis.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </section>

        {/* Gen-AI Section */}
        <section className=" max-w-screen-xl mx-auto px-4 container my-24 ">
          <motion.h2
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            🌟 Gen-AI: Transform Prompts into Stunning Images
          </motion.h2>
          <motion.div
            className="bg-gradient-to-r text-black dark:text-white dark:from-neutral-700 dark:to-neutral-900 from-white to-neutral-300 p-10 rounded-lg shadow-2xl mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-semibold mb-6">How It Works:</h3>
            <ol className="list-decimal ml-6 mb-6 space-y-4 text-lg">
              <li>Select your project from the dropdown (LS3 BV, LS3 LPC, or IOL LENS).</li>
              <li>
                Enter one or multiple prompts based on the selected project:
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    <strong>For LS3 LPC and LS3 BV:</strong> Use descriptive sentences separated by commas.
                  </li>
                  <li>
                    <strong>For IOL LENS:</strong> Utilize keywords separated by commas, with separate prompts enclosed in quotes.
                  </li>
                </ul>
              </li>
              <li>Choose the number of images to generate using a slider or integer input.</li>
              <li>Customize advanced settings as needed:</li>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Seed:</strong> Control the randomness of the generation.</li>
                <li><strong>Prompt Strength:</strong> Default is 7.5; adjusting affects creativity and noise in the image.</li>
                <li><strong>Generation Steps:</strong> Default is 25; determines the quality of the output.</li>
                <li><strong>Model Selection:</strong> Default is LensAI-v1-512; choose the best model for your needs.</li>
              </ul>
            </ol>
            <p className="text-lg">After generating images, click on any image to view it in full screen, where you can download, edit prompts, and regenerate as needed.</p>
          </motion.div>

          <div className="flex flex-col items-center mb-16 dark:text-white text-black ">
            <motion.h4
              className="text-2xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Screenshots and Videos
            </motion.h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="dark:bg-neutral-600 bg-neutral-400 p-6 rounded-lg shadow-lg"
              >
                <h5 className="font-semibold text-xl mb-4">Screenshot Example</h5>
                <img src="/images/screen.png" alt="Screenshot Example" className="w-full h-auto rounded-lg" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="dark:bg-neutral-600 bg-neutral-400 p-6 rounded-lg shadow-lg"
              >
                <h5 className="font-semibold text-xl mb-4">Video Tutorial</h5>
                <video className="w-full h-auto rounded-lg" controls>
                  <source src="/Video/genai.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Anomaly Detection Section */}
        <section className="container max-w-screen-xl mx-auto px-4 my-24 ">
          <motion.h2
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            🔍 Anomaly Detection: Identify the Unseen
          </motion.h2>
          <motion.div
            className="bg-gradient-to-r dark:from-neutral-700 dark:to-neutral-900 from-white to-neutral-300 text-black dark:text-white p-10 rounded-lg shadow-2xl mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-semibold mb-6">How It Works:</h3>
            <ol className="list-decimal ml-6 mb-6 space-y-4 text-lg">
              <li>Select your project from the dropdown menu.</li>
              <li>Upload one or multiple images for analysis.</li>
              <li>Adjust advanced settings:</li>
              <ul className="list-disc ml-6 mb-4">
                <li>Select the appropriate model for detection.</li>
                <li>Set the threshold value (default: 0.5) to fine-tune sensitivity.</li>
              </ul>
            </ol>
            <p className="text-lg">View detailed reports of detected anomalies alongside the original images and corresponding anomaly maps.</p>
          </motion.div>

          <div className="flex flex-col items-center mb-16 text-black dark:text-white ">
            <h4 className="text-2xl font-semibold mb-4">Screenshots and Videos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="dark:bg-neutral-600 bg-neutral-400 p-6 rounded-lg shadow-lg"
              >
                <h5 className="font-semibold text-xl mb-4">Screenshot Example</h5>
                <img src="/images/anomaly.png" alt="Screenshot Example" className="w-full h-auto rounded-lg" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="dark:bg-neutral-600 bg-neutral-400 p-6 rounded-lg shadow-lg"
              >
                <h5 className="font-semibold text-xl mb-4">Video Tutorial</h5>
                <video className="w-full h-auto rounded-lg" controls>
                  <source src="/Video/Anomaly.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Anomaly Training Section */}
        <section className="container max-w-screen-xl mx-auto px-4 my-24 ">
          <motion.h2
            className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            🎓 Training: Build Your Own Model
          </motion.h2>
          <motion.div
            className="bg-gradient-to-r dark:from-neutral-700 dark:to-neutral-900 from-white to-neutral-300 text-black dark:text-white p-10 rounded-lg shadow-2xl mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-semibold mb-6">Training Overview:</h3>
            <ol className="list-decimal ml-6 mb-6 space-y-4 text-lg">
              <li>Upload your dataset (images and labels) or choose a predefined dataset.</li>
              <li>Adjust training parameters, such as learning rate (default 0.001), epochs, and batch size.</li>
              <li>Monitor the model’s performance metrics throughout training.</li>
            </ol>
            <p className="text-lg">Validate the trained model using test datasets and adjust accordingly to improve results.</p>
          </motion.div>

          <div className="flex flex-col items-center mb-16 dark:text-white text-black ">
            <motion.h4
              className="text-2xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Screenshots and Video Tutorial
            </motion.h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="dark:bg-neutral-600 bg-neutral-400 p-6 rounded-lg shadow-lg"
              >
                <h5 className="font-semibold text-xl mb-4">Screenshot Example</h5>
                <img src="/images/anomaly-training.png" alt="Training Screenshot" className="w-full h-auto rounded-lg" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="dark:bg-neutral-600 bg-neutral-400 p-6 rounded-lg shadow-lg"
              >
                <h5 className="font-semibold text-xl mb-4">Video Tutorial</h5>
                <video className="w-full h-auto rounded-lg" controls>
                  <source src="/Video/Anomaly.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Tutorial;
