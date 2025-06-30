import React from 'react';
import { FiEdit, FiTrash, FiArrowRight } from 'react-icons/fi';
import { BsStar, BsSearch } from 'react-icons/bs';

const Fav = () => {
  return (
    <div className="favorites-page min-h-screen bg-gradient-to-br from-neutral-900 via-gray-800 to-black text-gray-200">
      {/* Header Section */}
      <header className="favorites-header p-8 border-b border-neutral-700 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
          Your Favorites
        </h1>
        <nav className="favorites-tabs flex justify-center space-x-8 mb-6">
          <button className="tab px-6 py-2 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-gray-900 rounded-full shadow-lg hover:scale-105 transition-transform">
            Prompts
          </button>
          <button className="tab px-6 py-2 text-base font-semibold bg-neutral-800 text-gray-300 rounded-full shadow hover:bg-neutral-700 hover:scale-105 transition-transform">
            Anomalies
          </button>
          <button className="tab px-6 py-2 text-base font-semibold bg-neutral-800 text-gray-300 rounded-full shadow hover:bg-neutral-700 hover:scale-105 transition-transform">
            Images
          </button>
        </nav>
        <div className="flex justify-center">
          <div className="relative w-3/4 max-w-lg">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search favorites..."
              className="search-bar w-full px-12 py-3 rounded-full bg-neutral-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="favorites-content p-8 space-y-16">
        {/* Prompts Section */}
        <section className="favorites-section">
          <h2 className="text-3xl font-semibold text-center mb-6">Favorite Prompts</h2>
          <div className="favorites-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="prompt-card p-6 rounded-lg bg-gradient-to-tr from-gray-800 to-neutral-700 shadow-lg transform hover:scale-105 hover:shadow-2xl transition-transform">
              <p className="text-gray-300 mb-4">
                "Generate a lens inspired by nature and abstract art."
              </p>
              <small className="text-gray-500 block mb-6">
                Project: <span className="text-blue-400">LS3 BV</span>
              </small>
              <div className="card-actions flex justify-between">
                <button className="use-btn flex items-center px-4 py-2 bg-blue-500 text-gray-900 rounded-full shadow hover:bg-blue-400 transition">
                  Use Prompt <FiArrowRight className="ml-2" />
                </button>
                <button className="edit-btn px-3 py-2 bg-green-500 text-gray-900 rounded-full shadow hover:bg-green-400 transition">
                  <FiEdit />
                </button>
                <button className="delete-btn px-3 py-2 bg-red-500 text-gray-900 rounded-full shadow hover:bg-red-400 transition">
                  <FiTrash />
                </button>
              </div>
            </div>
            {/* More prompt cards... */}
          </div>
        </section>

        {/* Anomalies Section */}
        <section className="favorites-section">
          <div className="relative">
            <h2 className="text-3xl font-semibold text-center mb-6">Favorite Anomalies</h2>
            <div className="absolute inset-x-0 top-1 -z-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 blur-lg opacity-50"></div>
          </div>
          <div className="anomaly-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="anomaly-card p-4 rounded-lg bg-neutral-800 shadow-lg transform hover:scale-105 hover:shadow-2xl transition-transform">
              <img
                src="anomaly-thumbnail.jpg"
                alt="Anomaly Preview"
                className="w-full h-48 object-cover rounded mb-4"
              />
              <small className="text-gray-500 block mb-4">
                Tags: <span className="text-blue-400">High Contrast, Abstract</span>
              </small>
              <div className="card-actions flex space-x-4">
                <button className="view-btn px-4 py-2 bg-blue-500 text-gray-900 rounded-full shadow hover:bg-blue-400 transition">
                  View Details
                </button>
                <button className="delete-btn px-4 py-2 bg-red-500 text-gray-900 rounded-full shadow hover:bg-red-400 transition">
                  Delete
                </button>
              </div>
            </div>
            {/* More anomaly cards... */}
          </div>
        </section>

        {/* Images Section */}
        <section className="favorites-section">
          <h2 className="text-3xl font-semibold text-center mb-6">Favorite Images</h2>
          <div className="image-gallery grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <img
              src="image1.jpg"
              alt="Favorite Image"
              className="gallery-item w-full h-48 object-cover rounded shadow-lg hover:scale-110 transition-transform"
            />
            <img
              src="image2.jpg"
              alt="Favorite Image"
              className="gallery-item w-full h-48 object-cover rounded shadow-lg hover:scale-110 transition-transform"
            />
            {/* More gallery items... */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Fav;
