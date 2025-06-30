// import React, { useState, useEffect, useRef } from 'react';
// import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
// import VariableIcon from '../Icons/VariableIcon';
// import ImageIcon from '../Icons/ImageIcon';
// import EditIcon from '../Icons/EditIcon';
// import ReuseIcon from '../Icons/ReuseIcon';
// import DownloadIcon from '../Icons/DownloadIcon';
// import { useSpring, animated } from 'react-spring';
// import { GrCloudDownload } from 'react-icons/gr';
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import EditImage from './EditImage';
// // import Image from 'next/image';

// const Modal = ({
//   closeModal,
//   children,
//   group,
//   editSubPrompt,
//   reUsePrompt,
//   useImage,
//   seed,
//   imageId,
//   setImageId,
//   selectedModel,
//   // darkTheme,
//   setIsInpenting,
//   setUploadedImage,
//   setImage,
//   setMaskImage,
//   setInputPrompt,
//   setImageGroups,
//   setNumImages,
// }) => {
//   const darkTheme = true
//   const [selectedImageIndex, setSelectedImageIndex] = useState(imageId);
//   const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
//   const BACKEND_URL = process.env.BACKEND_URL;
//   const images = React.Children.toArray(children).map((child) => child.props.image);

//   const [isFitToScreen, setIsFitToScreen] = useState(false); // State for fit-to-screen mode

//   const [editImage, setEditImage] = useState(false)

//   const [scale, setScale] = useState(0.8);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [abotationImage, setAnotationImage] = useState()
//   const props = useSpring({
//     transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
//   });

//   const handleWheel = (event) => {
//     setScale((prevScale) => Math.max(0.1, prevScale * (event.deltaY > 0 ? 0.9 : 1.1)));
//   };

//   const handleMouseMove = (event) => {
//     if (event.buttons === 1) {
//       setPosition((prevPosition) => ({
//         x: prevPosition.x + event.movementX * 30,
//         y: prevPosition.y + event.movementY * 30,
//       }));
//     }
//   };


//   useEffect(() => {
//     if (images.length > 0 && selectedImageIndex !== null) {
//       loadImageDimensions(images[selectedImageIndex].url);
//     }

//     // Event listener for arrow keys
//     const handleKeyDown = (event) => {
//       if (event.key === 'ArrowRight') {
//         handleNextImage();
//       } else if (event.key === 'ArrowLeft') {
//         handlePrevImage();
//       }
//       else if (event.key === 'Escape') {
//         closeModal();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);

//     // Cleanup event listener on unmount
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [selectedImageIndex, images]);

//   const openImage = (index) => {
//     setSelectedImageIndex(index);
//     loadImageDimensions(images[index].url);
//   };

//   const closeImage = () => {
//     setSelectedImageIndex(null);
//     setImageDimensions({ width: 0, height: 0 });
//   };

//   const loadImageDimensions = (url) => {
//     const img = new Image();
//     img.onload = () => {
//       setImageDimensions({ width: img.width, height: img.height });
//     };
//     img.src = `${BACKEND_URL}/${url}`;
//   };

//   const calculateAspectRatio = (width, height) => {
//     const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
//     const divisor = gcd(width, height);
//     return `${width / divisor}:${height / divisor}`;
//   };

//   const Tooltip = ({ text }) => (
//     <span className="absolute bottom-full mb-2 px-2 py-1 dark:bg-neutral-800 dark:text-neutral-100 bg-neutral-300 text-neutral-800 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
//       {text}
//     </span>
//   );

//   const downloadImage = (url, filename) => {
//     fetch(`${BACKEND_URL}/${url}`)
//       .then(response => response.blob())
//       .then(blob => {
//         const downloadUrl = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = downloadUrl;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(downloadUrl);
//       })
//       .catch(() => alert('An error occurred while downloading the image'));
//   };

//   const handleNextImage = () => {
//     if (selectedImageIndex < images.length - 1) {
//       openImage(selectedImageIndex + 1);
//     }
//   };

//   const handlePrevImage = () => {
//     if (selectedImageIndex > 0) {
//       openImage(selectedImageIndex - 1);
//     }
//   };

