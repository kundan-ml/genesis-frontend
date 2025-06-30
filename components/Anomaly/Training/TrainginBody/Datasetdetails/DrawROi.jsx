// import React, { useRef, useState, useEffect } from "react";
// import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
// import { FaCheckCircle, FaTimes } from "react-icons/fa";
// import { motion } from "framer-motion";

// const DrawRoi = ({
//     username,
//     setDrawRoi,
//     selectedProject,
//     selectedDatastes,
//     datasetDetails,
//     images,
//     fetchDetails,
//     setDatasetsName
// }) => {
//     const [trainFiles, setTrainFiles] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [roi, setRoi] = useState({ x: 0, y: 0, width: 0, height: 0 });
//     const [startPoint, setStartPoint] = useState(null);
//     const containerRef = useRef(null);
//     const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
//     const BACKEND_URL = process.env.BACKEND_URL
//     const imageUrl = `${BACKEND_URL}/${images.images[currentIndex || 0]}`;
//     let openimg = images.images[currentIndex]
//     const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
//     const [showDatasetModal, setShowDatasetModal] = useState(false);
//     const [datasetName, setDatasetName] = useState("");
//     const [successMessage, setSuccessMessage] = useState("");
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         const container = containerRef.current;

//         const img = new Image();
//         img.src = imageUrl;
//         img.onload = () => {
//             setOriginalSize({ width: img.width, height: img.height });

//             // Fit the image inside container while maintaining aspect ratio
//             const maxWidth = container.clientWidth;
//             const maxHeight = container.clientHeight;
//             let width = img.width;
//             let height = img.height;

//             if (width > maxWidth || height > maxHeight) {
//                 const aspectRatio = width / height;
//                 if (width > height) {
//                     width = maxWidth;
//                     height = width / aspectRatio;
//                 } else {
//                     height = maxHeight;
//                     width = height * aspectRatio;
//                 }
//             }

//             canvas.width = width;
//             canvas.height = height;
//             setImageSize({ width, height });

//             ctx.drawImage(img, 0, 0, width, height);
//         };
//     }, [imageUrl]);

//     const getMousePos = (e) => {
//         const rect = canvasRef.current.getBoundingClientRect();
//         return {
//             x: e.clientX - rect.left,
//             y: e.clientY - rect.top,
//         };
//     };

//     const handleMouseDown = (e) => {
//         setStartPoint(getMousePos(e));
//         setIsDrawing(true);
//     };

//     const handleMouseMove = (e) => {
//         if (!isDrawing) return;

//         const ctx = canvasRef.current.getContext("2d");
//         const img = new Image();
//         img.src = imageUrl;
//         img.onload = () => {
//             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//             ctx.drawImage(img, 0, 0, imageSize.width, imageSize.height);

//             const endPoint = getMousePos(e);
//             ctx.strokeStyle = "red";
//             ctx.lineWidth = 2;
//             ctx.strokeRect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
//         };
//     };

//     const handleMouseUp = (e) => {
//         if (!isDrawing) return;

//         const endPoint = getMousePos(e);
//         setIsDrawing(false);

//         const newRoi = {
//             x: startPoint.x,
//             y: startPoint.y,
//             width: endPoint.x - startPoint.x,
//             height: endPoint.y - startPoint.y,
//         };

//         setRoi(newRoi);
//         setShowDatasetModal(true); // Show modal after drawing ROI
//     };

//     const handleConfirm = () => {
//         if (roi) {
//             onRoiSelect(roi);
//         }
//     };

//     const handleNext = () => {
//         setCurrentIndex(currentIndex + 1);
//     };

//     const handlePrev = () => {
//         setCurrentIndex(currentIndex - 1);
//     };

//     // Handle file upload with chunks
//     const handleSubmit = async () => {
//         if (roi.width <= 0 || roi.height <= 0) {
//             alert("Please draw a valid ROI before submitting.");
//             return;
//         }

//         // Scale ROI coordinates back to the original image size
//         const scaleX = originalSize.width / imageSize.width;
//         const scaleY = originalSize.height / imageSize.height;

//         const scaledRoi = {
//             x: Math.round(roi.x * scaleX),
//             y: Math.round(roi.y * scaleY),
//             width: Math.round(roi.width * scaleX),
//             height: Math.round(roi.height * scaleY),
//         };

