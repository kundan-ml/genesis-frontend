import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import VariableIcon from '../Icons/VariableIcon';
import ImageIcon from '../Icons/ImageIcon';
import EditIcon from '../Icons/EditIcon';
import ReuseIcon from '../Icons/ReuseIcon';
import DownloadIcon from '../Icons/DownloadIcon';


const themeColors = {
  light: {
    background: 'bg-white',
    text: 'text-blue-800',
    border: 'border-neutral-300',
    gradient: 'bg-gradient-to-r from-[#4F46E5] to-[#E114E5]',
    tooltip: 'bg-black text-white'
  },
  dark: {
    background: 'bg-neutral-900',
    text: 'text-blue-300',
    border: 'border-neutral-700',
    gradient: 'bg-gradient-to-r from-[#4F46E5] to-[#E114E5]',
    tooltip: 'bg-neutral-900 text-white'
  }
};

const ImageModal = ({ isOpen, imageUrl, onClose, prompt, seed, selectedModel, isGenerating, theme = 'dark' }) => {
  if (!isOpen) return null;

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [showError, setShowError] = useState(false); // Error modal state

  const BACKEND_URL = process.env.BACKEND_URL;

  const calculateAspectRatio = (width, height) => {
    if (width === 0 || height === 0) return "N/A";
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const Tooltip = ({ text }) => (
    <span className={`absolute bg-black text-white bottom-full mb-2 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity dark:bg-neutral-900 dark:text-white`}>
      {text}
    </span>
  );

  useEffect(() => {
    // Event listener for arrow keys
    const handleKeyDown = (event) => {
    if (event.key === 'Escape' ){
      isOpen(false)
    }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const downloadImage = (imageUrl, filename) => {
    fetch(`${BACKEND_URL}/${imageUrl}`)
      .then(response => response.blob())
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(() => alert('An error occurred while downloading the image'));
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  const handleActionClick = (action) => {
      setShowError(true); // Show error modal if images are still generating
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black py-4 bg-opacity-75 flex items-center justify-center ${themeColors[theme].background}`}>
      <div className={`relative md:h-[96vh] sm:my-10 w-4/5 md:w-[70vw] ${themeColors[theme].background} sm:flex xs:flex-wrap rounded-lg p-8 md:py-0`}>
        <div className="absolute top-2 w-full flex border-neutral-400 border-b-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-neutral-500 hover:text-neutral-700 focus:outline-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer ml-auto mr-4 mt-2"
            fill="none"
            viewBox="0 0 24 24"
            onClick={onClose}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="relative h-auto sm:my-auto mx-auto p-0 bg-transparent sm:flex xs:flex-wrap">
          <div className="mx-6 md:w-[auto] overflow-hidden mt-10 border shadow-lg px-auto md:h-auto bg-black rounded-lg">
            <TransformWrapper>
              <TransformComponent>
                <img
                  className="object-center mx-auto my-auto rounded mb-4"
                  src={imageUrl}
                  alt="Selected"
                  onLoad={handleImageLoad}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>

        <div className={`relative h-auto sm:my-10 md:mt-14 sm:w-1/4 min-w-[250px] overflow-hidden ${themeColors[theme].background} border shadow-lg sm:mx-4 my-4 py-4 px-6 rounded-lg`}>
          <p className="text-neutral-200">
            <strong>Prompt</strong> <br />
            {prompt}
          </p>
          <span className="text-xs px-2 py-0 text-white font-light bg-gradient-to-r from-[#4F46E5] to-[#E114E5] rounded-md">
            {selectedModel}
          </span>
          <div className="w-full h-10 flex py-auto items-center gap-4 my-2 py-2 text-2xl">
            <div
              className="relative group text-blue-800"
              onClick={() => downloadImage(imageUrl, imageUrl.split('/').pop())}
            >
              <DownloadIcon />
              <Tooltip text="Download" />
            </div>
            <div className="relative group text-neutral-200 cursor-pointer" onClick={() => handleActionClick('edit')}>
              <EditIcon />
              <Tooltip text="Edit" />
            </div>
            <div className="relative group text-neutral-200 cursor-pointer" onClick={() => handleActionClick('reuse')}>
              <ReuseIcon />
              <Tooltip text="Reuse" />
            </div>
          </div>
          <p className="my-2 text-sm text-neutral-200">
            <strong>Size</strong>: {imageDimensions.width} x {imageDimensions.height} pixels
          </p>
          <p className="my-2 text-sm text-neutral-200">
            <strong>Seed</strong>: {seed}
          </p>
        </div>
      </div>

      {showError && (
        <div className="fixed inset-0 z-60 bg-black  bg-opacity-75 flex items-center justify-center">
          <div className="bg-white dark:bg-black text-black dark:text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>Your images are still generating. Please wait until the process is complete.</p>
            <button
              onClick={() => setShowError(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