//   const handleDoubleClick = () => {
//     setIsFitToScreen((prev) => !prev);
//     if (!isFitToScreen) {
//       // Fit the image to screen
//       const scaleToFit = Math.min(window.innerWidth / imageDimensions.width, window.innerHeight / imageDimensions.height);
//       setScale(scaleToFit);
//       setPosition({ x: 0, y: 0 });
//     } else {
//       // Reset to original scale and position
//       setScale(1);
//       setPosition({ x: 0, y: 0 });
//     }
//   };

//   const transformedText = group.sub_prompt_text
//     .replace(/\s+/g, '_')   // Removes all spaces
//     .replace(/-/g, '_')    // Replaces dashes with underscores
//     .replace(/,/g, '_');
//   const downloadAllImages = async () => {
//     try {
//       const zip = new JSZip();
//       const folder = zip.folder('images');

//       if (!folder) {
//         alert('Failed to create zip folder');
//         return;
//       }

//       const downloadPromises = images.map(async (image, index) => {
//         try {
//           const response = await fetch(`${BACKEND_URL}${image.url}`);
//           if (!response.ok) throw new Error(`Failed to fetch ${image.url}`);

//           const blob = await response.blob();
//           const extension = image.image_name?.split('.').pop() || 'bmp'; // Default to PNG if no extension found
//           const fileName = image.image_name ? image.image_name : `generated_image_${index}#1.${extension}`; // Ensure filename is valid

//           folder.file(fileName, blob, { binary: true });
//         } catch (error) {
//           console.error('Error downloading image:', error);
//         }
//       });

//       await Promise.all(downloadPromises);

//       const zipFile = await zip.generateAsync({ type: 'blob' });
//       saveAs(zipFile, `${transformedText}.zip`);
//     } catch (error) {
//       alert('An error occurred while downloading all images');
//       console.error(error);
//     }
//   };


//   return (
//     <div className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center`}>
//       <div className={`relative md:h-[96vh] scrollbar-hidden sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-900 overflow-hidden dark:text-neutral-100 bg-neutral-200 overflow-y-scroll text-neutral-900  lg:flex rounded-lg p-8 md:py-0`}>
//         <div
//           className={`absolute top-2 w-full  flex dark:border-neutral-700 border-neutral-300  border-b-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-neutral-500 hover:text-neutral-700 focus:outline-none`}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className={`h-6 w-6 cursor-pointer ml-auto mr-4 mt-2 dark:text-neutral-100 text-neutral-900 `}
//             fill="none"
//             viewBox="0 0 24 24"
//             onClick={closeModal}
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </div>

//         <div className="relative h-auto  sm:my-auto mx-auto p-0 bg-transparent lg:max-h-[92vh] sm:flex xs:flex-wrap">
//           <button
//             onClick={handlePrevImage}
//             className={`absolute top-1/2 left-0 transform -translate-y-1/2 dark:text-neutral-100 text-neutral-900  dark:hover:text-neutral-300 hover:text-neutral-700 focus:outline-none`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//           <button
//             onClick={handleNextImage}
//             className={`absolute top-1/2 right-0 transform -translate-y-1/2 dark:text-neutral-100 text-neutral-900  dark:hover:text-neutral-300 hover:text-neutral-700 focus:outline-none`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>
//           <div className="mx-6 md:w-[400px] md:h-[400px] lg:h-[86vh] lg:w-[86vh] overflow-hidden mt-10 border shadow-lg px-auto dark:bg-black bg-white rounded-lg">
//             {/* <TransformWrapper
//             >
//               <TransformComponent
//                 wrapperStyle={{
//                   height: '100%', // Keep the height fixed at 80vh
//                   // display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   padding: 'auto',
//                   width: '100%'
//                 }}
//               >
//                 <img
//                   className="rounded mb-4"
//                   src={`${BACKEND_URL}/${images[selectedImageIndex].url}`}
//                   alt="Selected"
//                   style={{ maxWidth: '100%', maxHeight: '100%' }} // Keep the image at its original size, within the bounds of the wrapper
//                 />
//               </TransformComponent>
//             </TransformWrapper> */}