//         try {
//             console.log("Submitting Scaled ROI:", scaledRoi);
//             setIsSubmitting(true);
//             const response = await fetch(`${BACKEND_URL}/train/fetch-draw-roi/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     selectedProject,
//                     username,
//                     selectedDatastes,
//                     openimg,
//                     roi: scaledRoi,  // Send the scaled ROI
//                     datasetName
//                 }),
//             });

//             if (!response.ok) throw new Error("Error in submission");
//             setSuccessMessage("ROI submitted successfully!");
//             fetchDetails()
//             setShowDatasetModal(false);
//             setDrawRoi(false)
//             setDatasetsName(datasetName)
//         } catch (error) {
//             console.error("Submission failed:", error);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <section className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center `} >
//             <div className={`relative md:h-[96vh] sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-800 bg-gray-100 sm:flex xs:flex-wrap rounded-lg p-8 md:py-0`}>
//                 <div
//                     className={`absolute top-2 w-full flex  border-neutral-300 border-t-0 border-x-0 border-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-neutral-500 dark:hover:text-neutral-300 hover:text-neutral-700 focus:outline-none`}
//                 >
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6 cursor-pointer ml-auto mr-4 mt-2 hover:rotate-90 transition-transform"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         onClick={() => setDrawRoi(false)}
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M6 18L18 6M6 6l12 12"
//                         />
//                     </svg>
//                 </div>
//                 <div className="flex w-full mt-10  items-center">
//                     <div className="min-h-[94vh] w-full bg-gradient-to-black darK:from-neutral-900 dark:via-neutral-800 dark:to-black from-neutral-200 via-neutral-100 to-white flex items-center justify-center p-8 relative overflow-hidden">
//                         <div className="absolute inset-0 pointer-events-none opacity-40 animate-pulse">
//                             <div className="particle-container">
//                                 <span className="particle"></span>
//                                 <span className="particle"></span>
//                                 <span className="particle"></span>
//                                 <span className="particle"></span>
//                                 <span className="particle"></span>
//                             </div>
//                         </div>
//                         <div className="absolute left-0 z-50 " ><FaCaretLeft size={40} onClick={handlePrev} className=" cursor-pointer " /></div>
//                         <div className="absolute right-0 z-50   " ><FaCaretRight size={40} onClick={handleNext} className=" cursor-pointer " /></div>
//                         <div className="relative w-full min-h-[86vh] max-w-4xl p-6  dark:bg-neutral-900 bg bg-gray-200 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl border border-opacity-20 border-gray-700 hover:shadow-neon-blue transition-all duration-300 ease-out">

//                             <div
//                             ref={containerRef}
//                             className=' bg-black h-[70vh] w-full border border-gray-500 rounded-md ' >
//                                 <canvas
//                                     ref={canvasRef}
//                                     className="max-w-full w-auto h-auto max-h-full mx-auto "
//                                     onMouseDown={handleMouseDown}
//                                     onMouseMove={handleMouseMove}
//                                     onMouseUp={handleMouseUp}
//                                 ></canvas>
//                             </div>
//                         </div>

//                         {showDatasetModal && (
//                     <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
//                         className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                         <div className="bg-neutral-900 p-6 rounded-lg shadow-lg w-96">
//                             <h2 className="text-lg font-bold text-white">Enter New Dataset Name</h2>
//                             <input type="text" className="mt-2 bg-neutral-700 p-2 border rounded w-full text-white"
//                                 value={datasetName} onChange={(e) => setDatasetName(e.target.value)} />
//                             <div className="flex justify-end gap-2 mt-4">
//                                 <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setShowDatasetModal(false)}>Cancel</button>
//                                 <button className="px-4 py-2 bg-blue-600 text-white rounded relative" onClick={handleSubmit}>
//                                     {isSubmitting ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full inline-block"></span> : "Submit"}
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}

//                 {successMessage && (
//                     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
//                         className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg flex items-center">
//                         <FaCheckCircle className="mr-2" /> {successMessage}
//                     </motion.div>
//                 )}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default DrawRoi;

