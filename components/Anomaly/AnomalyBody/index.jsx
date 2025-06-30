import { DownloadIcon, EditIcon, ReuseIcon } from '@/components/Icons';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GrCloudDownload } from 'react-icons/gr';

const ImageDisplay = ({ OutoutImage = {}, darkTheme }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const passImages = OutoutImage.PassImages || [];
  const BACKEND_URL = process.env.BACKEND_URL;
  const [isFitToScreen, setIsFitToScreen] = useState(false); // State for fit-to-screen mode
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  console.log(`OutoutImage`, OutoutImage);

  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const openModal = (index) => {
    setCurrentImageIndex(index);
  };
  const props = useSpring({
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
  });
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


  useEffect(() => {
    // if (images.length > 0 && selectedImageIndex !== null) {
    //   loadImageDimensions(images[selectedImageIndex].url);
    // }

    // Event listener for arrow keys
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        showNextImage();
      } else if (event.key === 'ArrowLeft') {
        showPreviousImage();
      }
      else if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // const openImage = (index) => {
  //   setSelectedImageIndex(index);
  //   loadImageDimensions(images[index].url);
  // };

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + event.movementX * 30,
        y: prevPosition.y + event.movementY * 30,
      }));
    }
  };

  const handleDoubleClick = () => {
    setIsFitToScreen((prev) => !prev);
    if (!isFitToScreen) {
      // Fit the image to screen
      const scaleToFit = Math.min(window.innerWidth / imageDimensions.width, window.innerHeight / imageDimensions.height);
      setScale(scaleToFit);
      setPosition({ x: 0, y: 0 });
    } else {
      // Reset to original scale and position
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };
  const handleWheel = (event) => {
    setScale((prevScale) => Math.max(0.1, prevScale * (event.deltaY > 0 ? 0.9 : 1.1)));
  };



  const downloadImage = (url, filename) => {
    fetch(`${BACKEND_URL}/${url}`)
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

  const Tooltip = ({ text }) => (
    <span className="absolute bottom-full mb-2 px-2 py-1 break-normal dark:bg-neutral-800 dark:text-gray-100 bg-gray-300 text-gray-800 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
      {text}
    </span>
  );


  const downloadAllImages = () => {
    const zip = new JSZip();
    const folder = zip.folder('images'); // Create a folder in the zip
    const downloadPromises = passImages.map((image) =>
      fetch(`${BACKEND_URL}${image.image_path}`)
        .then((response) => response.blob())
        .then((blob) => {
          folder.file(image.image_name, blob); // Add each image to the zip folder
        })
    );

    Promise.all(downloadPromises)
      .then(() => {
        zip.generateAsync({ type: 'blob' }).then((zipFile) => {
          saveAs(zipFile, 'all-images.zip'); // Save the zip file
        });
      })
      .catch(() => alert('An error occurred while downloading all images'));
  };



  return (
    <section className="w-full flex md:pt-12 relative">
      <div className="relative ">
        {passImages.length > 0 && (
          <div className='' >
            <div className=" flex  flex-wrap  gap-2 md:gap-4">
              {passImages.map((image, index) => (
                <div
                  key={index}
                  className={`${image.result === "Fail" ? "border-red-800" : "border-green-800"} w-[48%] md:w-auto max-w-[330px]  border-2 `} >
                  <div
                    className="relative bg-[#1a1a1a]  border group gradient-border overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer"
                    onClick={() => openModal(index)}
                  >
                    <div className="w-full  md:min-w-40 md:min-h-40 object-cover">

                      <img
                        className="w-auto md:min-h-40 md:max-h-60  "
                        src={`${BACKEND_URL}${image.image_path}`}
                        alt={`${image.image_name}`}
                      />
                      <div className="absolute bottom-2 left-0 w-[100%] bg-black bg-opacity-70 text-white text-sm opacity-0 rounded px-2 py-1 group-hover:opacity-100 transition-opacity duration-300 break-words">
                        {image.image_name}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal */}
      {currentImageIndex !== null && (
        <div className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center`}>
          <div className={`relative md:h-[96vh] scrollbar-hidden sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-900 overflow-hidden dark:text-gray-100 bg-neutral-200 overflow-y-scroll text-gray-900  lg:flex rounded-lg p-8 md:py-0`}>
            <div
              className={`absolute top-2 w-full  flex dark:border-gray-700 border-gray-300  border-b-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-gray-500 hover:text-gray-700 focus:outline-none`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 cursor-pointer ml-auto mr-4 mt-2 dark:text-gray-100 text-gray-900 `}
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
              <button
                // onClick={handlePrevImage}
                onClick={showPreviousImage}
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 dark:text-gray-100 text-gray-900  dark:hover:text-gray-300 hover:text-gray-700 focus:outline-none`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                // onClick={handleNextImage}
                onClick={showNextImage}
                className={`absolute top-1/2 right-0 transform -translate-y-1/2 dark:text-gray-100 text-gray-900  dark:hover:text-gray-300 hover:text-gray-700 focus:outline-none`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div className="mx-6 md:w-[400px] md:h-[400px] lg:h-[86vh] lg:w-[86vh] overflow-hidden mt-10 border shadow-lg px-auto dark:bg-black bg-white rounded-lg">

                <div
                  // onWheel={handleWheel}

                  style={{ overflow: 'hidden', width: '100%', height: '100%' }}
                >
                  <div className='flex' >


                    <div className={`relative group dark:text-gray-100 text-gray-900  z-40 ml-4  cursor-pointer w-8 top-2 `}

                      // onClick={() => downloadImage(`${passImages[currentImageIndex].image_path}`, passImages[currentImageIndex].image_name)}
                    >
                      <span className='font-extrabold dark:bg-black bg-white rounded-full px-2 py-1 ' >
                      {currentImageIndex+1}/{passImages.length}
                      </span>
                    </div>
                    <div className={`relative group dark:bg-black bg-white rounded-full p-1  z-40 ml-auto  cursor-pointer right-2  top-2`}

                      onClick={() => downloadImage(`${passImages[currentImageIndex].image_path}`, passImages[currentImageIndex].image_name)}
                    >
                       {/* <span className='font-extrabold dark:bg-black bg-white rounded-full px-2 py-1 ' > */}
                      <DownloadIcon
                      className="w-6 h-6"
                      />
                      <Tooltip text="Download" />
                      {/* </span> */}
                    </div>
                  </div>

                  <animated.img
                    // onDoubleClick={handleDoubleClick}
                    onMouseMove={handleMouseMove}
                    onWheel={handleWheel}
                    className="object-center mx-auto h-auto my-auto rounded mb-4"
                    src={`${BACKEND_URL}${passImages[currentImageIndex].image_path}`}
                    alt={passImages[currentImageIndex].image_name}
                    style={props}
                  />

                </div>



              </div>

            </div>
            <div className={`relative lg:h-[86vh] md:w-[400px] md:text-sm  md:h-auto sm:mt-10 lg:mt-14 sm:w-1/4 min-w-[170px] overflow-hidden dark:bg-neutral-900 dark:text-gray-100' bg-neutral-200 text-gray-900  border shadow-lg sm:mx-0 my-4 py-2 px-6 rounded-lg`}>
              <p className={`text-indigo-500 break-words text-xs`}>
                <strong>{passImages[currentImageIndex].result}</strong> <br />
                {passImages[currentImageIndex].image_name}
              </p>
              <span className={`text-xs py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r ${darkTheme ? 'from-[#4F46E5] to-[#E114E5]' : 'from-[#4F46E5] to-[#E114E5]'} rounded-md`}>
                {/* {new Date(group.created_at).toLocaleString()} */}
              </span>
              <div className="w-full h-10 mt-10 flex py-auto items-center gap-12 my-2 py-2 text-2xl">
                <div
                  className={`relative group dark:text-gray-100 text-gray-900 `}
                  onClick={() => downloadImage(`${passImages[currentImageIndex].image_path}`, passImages[currentImageIndex].image_name)}
                >
                  <DownloadIcon />
                  <Tooltip text="Download" />
                </div>
                <button
                  onClick={downloadAllImages}
                  className={`relative group dark:text-gray-100 text-gray-900 `}
                >
                  <GrCloudDownload
                  />
                  <Tooltip text="Download All" />
                </button>
              </div>
              <p className={`my-2 text-sm dark:text-gray-100 text-gray-900 `}>
                {/* <strong>Size</strong>: {imageDimensions.width} x {imageDimensions.height} */}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageDisplay;