//             <div
//               onWheel={handleWheel}

//               style={{ overflow: 'hidden', width: '100%', height: '100%' }}
//             >
//               <div className='flex' >

//                 <div className={`relative group font-extrabold dark:bg-black bg-white rounded-full  z-40 px-2 py-1 left-2 cursor-pointer  top-2`}>
//                   {/* <EditIcon /> */}
//                   {selectedImageIndex + 1}/{images.length}
//                   {/* <Tooltip text="Edit" /> */}
//                 </div>

//                 <div className={`relative group dark:bg-black bg-white rounded-full p-1  z-40 ml-auto  cursor-pointer right-2  top-2`}
//                   // onClick={() => downloadImage(images[selectedImageIndex].url, images[selectedImageIndex].url.split('/').pop())}
//                   onClick={async () => {
//                     if (images && images.length > 0 && selectedImageIndex >= 0 && selectedImageIndex < images.length) {
//                       const imageUrl = `${BACKEND_URL}/${images[selectedImageIndex].url}`;

//                       try {
//                         // Fetch the image and convert it to a File object
//                         const response = await fetch(imageUrl);
//                         const blob = await response.blob();
//                         const file = new File([blob], images[selectedImageIndex].url, { type: blob.type });

//                         setIsInpenting(true);
//                         setUploadedImage(imageUrl);
//                         setImage(file); // Set image as a File object
//                         setMaskImage(null);
//                         closeModal();
//                         setInputPrompt("");
//                         setImageGroups([]);
//                         setNumImages(1);
//                       } catch (error) {
//                         console.error("Error fetching image:", error);
//                       }
//                     } else {
//                       console.error("Invalid selectedImageIndex or images array is empty.");
//                     }
//                   }}


//                 >
//                   <EditIcon />
//                   <Tooltip text="Anotation" />
//                 </div>
//               </div>

//               <animated.img
//                 onDoubleClick={handleDoubleClick}
//                 onMouseMove={handleMouseMove}
//                 className="object-center mx-auto h-auto my-auto rounded mb-4"
//                 src={`${BACKEND_URL}/${images[selectedImageIndex].url}`}
//                 alt="Selected"
//                 style={props}
//               />

//             </div>



//           </div>

//         </div>
//         <div className={`relative lg:h-[86vh] md:w-[400px] md:text-sm  md:h-auto sm:mt-10 lg:mt-14 sm:w-1/4 min-w-[170px] overflow-hidden dark:bg-neutral-900 dark:text-neutral-100' bg-neutral-200 text-neutral-900  border shadow-lg sm:mx-0 my-4 py-2 px-6 rounded-lg`}>
//           <p className={`text-indigo-500`}>
//             <strong>Prompt</strong> <br />
//             {group.sub_prompt_text}
//           </p>
//           <span className={`text-xs py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r ${darkTheme ? 'from-[#4F46E5] to-[#E114E5]' : 'from-[#4F46E5] to-[#E114E5]'} rounded-md`}>
//             {new Date(group.created_at).toLocaleString()}
//           </span>
//           <div className="w-full h-10 flex py-auto items-center gap-6 my-2 py-2 text-2xl">
//             <div className={`relative group dark:text-neutral-100 text-neutral-900 `} onClick={() => downloadImage(images[selectedImageIndex].url, images[selectedImageIndex].url.split('/').pop())}>
//               <DownloadIcon />
//               <Tooltip text="Download" />
//             </div>
//             {/* <div onClick={() => useImage(images[selectedImageIndex].url)} className="relative group text-blue-800 cursor-pointer">
//               <ImageIcon />
//               <Tooltip text="Image" />
//             </div> */}
//             <div onClick={() => editSubPrompt(group.sub_prompt_text)} className={`relative group dark:text-neutral-100 text-neutral-900 `}>
//               <EditIcon />
//               <Tooltip text="Edit" />
//             </div>
//             <div
//               onClick={() => {
//                 editSubPrompt(group.sub_prompt_text);
//                 reUsePrompt(group.sub_prompt_text);
//               }}
//               className={`relative group dark:text-neutral-100 text-neutral-900 `}
//             >
//               <ReuseIcon />
//               <Tooltip text="Regenerate" />
//             </div>
//             <button
//               onClick={downloadAllImages}
//               className={`relative group dark:text-neutral-100 text-neutral-900 `}
//             >
//               <GrCloudDownload
//               />
//               <Tooltip text="Download All" />
//             </button>
//           </div>
//           <span className={`text-xs px-12 py-0 text-white font-light bg-gradient-to-r ${darkTheme ? 'from-[#4F46E5] to-[#E114E5]' : 'from-[#4F46E5] to-[#E114E5]'} rounded-md`}>
//             {selectedModel}
//           </span>
//           {/* <p className="mt-4 text-sm text-blue-800">
//             <strong>Ratio</strong>: {calculateAspectRatio(imageDimensions.width, imageDimensions.height)}
//           </p> */}
//           <p className={`my-2 text-sm dark:text-neutral-100 text-neutral-900 `}>
//             <strong>Size</strong>: {imageDimensions.width} x {imageDimensions.height}
//           </p>
//         </div>
//       </div>
//       {editImage ? <EditImage
//         setEditImage={setEditImage}
//         abotationImage={abotationImage}
//       /> : null

