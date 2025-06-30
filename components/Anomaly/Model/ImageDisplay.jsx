import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const ImageDisplay = ({ OutoutImage = {}, darkTheme }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const passImages = OutoutImage.PassImages || [];
  const BACKEND_URL = process.env.BACKEND_URL;

  const openModal = (index) => {
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setCurrentImageIndex(null);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? passImages.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === passImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="w-full flex md:pt-12 relative">
      <div className="relative z-10">
        {passImages.length > 0 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {passImages.map((image, index) => (
                <div
                  key={index}
                  className="relative bg-[#1a1a1a] border group gradient-border overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <img
                    className="w-full min-w-20 min-h-20 object-cover"
                    src={`${BACKEND_URL}${image.image_path}`}
                    alt={`${image.image_name}`}
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {image.image_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {passImages.length === 0 && (
          <p className="text-lg dark:text-gray-300 text-gray-700">No images found.</p>
        )}
      </div>

      {/* Modal */}
      {currentImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-11/12 md:w-3/4 lg:w-1/2">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
            <img
              src={`${BACKEND_URL}${passImages[currentImageIndex].image_path}`}
              alt={passImages[currentImageIndex].image_name}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-white text-center mt-4">
              {passImages[currentImageIndex].image_name}
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button
                className="text-white bg-black bg-opacity-70 p-2 rounded-full"
                onClick={showPreviousImage}
              >
                <FaChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <button
                className="text-white bg-black bg-opacity-70 p-2 rounded-full"
                onClick={showNextImage}
              >
                <FaChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageDisplay;