import React, { useRef, useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
const DrawRoi = ({
  username,
  setDrawRoi,
  selectedProject,
  selectedDatastes,
  datasetDetails,
  images,
  fetchDetails,
  setDatasetsName,
}) => {
  const ctxRef = useRef(null);
  const imageRef = useRef(new Image());

  // const [isDrawing, setIsDrawing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(null);
  // const [roi, setRoi] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);

  const [trainFiles, setTrainFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [roi, setRoi] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState(null);
  const containerRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const BACKEND_URL = process.env.BACKEND_URL;
  const imageUrl = `${BACKEND_URL}/${images.images[currentIndex || 0]}`;
  let openimg = images.images[currentIndex];
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  console.log("The Roi Region are ", roi);

  const [scaleFactors, setScaleFactors] = useState({ x: 1, y: 1 });

  const handleImageLoad = (event) => {
    const img = event.target;
    setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight });

    setScaleFactors({
      x: img.naturalWidth / img.width,
      y: img.naturalHeight / img.height,
    });
  };

  useEffect(() => {
    drawImage();
  }, [roi]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = containerRef.current;

    const img = imageRef.current;
    img.src = imageUrl;
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });

      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      // Calculate scale factors
      setScaleFactors({
        x: img.width / width,
        y: img.height / height,
      });

      canvas.width = width;
      canvas.height = height;
      setImageSize({ width, height });

      ctx.drawImage(img, 0, 0, width, height);
    };
  }, [imageUrl]);

//   const drawImage = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctxRef.current = ctx;

//     canvas.width = imageRef.current.width;
//     canvas.height = imageRef.current.height;

//     ctx.drawImage(imageRef.current, 0, 0);
//     if (roi) {
//       applyBlur(ctx, canvas);
//       ctx.strokeStyle = "red";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(roi.x, roi.y, roi.width, roi.height);
//     }
//   };