//       }

//     </div>
//   );
// };

// export default Modal;







import React, { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useSpring, animated } from "react-spring";
import { GrCloudDownload } from "react-icons/gr";
// import { FiCompare } from 'react-icons/fi';
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Make sure these icon components are properly imported from their files
// If these are local components, ensure they have proper exports
import VariableIcon from "../Icons/VariableIcon";
import ImageIcon from "../Icons/ImageIcon";
import EditIcon from "../Icons/EditIcon";
import ReuseIcon from "../Icons/ReuseIcon";
import DownloadIcon from "../Icons/DownloadIcon";
import EditImage from "./EditImage";
import { MdOutlineCompare } from "react-icons/md";

const Modal = ({
  closeModal,
  children,
  group,
  editSubPrompt,
  reUsePrompt,
  useImage,
  seed,
  imageId,
  setImageId,
  selectedModel,
  setIsInpenting,
  setUploadedImage,
  setImage,
  setMaskImage,
  setInputPrompt,
  setImageGroups,
  setNumImages,
  isInpenting,
}) => {
  const darkTheme = true;
  const [selectedImageIndex, setSelectedImageIndex] = useState(imageId);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const BACKEND_URL = process.env.BACKEND_URL;
  const images = React.Children.toArray(children).map(
    (child) => child.props.image
  );

  // Comparison slider state
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [comparisonMode, setComparisonMode] = useState(false);

  // Zoom/pan state
  const [isFitToScreen, setIsFitToScreen] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [abotationImage, setAnotationImage] = useState();

  const props = useSpring({
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
  });

  // Slider handlers
  const handleSliderMouseDown = (e) => {
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    e.preventDefault();
  };

  const handleSliderMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const percentage = Math.min(
      Math.max((relativeX / containerRect.width) * 100, 5),
      95
    );
    setSliderPosition(percentage);
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "";
  };

  // Image zoom/pan handlers
  const handleWheel = (event) => {
    setScale((prevScale) =>
      Math.max(0.1, prevScale * (event.deltaY > 0 ? 0.9 : 1.1))
    );
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + event.movementX * 30,
        y: prevPosition.y + event.movementY * 30,
      }));
    }
  };

  useEffect(() => {
    if (images.length > 0 && selectedImageIndex !== null) {
      loadImageDimensions(images[selectedImageIndex].url);
    }

    // Event listeners for slider
    if (isDragging) {
      window.addEventListener("mousemove", handleSliderMouseMove);
      window.addEventListener("mouseup", handleSliderMouseUp);
    } else {
      window.removeEventListener("mousemove", handleSliderMouseMove);
      window.removeEventListener("mouseup", handleSliderMouseUp);
    }

    // Event listener for arrow keys
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleNextImage();
      } else if (event.key === "ArrowLeft") {
        handlePrevImage();
      } else if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleSliderMouseMove);
      window.removeEventListener("mouseup", handleSliderMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDragging, selectedImageIndex, images]);

  const openImage = (index) => {
    setSelectedImageIndex(index);
    loadImageDimensions(images[index].url);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
    setImageDimensions({ width: 0, height: 0 });
  };

  const loadImageDimensions = (url) => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = `${BACKEND_URL}/${url}`;
  };

  const calculateAspectRatio = (width, height) => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const Tooltip = ({ text }) => (
    <span className="absolute bottom-full mb-2 px-2 py-1 dark:bg-neutral-800 dark:text-neutral-100 bg-neutral-300 text-neutral-800 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
      {text}
    </span>
  );

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

  const handleNextImage = () => {
    if (selectedImageIndex < images.length - 1) {
      openImage(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      openImage(selectedImageIndex - 1);
    }
  };

  const handleDoubleClick = () => {
    setIsFitToScreen((prev) => !prev);
    if (!isFitToScreen) {
      const scaleToFit = Math.min(
        window.innerWidth / imageDimensions.width,
        window.innerHeight / imageDimensions.height
      );
      setScale(scaleToFit);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const transformedText = group.sub_prompt_text
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .replace(/,/g, "_");

  const downloadAllImages = async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder("images");

      if (!folder) {
        alert("Failed to create zip folder");
        return;
      }

      const downloadPromises = images.map(async (image, index) => {
        try {
          const response = await fetch(`${BACKEND_URL}${image.url}`);
          if (!response.ok) throw new Error(`Failed to fetch ${image.url}`);

          const blob = await response.blob();
          const extension = image.image_name?.split(".").pop() || "bmp";
          const fileName = image.image_name
            ? image.image_name
            : `generated_image_${index}#1.${extension}`;

          folder.file(fileName, blob, { binary: true });
        } catch (error) {
          console.error("Error downloading image:", error);
        }
      });

      await Promise.all(downloadPromises);
      const zipFile = await zip.generateAsync({ type: "blob" });
      saveAs(zipFile, `${transformedText}.zip`);
    } catch (error) {
      alert("An error occurred while downloading all images");
      console.error(error);
    }
  };

const renderComparisonView = () => {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        onMouseLeave={() => isDragging && handleSliderMouseUp()}
      >
        {/* Before image with subtle texture */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-contain"
              src={`${BACKEND_URL}/${images[0].url}`}
              alt="Original"
            />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBvcGFjaXR5PSIwLjAzIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMDAiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDYwIDYwTTYwIDBMMCA2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD48L3N2Zz4=')] opacity-5 dark:opacity-10"></div>
          </div>
        </div>

        {/* After image with elegant reveal */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <div className="relative w-full h-full">
            <img
              className="w-full h-full object-contain"
              src={`${BACKEND_URL}/${images[1].url}`}
              alt="Modified"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent mix-blend-overlay"></div>
          </div>
        </div>

        {/* Sophisticated slider handle */}
        <div
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-10 cursor-col-resize flex items-center justify-center z-20 group"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleSliderMouseDown}
        >
          <div className="absolute h-32 w-1 bg-neutral-300 dark:bg-neutral-600 rounded-full shadow-inner">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white to-transparent opacity-30"></div>
          </div>
          <div className="absolute h-10 w-10 rounded-full border-2 border-white dark:border-neutral-300 shadow-md bg-neutral-50 dark:bg-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="h-2 w-2 rounded-full bg-neutral-500 dark:bg-neutral-400"></div>
          </div>
        </div>

        {/* Minimal position indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 z-10">
          <span className="font-medium">{Math.round(sliderPosition)}%</span>
          <span className="mx-1 text-neutral-400">|</span>
          <span className="font-medium">{Math.round(100 - sliderPosition)}%</span>
        </div>

        {/* Classic ratio presets */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 bg-white dark:bg-neutral-800 px-2 py-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700">
          {[25, 50, 75].map((pos) => (
            <button
              key={pos}
              onClick={() => setSliderPosition(pos)}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                Math.round(sliderPosition) === pos
                  ? 'bg-neutral-900 text-white dark:bg-neutral-600 dark:text-neutral-100'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Understated labels */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white/80 dark:bg-neutral-800/80 px-2 py-1 rounded">
            Composed Image
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white/80 dark:bg-neutral-800/80 px-2 py-1 rounded">
            Overlaped Image
          </span>
        </div>

        {/* Refined toggle button */}
                <div className="absolute bottom-0 right-0 bg-white dark:bg-neutral-800 p-0 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-10">
         
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
            aria-label="Toggle comparison mode"
          >
<MdOutlineCompare />
          </button>
        </div>
</div>
        {/* Subtle watermark */}
        <div className="absolute bottom-4 left-6 text-xs text-neutral-400 dark:text-neutral-600 font-sans">
          ◈ Slide to compare ◈
        </div>
      </div>
    );
  };
const renderSingleImageView = () => {
    return (
      <div 
        onWheel={handleWheel}
        className="relative w-full h-full overflow-hidden rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black"
      >
        {/* Image with subtle texture overlay */}
        <animated.img
          onDoubleClick={handleDoubleClick}
          onMouseMove={handleMouseMove}
          className="absolute w-full h-full object-contain"
          src={`${BACKEND_URL}/${images[selectedImageIndex].url}`}
          alt="Selected"
          style={props}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiBvcGFjaXR5PSIwLjAzIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMwMDAiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDYwIDYwTTYwIDBMMCA2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD48L3N2Zz4=')] opacity-5 dark:opacity-10 pointer-events-none"></div>

        {/* Position indicator with elegant frame */}
        <div className="absolute top-4 left-4 bg-white dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 px-3 py-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 z-10">
          <span className="font-medium">{selectedImageIndex + 1}</span>
          <span className="mx-1 text-neutral-400">/</span>
          <span className="font-medium">{images.length}</span>
        </div>

        {/* Toolbar with consistent styling */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10">

          
          <button
            onClick={() => downloadImage(images[selectedImageIndex].url, images[selectedImageIndex].url.split('/').pop())}
            className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
            aria-label="Download"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </button>

          <button
            onClick={() => editSubPrompt(group.sub_prompt_text)}
            className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
            aria-label="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
        </div>

        {/* Navigation arrows (when not in inpainting mode) */}
        {!isInpenting && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all z-10"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white dark:bg-neutral-800 p-2 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all z-10"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </>
        )}
        <div className="absolute bottom-4 right-4 bg-white dark:bg-neutral-800 p-0 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-10">
         
                   {isInpenting && images.length === 2 && (
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 transition-all ${
                comparisonMode 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
              aria-label="Compare images"
            >
<MdOutlineCompare />
            </button>
          )}
          </div>

        {/* Zoom controls */}
        <div className="absolute bottom-14 right-4 bg-white dark:bg-neutral-800 p-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-10">
         

         
          <button
            onClick={() => setScale(prev => Math.min(prev * 1.2, 3))}
            className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
            aria-label="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
          <button
            onClick={() => setScale(prev => Math.max(prev * 0.8, 0.5))}
            className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
            aria-label="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
            </svg>
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
            className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-all"
            aria-label="Reset zoom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
            </svg>
          </button>
        </div>
      </div>
    );
};

  const renderCompareButton = () => {
    if (!isInpenting || images.length !== 2) return null;

    return (
      <button
        onClick={() => setComparisonMode(!comparisonMode)}
        className={`p-2 rounded-full transition-all duration-300 ${comparisonMode 
          ? 'bg-blue-500 text-white shadow-lg transform rotate-180' 
          : 'bg-neutral-900 bg-opacity-70 text-neutral-100 hover:bg-opacity-90'}`}
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
            strokeWidth="2" 
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      </button>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center`}
    >
      <div
        className={`relative md:h-[96vh] scrollbar-hidden sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-900 overflow-hidden dark:text-neutral-100 bg-neutral-200 overflow-y-scroll text-neutral-900 lg:flex rounded-lg p-8 md:py-0`}
      >
        <div
          className={`absolute top-2 w-full flex dark:border-neutral-700 border-neutral-300 border-b-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-neutral-500 hover:text-neutral-700 focus:outline-none`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 cursor-pointer ml-auto mr-4 mt-2 dark:text-neutral-100 text-neutral-900`}
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

        <div className="relative h-auto sm:my-auto mx-auto p-0 bg-transparent lg:max-h-[92vh] sm:flex xs:flex-wrap">
          {!isInpenting && (
            <>
              {/* <button
                onClick={handlePrevImage}
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 dark:text-neutral-100 text-neutral-900 dark:hover:text-neutral-300 hover:text-neutral-700 focus:outline-none`}
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
                onClick={handleNextImage}
                className={`absolute top-1/2 right-0 transform -translate-y-1/2 dark:text-neutral-100 text-neutral-900 dark:hover:text-neutral-300 hover:text-neutral-700 focus:outline-none`}
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
              </button> */}
            </>
          )}

          <div className="mx-6 md:w-[400px] md:h-[400px] lg:h-[86vh] lg:w-[86vh] overflow-hidden mt-10 border shadow-lg px-auto dark:bg-black bg-white rounded-lg">
            {comparisonMode && isInpenting && images.length === 2
              ? renderComparisonView()
              : renderSingleImageView()}
          </div>
        </div>

        <div
          className={`relative lg:h-[86vh] md:w-[400px] md:text-sm md:h-auto sm:mt-10 lg:mt-14 sm:w-1/4 min-w-[170px] overflow-hidden dark:bg-neutral-900 dark:text-neutral-100 bg-neutral-200 text-neutral-900 border shadow-lg sm:mx-0 my-4 py-2 px-6 rounded-lg`}
        >
          <p className={`text-indigo-500`}>
            <strong>Prompt</strong> <br />
            {group.sub_prompt_text}
          </p>
          <span
            className={`text-xs py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r ${
              darkTheme
                ? "from-[#4F46E5] to-[#E114E5]"
                : "from-[#4F46E5] to-[#E114E5]"
            } rounded-md`}
          >
            {new Date(group.created_at).toLocaleString()}
          </span>
          <div className="w-full h-10 flex py-auto items-center gap-6 my-2 py-2 text-2xl">
            <div
              className={`relative group dark:text-neutral-100 text-neutral-900`}
              onClick={() =>
                downloadImage(
                  images[selectedImageIndex].url,
                  images[selectedImageIndex].url.split("/").pop()
                )
              }
            >
              <DownloadIcon />
              <Tooltip text="Download" />
            </div>
            <div
              onClick={() => editSubPrompt(group.sub_prompt_text)}
              className={`relative group dark:text-neutral-100 text-neutral-900`}
            >
              <EditIcon />
              <Tooltip text="Edit" />
            </div>
            <div
              onClick={() => {
                editSubPrompt(group.sub_prompt_text);
                reUsePrompt(group.sub_prompt_text);
              }}
              className={`relative group dark:text-neutral-100 text-neutral-900`}
            >
              <ReuseIcon />
              <Tooltip text="Regenerate" />
            </div>
            <button
              onClick={downloadAllImages}
              className={`relative group dark:text-neutral-100 text-neutral-900`}
            >
              <GrCloudDownload />
              <Tooltip text="Download All" />
            </button>
          </div>
          <span
            className={`text-xs px-12 py-0 text-white font-light bg-gradient-to-r ${
              darkTheme
                ? "from-[#4F46E5] to-[#E114E5]"
                : "from-[#4F46E5] to-[#E114E5]"
            } rounded-md`}
          >
            {selectedModel}
          </span>
          <p className={`my-2 text-sm dark:text-neutral-100 text-neutral-900`}>
            <strong>Size</strong>: {imageDimensions.width} x{" "}
            {imageDimensions.height}
          </p>
        </div>
      </div>
      {editImage && <EditImage setEditImage={setEditImage} abotationImage={abotationImage} />}

    </div>
  );
};

export default Modal;
