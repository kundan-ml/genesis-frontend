import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import VariableIcon from '@/components/Icons/VariableIcon';
import ImageIcon from '@/components/Icons/ImageIcon';
import EditIcon from '@/components/Icons/EditIcon';
import ReuseIcon from '@/components/Icons/ReuseIcon';
import DownloadIcon from '@/components/Icons/DownloadIcon';
import { useSpring, animated } from 'react-spring';

import Image from 'next/image';
// Define light and dark theme colors
const themeColors = {
  light: {
    background: 'bg-white',
    text: 'text-blue-800',
    border: 'border-neutral-300',
    gradient: 'bg-gradient-to-r from-[#4F46E5] to-[#E114E5]',
    tooltip: 'bg-black text-white'
  },
  dark: {
    background: 'bg-neutral-800',
    text: 'text-blue-300',
    border: 'bg-neutral-800',
    gradient: 'bg-gradient-to-r from-[#4F46E5] to-[#E114E5]',
    tooltip: 'bg-neutral-900 text-white'
  }
};

const Model = ({
  closeModal,
  images,
  key,
  selectedImageType,
  setSelectedImageType,
  selectedModel,
  result,
  anomalyScore,
  darkTheme,
  handleReuse
}) => {
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [imageType, setImageType] = useState('');
  const all_img_type = ['overlapped_image', 'raw_image', 'colormap_image'];
  const imagetype_dict = {
    overlapped_image: 'Overlapped Image',
    raw_image: 'Raw Image',
    colormap_image: 'Colormap Image',
  };
  const raw_image = 'raw_image'
  const [theme, setTheme] = useState('dark');
  const reuseimage = `${process.env.BACKEND_URL}/${images[selectedImageId]?.raw_image || ''}`;

  // const reuseimage = useState(`${process.env.BACKEND_URL}/${images[selectedImageId][raw_image]}`)

  const [scale, setScale] = useState(0.7);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const props = useSpring({
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
  });

  const handleWheel = (event) => {
    setScale((prevScale) => Math.max(0.1, prevScale * (event.deltaY > 0 ? 0.9 : 1.1)));
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + event.movementX * 20,
        y: prevPosition.y + event.movementY * 20,
      }));
    }
  };

  useEffect(() => {
    if (darkTheme) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [darkTheme]);

  useEffect(() => {
    const imageIds = Object.keys(images);
    if (imageIds.length > 0) {
      setSelectedImageId(imageIds[0]);
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleNextImage();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [images]);

  const handleThumbnailClick = (imageId, imageType) => {
    setSelectedImageId(imageId);
    setSelectedImageType(imageType);
    setImageType(imagetype_dict[imageType]);
  };

  const handleNextImage = () => {
    const imageIds = Object.keys(images);
    const currentIndex = imageIds.indexOf(selectedImageId);
    const nextIndex = (currentIndex + 1) % imageIds.length;
    setSelectedImageId(imageIds[nextIndex]);
  };

  const handlePreviousImage = () => {
    const imageIds = Object.keys(images);
    const currentIndex = imageIds.indexOf(selectedImageId);
    const prevIndex = (currentIndex - 1 + imageIds.length) % imageIds.length;
    setSelectedImageId(imageIds[prevIndex]);
  };



  useEffect(() => {
    // Event listener for arrow keys
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentImage = selectedImageId ? images[selectedImageId] : null;

  const Tooltip = ({ text }) => (
    <span
      className={`absolute bottom-full text-xs mb-2 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${themeColors[theme].tooltip}`}
    >
      {text}
    </span>
  );

  const downloadImages = () => {
    if (!selectedImageId || !images[selectedImageId]) return;

    const imageUrls = all_img_type.map((type) => {
      return `${process.env.BACKEND_URL}/${images[selectedImageId][type]}`;
    });

    imageUrls.forEach((url, index) => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a');
          const urlObject = window.URL.createObjectURL(blob);
          link.href = urlObject;
          link.download = `${selectedImageId}-${all_img_type[index]}.jpg`; // Or other extension like .png, .jpeg etc.
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(urlObject); // Clean up after the download
        })
        .catch(error => console.error('Error downloading the image', error));
    });
  };




  return (
    <div className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center`}>
      <div className={`relative md:h-[96vh] scrollbar-hidden sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-900 overflow-hidden dark:text-gray-100 bg-gray-100 overflow-y-scroll text-gray-900  lg:flex rounded-lg p-8 md:py-0`}>
        <div
          className={`absolute top-2 w-full  flex dark:border-gray-700 border-gray-300  border-b-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-gray-500 hover:text-gray-700 focus:outline-none`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer ml-auto mr-4 mt-2"
            fill="none"
            viewBox="0 0 24 24"
            onClick={closeModal}
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

        <div className="relative h-auto  sm:my-auto mx-auto p-0 bg-transparent lg:max-h-[92vh] sm:flex xs:flex-wrap">
        <div className="mx-6 md:w-[400px] md:h-[400px] lg:h-[86vh] lg:w-[86vh] overflow-hidden mt-10 border shadow-lg px-auto dark:bg-black bg-white rounded-lg">
            {/* <TransformWrapper
      initialScale={scale}
      minScale={0.1}
      onPanning={handleUpdate}
      onZooming={handleUpdate}
    >
      <TransformComponent>
        {currentImage ? (
          <img
            className="object-center mx-auto h-auto my-auto rounded mb-4"
            src={`${process.env.BACKEND_URL}/${currentImage[selectedImageType]}`}
            alt="Selected"
          />
        ) : (
          <div className="text-center text-neutral-500">No image available</div>
        )}
      </TransformComponent>
    </TransformWrapper> */}

            <div
              onWheel={handleWheel}

              style={{ overflow: 'hidden', width: '100%', height: '100%' }}
            >
              {currentImage ? (
                <animated.img
                  onMouseMove={handleMouseMove}
                  className="object-center mx-auto h-auto my-auto rounded mb-4"
                  src={`${process.env.BACKEND_URL}/${currentImage[selectedImageType]}`}
                  alt="Selected"
                  style={props}
                />
              ) : (
                <div className="text-center text-neutral-500">No image available</div>
              )}
            </div>
          </div>
        </div>

        <div className={`relative lg:h-[86vh] md:w-[400px] md:text-sm  md:h-auto min-h-[250px]  sm:mt-10 lg:mt-14 sm:w-1/4 min-w-[170px] overflow-hidden dark:bg-neutral-900 dark:text-gray-100' bg-gray-100 text-gray-900  border shadow-lg sm:mx-0 my-4 py-2 px-6 rounded-lg`}>
          <p className={`text-blue-800`}>
            <strong>{imageType || selectedImageType}</strong> <br />

          </p>
          <span
            className={`text-xs py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]  rounded-md`}
          ></span>
          <div className="w-full h-10 flex py-auto items-center gap-14 my-2 py-2 text-2xl">
            <div className="relative group" onClick={downloadImages}>
              <DownloadIcon className={`${themeColors[theme].text}`} />
              <Tooltip text="Download" className="text-white" />
            </div>
            {/* <div className="relative group">
                <EditIcon className={`${themeColors[theme].text}`} />
                <Tooltip text="Edit" />
              </div> */}
            {/* <div 
               onClick={() => handleReuse(reuseimage)}
              className="relative group">
                <ReuseIcon
                className={`${themeColors[theme].text}`} />
                <Tooltip text="Reuse" />
              </div> */}
          </div>
          <div
            className={`text-xs max-px-10 px-1 py-1 text-center text-white font-light bg-gradient-to-r from-[#4F46E5] to-[#E114E5]  rounded-md`}
          >
            <small className="w-full text-center">{selectedModel}</small>
          </div>
          <p className={`my-2 text-sm ${themeColors[theme].text}`}>
            <strong>Result </strong>: {result}
          </p>
          {/* <p className={`my-2 text-sm ${themeColors[theme].text}`}>
              <strong>Anomaly </strong>: {anomalyScore}
            </p> */}

          <div className="flex absolute bottom-4 h-auto">
            <div className="grid grid-cols-3 gap-2">
              {selectedImageId &&
                ['colormap_image', 'overlapped_image', 'raw_image'].map(
                  (imageType) => (
                    <div
                      key={`${selectedImageId}-${imageType}`}
                      className="cursor-pointer mb-2"
                      onClick={() =>
                        handleThumbnailClick(selectedImageId, imageType)
                      }
                    >
                      <img
                        src={`${process.env.BACKEND_URL}/${images[selectedImageId][imageType]}`}
                        className="w-12 h-12 object-cover rounded"
                        alt={`${imageType}`}
                      />
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Model;