const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
  
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
  
    ctx.drawImage(imageRef.current, 0, 0);
  
    if (roi) {
      applyBlur(ctx, canvas);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(roi.x, roi.y, roi.width, roi.height);
  
      // Set text properties
      ctx.fillStyle = "red";
      ctx.font = "18px Arial";
  
      // Display text above the ROI
    //   ctx.fillText("Selected Region", roi.x + 5, roi.y - 10);
  
      // Format ROI values to 2 decimal places
      const roiDetails = `x: ${roi.x.toFixed(2)}, y: ${roi.y.toFixed(2)}, w: ${roi.width.toFixed(2)}, h: ${roi.height.toFixed(2)}`;
      ctx.fillText(roiDetails, roi.x + 5, roi.y - 10);
    }
  };
  
  
  const applyBlur = (ctx, canvas) => {
    if (!roi) return;

    // Step 1: Draw the original image blurred
    ctx.filter = "blur(5px)";
    ctx.drawImage(imageRef.current, 0, 0);
    ctx.filter = "none";

    // Step 2: Draw the original image again in the ROI area to keep it clear
    ctx.drawImage(
      imageRef.current,
      roi.x,
      roi.y,
      roi.width,
      roi.height,
      roi.x,
      roi.y,
      roi.width,
      roi.height
    );

    // Step 3: Create a dark shadow outside ROI
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black shadow

    // Use a clipping mask to keep the ROI area clear
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height); // Full canvas
    ctx.rect(roi.x, roi.y, roi.width, roi.height); // ROI region
    ctx.closePath();

    ctx.fill("evenodd"); // This fills everything except the ROI
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * scaleFactors.x;
    const mouseY = (e.clientY - rect.top) * scaleFactors.y;
    return { x: mouseX, y: mouseY };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e); 

    const corner = getResizeCorner(x, y);
    if (roi && corner) {
      setIsResizing(true);
      setResizeDirection(corner);
    } else if (roi && isInsideRoi(x, y)) {
      setIsDragging(true);
      setStartPos({ x, y });
    } else {
      setIsDrawing(true);
      setStartPos({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && !isResizing && !isDragging) return;

    const { x, y } = getMousePos(e);

    if (isDrawing) {
      setRoi({
        x: startPos.x,
        y: startPos.y,
        width: x - startPos.x,
        height: y - startPos.y,
      });
    } else if (isResizing) {
      let newX = roi.x;
      let newY = roi.y;
      let newWidth = roi.width;
      let newHeight = roi.height;

      if (resizeDirection.includes("left")) {
        newWidth = Math.max(1, roi.x + roi.width - x);
        newX = Math.min(x, roi.x + roi.width - 1);
      }
      if (resizeDirection.includes("right")) {
        newWidth = Math.max(1, x - roi.x);
      }
      if (resizeDirection.includes("top")) {
        newHeight = Math.max(1, roi.y + roi.height - y);
        newY = Math.min(y, roi.y + roi.height - 1);
      }
      if (resizeDirection.includes("bottom")) {
        newHeight = Math.max(1, y - roi.y);
      }

      setRoi({ x: newX, y: newY, width: newWidth, height: newHeight });
    } else if (isDragging) {
      const dx = x - startPos.x;
      const dy = y - startPos.y;

      let newX = Math.max(0, Math.min(roi.x + dx, imageSize.width - roi.width));
      let newY = Math.max(
        0,
        Math.min(roi.y + dy, imageSize.height - roi.height)
      );

      setRoi({ ...roi, x: newX, y: newY });
      setStartPos({ x, y });
    }

    drawImage();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsResizing(false);
    setIsDragging(false);
    setResizeDirection(null);
  };

  const getResizeCorner = (x, y) => {
    if (!roi) return null;
    const buffer = 5;
    let direction = "";

    if (Math.abs(x - roi.x) < buffer) direction += "left";
    if (Math.abs(x - (roi.x + roi.width)) < buffer) direction += "right";
    if (Math.abs(y - roi.y) < buffer) direction += "top";
    if (Math.abs(y - (roi.y + roi.height)) < buffer) direction += "bottom";

    return direction || null;
  };

  const isInsideRoi = (x, y) => {
    return (
      roi &&
      x > roi.x &&
      x < roi.x + roi.width &&
      y > roi.y &&
      y < roi.y + roi.height
    );
  };

  const handleConfirm = () => {
    if (roi) {
      onRoiSelect(roi);
    }
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (roi.width <= 0 || roi.height <= 0) {
      alert("Please draw a valid ROI before submitting.");
      return;
    }

    const scaledRoi = {
      x: Math.round(roi.x ),
      y: Math.round(roi.y ),
      width: Math.round(roi.width ),
      height: Math.round(roi.height),
    };

    console.log("Submitting ROI:", scaledRoi);

    try {
      console.log("Submitting Scaled ROI:", scaledRoi);
      setIsSubmitting(true);
      const response = await fetch(`${BACKEND_URL}/train/fetch-draw-roi/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedProject,
          username,
          selectedDatastes,
          openimg,
          roi: scaledRoi, // Send the scaled ROI
          datasetName,
        }),
      });

      if (!response.ok) throw new Error("Error in submission");
      setSuccessMessage("ROI submitted successfully!");
      fetchDetails();
      setShowDatasetModal(false);
      setDrawRoi(false);
      setDatasetsName(datasetName);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center `}
    >
      <div
        className={`relative md:h-[96vh] sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-800 bg-gray-100 sm:flex xs:flex-wrap rounded-lg p-8 md:py-0`}
      >
        <div
          className={`absolute top-2 w-full flex  border-neutral-300 border-t-0 border-x-0 border-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-neutral-500 dark:hover:text-neutral-300 hover:text-neutral-700 focus:outline-none`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer ml-auto mr-4 mt-2 hover:rotate-90 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            onClick={() => setDrawRoi(false)}
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
        <div className="flex w-full mt-10  items-center">
          <div className="min-h-[94vh] w-full bg-gradient-to-black darK:from-neutral-900 dark:via-neutral-800 dark:to-black from-neutral-200 via-neutral-100 to-white flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-40 animate-pulse">
              <div className="particle-container">
                <span className="particle"></span>
                <span className="particle"></span>
                <span className="particle"></span>
                <span className="particle"></span>
                <span className="particle"></span>
              </div>
            </div>
            <div className="absolute left-0 z-50 ">
              <FaCaretLeft
                size={40}
                onClick={handlePrev}
                className=" cursor-pointer "
              />
            </div>
            <div className="absolute right-0 z-50   ">
              <FaCaretRight
                size={40}
                onClick={handleNext}
                className=" cursor-pointer "
              />
            </div>
            <div className="relative w-full min-h-[86vh] max-w-4xl p-6  dark:bg-neutral-900 bg bg-gray-200 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl border border-opacity-20 border-gray-700 hover:shadow-neon-blue transition-all duration-300 ease-out">
              <div
                ref={containerRef}
                className=" bg-black h-[70vh] w-full border border-gray-500 rounded-md "
              >
                <canvas
                  ref={canvasRef}
                  className="max-w-full w-auto h-auto max-h-full mx-auto "
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                ></canvas>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className=" inset-0 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div className=" py-2 px-6 rounded-lg flex shadow-lg w-auto gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Enter New Dataset Name
                    </h2>
                    <input
                      type="text"
                      className="mt-0 bg-neutral-700 px-2 w-96 h-10 border rounded  text-white"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    {/* <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setShowDatasetModal(false)}>Cancel</button> */}
                    <button
                      className="px-4  mt-1 h-10 bg-blue-600 text-white rounded relative"
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full inline-block"></span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrawRoi;
