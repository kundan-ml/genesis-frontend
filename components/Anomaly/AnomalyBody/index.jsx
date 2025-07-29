import { DownloadIcon, EditIcon, ReuseIcon } from "@/components/Icons";
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GrCloudDownload } from "react-icons/gr";

const ImageDisplay = ({ OutoutImage = {}, darkTheme }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const passImages = OutoutImage.PassImages || [];
  const BACKEND_URL = process.env.BACKEND_URL;
  const [isFitToScreen, setIsFitToScreen] = useState(false); // State for fit-to-screen mode
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

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
    // Event listener for arrow keys
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        showNextImage();
      } else if (event.key === "ArrowLeft") {
        showPreviousImage();
      } else if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + event.movementX * 30,
        y: prevPosition.y + event.movementY * 30,
      }));
    }
  };

  const handleDoubleClick = () => {
    // Reset to original position and scale
    setScale(0.8);
    setPosition({ x: 0, y: 0 });
    setIsFitToScreen(false);
  };

  const handleWheel = (event) => {
    setScale((prevScale) =>
      Math.max(0.1, prevScale * (event.deltaY > 0 ? 0.9 : 1.1))
    );
  };

  // Zoom control functions connected to buttons
  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev * 0.8, 0.1));
  };

  const resetZoom = () => {
    setScale(0.8);
    setPosition({ x: 0, y: 0 });
  };

  const downloadImage = (url, filename) => {
    fetch(`${BACKEND_URL}/${url}`)
      .then((response) => response.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(() => alert("An error occurred while downloading the image"));
  };

  const Tooltip = ({ text }) => (
    <span className="absolute bottom-full mb-2 px-2 py-1 break-normal dark:bg-neutral-800 dark:text-gray-100 bg-gray-300 text-gray-800 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
      {text}
    </span>
  );

  const downloadAllImages = () => {
    const zip = new JSZip();
    const folder = zip.folder("images"); // Create a folder in the zip
    const downloadPromises = passImages.map((image) =>
      fetch(`${BACKEND_URL}${image.image_path}`)
        .then((response) => response.blob())
        .then((blob) => {
          folder.file(image.image_name, blob); // Add each image to the zip folder
        })
    );

    Promise.all(downloadPromises)
      .then(() => {
        zip.generateAsync({ type: "blob" }).then((zipFile) => {
          saveAs(zipFile, "all-images.zip"); // Save the zip file
        });
      })
      .catch(() => alert("An error occurred while downloading all images"));
  };

  return (
    <section className="w-full flex md:pt-12 relative">
      <div className="relative ">
        {passImages.length > 0 && (
          <div className="">
            <div className=" flex  flex-wrap  gap-2 md:gap-4">
              {passImages.map((image, index) => (
                <div
                  key={index}
                  className={`${
                    image.result === "Fail"
                      ? "border-red-800"
                      : "border-green-800"
                  } w-[48%] md:w-auto max-w-[330px]  border-2 `}
                >
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
        <div
          className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center`}
        >
          <div
            className={`relative md:h-[96vh] scrollbar-hidden sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-900 overflow-hidden dark:text-gray-100 bg-neutral-200 overflow-y-scroll text-gray-900  lg:flex rounded-lg p-8 md:py-0`}
          >
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
                onClick={showPreviousImage}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all z-10"
                aria-label="Previous image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              <button
                onClick={showNextImage}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all z-10"
                aria-label="Next image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>

              <div className="mx-6 md:w-[400px] md:h-[400px] lg:h-[86vh] lg:w-[86vh] overflow-hidden mt-10  shadow-lg px-auto dark:bg-black bg-white rounded-lg relative">
                <div
                  onWheel={handleWheel}
                  onDoubleClick={handleDoubleClick}
                  style={{ overflow: "hidden", width: "100%", height: "100%" }}
                >
                  {/* Fixed position elements that don't move with zoom */}
                  <div className="absolute top-0 left-0 w-full flex justify-between items-center p-2 z-20 pointer-events-none">
                    <div className="dark:text-gray-100 text-gray-900 pointer-events-auto">
                      <span className="font-extrabold dark:bg-black bg-white rounded-full px-2 py-1">
                        {currentImageIndex + 1}/{passImages.length}
                      </span>
                    </div>
                    <div
                      className="relative group dark:bg-black bg-white rounded-full p-1 cursor-pointer pointer-events-auto"
                      onClick={() =>
                        downloadImage(
                          `${passImages[currentImageIndex].image_path}`,
                          passImages[currentImageIndex].image_name
                        )
                      }
                    >
                      <DownloadIcon className="w-6 h-6" />
                      <Tooltip text="Download" />
                    </div>
                  </div>

                  <animated.img
                    onMouseMove={handleMouseMove}
                    className="object-center mx-auto h-auto my-auto rounded mb-4"
                    src={`${BACKEND_URL}${passImages[currentImageIndex].image_path}`}
                    alt={passImages[currentImageIndex].image_name}
                    style={props}
                  />
                </div>

                {/* Zoom controls positioned inside image div at bottom corner */}
                <div className="absolute bottom-4 right-4 bg-white dark:bg-neutral-800 p-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-20">
                  <button
                    onClick={zoomIn}
                    className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
                    aria-label="Zoom in"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={zoomOut}
                    className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
                    aria-label="Zoom out"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={resetZoom}
                    className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
                    aria-label="Reset zoom"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`relative lg:h-[86vh] md:w-[400px] md:text-sm  md:h-auto sm:mt-10 lg:mt-14 sm:w-1/4 min-w-[170px] overflow-hidden dark:bg-neutral-900 dark:text-gray-100' bg-neutral-200 text-gray-900  border-gray-700 shadow-lg sm:mx-0 my-4 py-2 px-6 rounded-lg`}
            >
              <p className={`text-indigo-500 break-words text-xs`}>
                <strong>{passImages[currentImageIndex].result}</strong> <br />
                {passImages[currentImageIndex].image_name}
              </p>
              <span
                className={`text-xs py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                  darkTheme
                    ? "from-[#4F46E5] to-[#E114E5]"
                    : "from-[#4F46E5] to-[#E114E5]"
                } rounded-md`}
              >
                {/* {new Date(group.created_at).toLocaleString()} */}
              </span>
              <div className="w-full h-10 mt-10 flex py-auto items-center gap-12 my-2 py-2 text-2xl">
                <div
                  className={`relative group dark:text-gray-100 text-gray-900 `}
                  onClick={() =>
                    downloadImage(
                      `${passImages[currentImageIndex].image_path}`,
                      passImages[currentImageIndex].image_name
                    )
                  }
                >
                  <DownloadIcon />
                  <Tooltip text="Download" />
                </div>
                <button
                  onClick={downloadAllImages}
                  className={`relative group dark:text-gray-100 text-gray-900 `}
                >
                  <GrCloudDownload />
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
