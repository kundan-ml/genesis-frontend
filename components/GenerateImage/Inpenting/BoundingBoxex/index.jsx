import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SelectTool from "../SelectTools";

const BoundingBoxDraw = ({
  image,
  setImage,
  maskImage,
  setMaskImage,
  uploadedImage,
  inputPrompt,
  set_inpenting_uniqe_code,
  onChannelSelected,
}) => {
  const [loadingInpenting, setLoadingInpenting] = useState(false);
  const [currentBoundingBox, setCurrentBoundingBox] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [existingMask, setExistingMask] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newBoundingBox, setNewBoundingBox] = useState(null);
  const [freehandPath, setFreehandPath] = useState([]);
  const [clientSideMask, setClientSideMask] = useState(null);
  const [freehandPaths, setFreehandPaths] = useState([]);
  const [roiImage, setRoiImage] = useState(null);
  const [isColorImage, setIsColorImage] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState("rgb");
  const [originalImageDataURL, setOriginalImageDataURL] = useState("");
  const [processedImageDataURL, setProcessedImageDataURL] = useState("");
  const [processedImageFile, setProcessedImageFile] = useState(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const BACKEND_URL = process.env.BACKEND_URL;
  const [selectedTool, setSelectedTool] = useState("sam_rectangle");
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    if (inputPrompt && !isShrunk) {
      setIsShrunk(true);
    }
  }, [inputPrompt]);

  // Initialize color detection when image is uploaded
  useEffect(() => {
    if (uploadedImage && uploadedImage !== originalImageDataURL) {
      setOriginalImageDataURL(uploadedImage);
      checkIfColorImage(uploadedImage).then((isColor) => {
        setIsColorImage(isColor);
        if (!isColor) {
          setSelectedChannel("rgb"); // Reset to RGB for grayscale images
        }
      });
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (onChannelSelected) {
      onChannelSelected(selectedChannel);
    }
  }, [selectedChannel, onChannelSelected]);

  // Handle channel selection changes for color images
  useEffect(() => {
    if (isColorImage && selectedChannel && originalImageDataURL) {
      convertToGrayscale(originalImageDataURL, selectedChannel).then(
        ({ dataURL, file }) => {
          setProcessedImageDataURL(dataURL);
          setProcessedImageFile(file);
          // Clear existing shapes when channel changes
          setBoundingBoxes([]);
          setFreehandPaths([]);
          setClientSideMask(null);
          setRoiImage(null);
          setCurrentBoundingBox(null);
          setFreehandPath([]);
        }
      );
    } else if (!isColorImage && originalImageDataURL) {
      // For grayscale images, use the original image
      setProcessedImageDataURL(originalImageDataURL);
      setProcessedImageFile(image);
    }
  }, [isColorImage, selectedChannel, originalImageDataURL]);

  useEffect(() => {
    if (uploadedImage) {
      drawImage();
    }
  }, [
    uploadedImage,
    processedImageDataURL,
    currentBoundingBox,
    boundingBoxes,
    freehandPath,
    freehandPaths,
    clientSideMask,
  ]);

  const checkIfColorImage = (dataURL) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        const step = Math.max(1, Math.floor(data.length / 4 / 100)); // Sample 100 pixels
        for (let i = 0; i < data.length; i += 4 * step) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (
            Math.abs(r - g) > 5 ||
            Math.abs(r - b) > 5 ||
            Math.abs(g - b) > 5
          ) {
            resolve(true); // Color image
            return;
          }
        }
        resolve(false); // Grayscale image
      };
      img.src = dataURL;
    });
  };

  const convertToGrayscale = (dataURL, channel) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          let value;

          if (channel === "red") {
            value = data[i];
            data[i + 1] = value; // G
            data[i + 2] = value; // B
          } else if (channel === "green") {
            value = data[i + 1];
            data[i] = value; // R
            data[i + 2] = value; // B
          } else if (channel === "blue") {
            value = data[i + 2];
            data[i] = value; // R
            data[i + 1] = value; // G
          } else if (channel === "rgb") {
            // Keep original colors - no conversion needed
            continue;
          } else {
            // Fallback for grayscale or other cases
            value = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average to grayscale
            data[i] = value; // R
            data[i + 1] = value; // G
            data[i + 2] = value; // B
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const convertedDataURL = canvas.toDataURL("image/png");
        canvas.toBlob((blob) => {
          const file = new File([blob], "processed_image.png", {
            type: "image/png",
          });
          resolve({ dataURL: convertedDataURL, file });
        }, "image/png");
      };
      img.src = dataURL;
    });
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Use processed image if available (for channel selection), otherwise use original
    const imageSource = processedImageDataURL || uploadedImage;
    img.src = imageSource;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Draw all existing bounding boxes
      boundingBoxes.forEach((box, index) => {
        ctx.strokeStyle =
          index === boundingBoxes.length - 1 ? "red" : "rgba(255, 0, 0, 0.5)";
        ctx.lineWidth = 7;
        ctx.strokeRect(
          Math.min(box.x1, box.x2),
          Math.min(box.y1, box.y2),
          Math.abs(box.x2 - box.x1),
          Math.abs(box.y2 - box.y1)
        );
      });

      // Draw all existing freehand paths
      freehandPaths.forEach((path, index) => {
        ctx.strokeStyle =
          index === freehandPaths.length - 1 ? "red" : "rgba(255, 0, 0, 0.5)";
        ctx.lineWidth = 7;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();

        path.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });

        ctx.stroke();
      });

      // Draw current active shape
      if (
        selectedTool === "rectangle" ||
        selectedTool === "sam_rectangle" ||
        selectedTool === "circle"
      ) {
        if (currentBoundingBox) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 7;
          ctx.strokeRect(
            Math.min(currentBoundingBox.x1, currentBoundingBox.x2),
            Math.min(currentBoundingBox.y1, currentBoundingBox.y2),
            Math.abs(currentBoundingBox.x2 - currentBoundingBox.x1),
            Math.abs(currentBoundingBox.y2 - currentBoundingBox.y1)
          );
        }
      } else if (selectedTool === "freehand" && freehandPath.length > 0) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 7;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();

        freehandPath.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });

        ctx.stroke();
      }
    };
  };

  const generateClientSideMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const ctx = maskCanvas.getContext("2d");

    // Create black background
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Draw all selected regions in white
    ctx.fillStyle = "rgb(255, 255, 255)";

    // Draw bounding boxes
    boundingBoxes.forEach((box) => {
      if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
        ctx.fillRect(
          Math.min(box.x1, box.x2),
          Math.min(box.y1, box.y2),
          Math.abs(box.x2 - box.x1),
          Math.abs(box.y2 - box.y1)
        );
      } else if (selectedTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(box.x2 - box.x1, 2) + Math.pow(box.y2 - box.y1, 2)
        );
        ctx.beginPath();
        ctx.arc(box.x1, box.y1, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw freehand paths
    freehandPaths.forEach((path) => {
      ctx.beginPath();
      path.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.fill();
    });

    // Add current active shape to mask
    if (currentBoundingBox) {
      if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
        ctx.fillRect(
          Math.min(currentBoundingBox.x1, currentBoundingBox.x2),
          Math.min(currentBoundingBox.y1, currentBoundingBox.y2),
          Math.abs(currentBoundingBox.x2 - currentBoundingBox.x1),
          Math.abs(currentBoundingBox.y2 - currentBoundingBox.y1)
        );
      } else if (selectedTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(currentBoundingBox.x2 - currentBoundingBox.x1, 2) +
            Math.pow(currentBoundingBox.y2 - currentBoundingBox.y1, 2)
        );
        ctx.beginPath();
        ctx.arc(
          currentBoundingBox.x1,
          currentBoundingBox.y1,
          radius,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }

    if (freehandPath.length > 0) {
      ctx.beginPath();
      freehandPath.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.fill();
    }

    const maskDataURL = maskCanvas.toDataURL("image/png");
    setClientSideMask(maskDataURL);
    generateClientSideRoi(maskDataURL);
    return maskDataURL;
  };

  const generateClientSideRoi = (maskDataURL) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const roiCanvas = document.createElement("canvas");
    roiCanvas.width = canvas.width;
    roiCanvas.height = canvas.height;
    const ctx = roiCanvas.getContext("2d");

    // Draw original image
    const img = new Image();
    const imageSource = processedImageDataURL || uploadedImage;
    img.src = imageSource;
    ctx.drawImage(img, 0, 0);

    // Draw mask overlay
    const maskImg = new Image();
    maskImg.src = maskDataURL;
    ctx.globalAlpha = 0.5;
    ctx.drawImage(maskImg, 0, 0);
    ctx.globalAlpha = 1.0;

    setRoiImage(roiCanvas.toDataURL("image/png"));
  };

  const saveMaskToBackend = async (maskDataURL) => {
    try {
      // Convert mask data URL to blob
      const response = await fetch(maskDataURL);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();

      // Use processed image file if available (for channel selection), otherwise use original
      const imageToSend = processedImageFile || image;
      formData.append("file", imageToSend); // Send the currently displayed channel image
      formData.append("mask", blob, "mask.png"); // Generated mask

      // Send to backend
      const result = await axios.post(
        `${BACKEND_URL}/api/save-mask/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update state with the saved mask URL from backend
      setMaskImage(result.data.mask_url);
      setRoiImage(result.data.roi_url);
      set_inpenting_uniqe_code(result.data.unique_code);

      return result.data;
    } catch (error) {
      console.error("Error saving mask to backend:", error);
      throw error;
    }
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const startX = (e.clientX - rect.left) * scaleX;
    const startY = (e.clientY - rect.top) * scaleY;

    if (
      selectedTool === "rectangle" ||
      selectedTool === "sam_rectangle" ||
      selectedTool === "circle"
    ) {
      setCurrentBoundingBox({ x1: startX, y1: startY, x2: startX, y2: startY });
    } else if (selectedTool === "freehand") {
      setFreehandPath([{ x: startX, y: startY }]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    if (
      selectedTool === "rectangle" ||
      selectedTool === "sam_rectangle" ||
      selectedTool === "circle"
    ) {
      setCurrentBoundingBox((prev) => ({
        ...prev,
        x2: currentX,
        y2: currentY,
      }));
    } else if (selectedTool === "freehand") {
      setFreehandPath((prev) => [...prev, { x: currentX, y: currentY }]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (
      selectedTool === "rectangle" ||
      selectedTool === "sam_rectangle" ||
      selectedTool === "circle"
    ) {
      if (!currentBoundingBox) return;

      setBoundingBoxes((prev) => [...prev, currentBoundingBox]);

      if (selectedTool === "sam_rectangle" && maskImage) {
        setNewBoundingBox(currentBoundingBox);
        setShowPopup(true);
      } else {
        generateMask(false);
      }

      setCurrentBoundingBox(null);
    } else if (selectedTool === "freehand" && freehandPath.length > 0) {
      setFreehandPaths((prev) => [...prev, freehandPath]);
      generateMask(false);
      setFreehandPath([]);
    }
  };

  const generateMask = async (useExistingMask) => {
    if (selectedTool === "sam_rectangle") {
      // SAM rectangle logic
      const formData = new FormData();

      // Use processed image file if available (for channel selection), otherwise use original
      const imageToSend = processedImageFile || image;
      formData.append("file", imageToSend);

      formData.append(
        "x1",
        Math.round(newBoundingBox ? newBoundingBox.x1 : currentBoundingBox.x1)
      );
      formData.append(
        "y1",
        Math.round(newBoundingBox ? newBoundingBox.y1 : currentBoundingBox.y1)
      );
      formData.append(
        "x2",
        Math.round(newBoundingBox ? newBoundingBox.x2 : currentBoundingBox.x2)
      );
      formData.append(
        "y2",
        Math.round(newBoundingBox ? newBoundingBox.y2 : currentBoundingBox.y2)
      );
      formData.append("use_existing_mask", useExistingMask);
      formData.append("existing_mask", maskImage);

      setLoadingInpenting(true);
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/generate-mask/`,
          formData
        );
        setMaskImage(response.data.mask.mask_url);
        setRoiImage(response.data.mask.roi_url);
        set_inpenting_uniqe_code(response.data.mask.unique_code);
        if (!useExistingMask) {
          setExistingMask(response.data.mask);
        }
      } catch (error) {
        console.error("Error generating mask:", error);
      }
      setLoadingInpenting(false);
    } else {
      // For other tools (rectangle, circle, freehand)
      setLoadingInpenting(true);
      try {
        const maskDataURL = generateClientSideMask();
        await saveMaskToBackend(maskDataURL);
      } catch (error) {
        console.error("Error saving mask:", error);
      }
      setLoadingInpenting(false);
    }
  };

  const clearAllShapes = () => {
    setBoundingBoxes([]);
    setFreehandPaths([]);
    setClientSideMask(null);
    setRoiImage(null);
    setCurrentBoundingBox(null);
    setFreehandPath([]);
  };

  const downloadImage = async (imageSrc, filename) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <>
      <SelectTool
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        clearAllShapes={clearAllShapes}
        isShrunk={isShrunk}
        setIsShrunk={setIsShrunk}
      />
      <section
        className={`transition-all duration-1000 ease-in-out ${
          isShrunk ? "w-[400px] ml-4" : "w-full"
        }  max-w-10xl mb-0 border-none h-auto py-0 sm:px-0`}
      >
        <div className="mb-8 mx-0 sm:ml-[7vw] py-6 sm:py-0 border-none rounded-2xl shadow-lg">
          <div className="flex items-center justify-between space-x-8">
            <div className="flex flex-col w-full gap-4">
              <div
                className={`grid ${
                  isShrunk && !(maskImage || clientSideMask)
                    ? "grid-cols-1"
                    : "grid-cols-2"
                } gap-8 w-full`}
              >
                {/* Image Canvas */}
                <div className="relative">
                  <div
                    className={`relative mt-4 ${
                      isShrunk ? "p-1" : "p-2"
                    } bg-white/10 rounded-lg shadow-xl`}
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto rounded-lg cursor-crosshair"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                    />
                    {loadingInpenting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Processed Mask Image - Only show when not shrunk */}
                {(maskImage || clientSideMask) && (
                  <div
                    className="relative w-full"
                    onClick={() => {
                      const parts = image.name.split(".");
                      const fileName = `${parts.slice(
                        0,
                        -1
                      )}.jpeg_msk_0.${parts.at(-1)}`;
                      downloadImage(
                        clientSideMask || `${BACKEND_URL}/${maskImage}`,
                        fileName
                      );
                    }}
                  >
                    <div
                      className={`relative mt-6 ${
                        inputPrompt ? "p-1" : "p-2"
                      } bg-white/10 rounded-lg shadow-xl`}
                    >
                      <img
                        src={clientSideMask || `${BACKEND_URL}/${maskImage}`}
                        alt="Mask"
                        className="w-full h-auto rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Color Channel Selection - Moved below the grid */}
              {isColorImage && (
                <div
                  className={`my-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-neutral-900/30 dark:to-neutral-900/30 border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-all duration-300 hover:shadow-md`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 w-full">
                      <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 flex flex-wrap items-center gap-2">
                        <span>Color Channel Selection</span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-800/60 text-indigo-700 dark:text-indigo-200 rounded-full">
                          {selectedChannel === "rgb"
                            ? "Full Color"
                            : `${
                                selectedChannel.charAt(0).toUpperCase() +
                                selectedChannel.slice(1)
                              } Channel`}
                        </span>
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Choose which color channel to display and work with
                      </p>

                      <div className="mt-3 relative w-full">
                        <select
                          value={selectedChannel}
                          onChange={(e) => setSelectedChannel(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 text-sm rounded-lg bg-white dark:bg-neutral-800 border-0 shadow-sm ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none transition-all"
                        >
                          <option value="rgb">RGB (Full Color)</option>
                          <option value="red">Red Channel Only</option>
                          <option value="green">Green Channel Only</option>
                          <option value="blue">Blue Channel Only</option>
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-neutral-900 p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold mb-4">
                Choose Mask Generation Method
              </p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-4"
                onClick={() => {
                  setShowPopup(false);
                  generateMask(false);
                }}
              >
                Generate New Mask
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setShowPopup(false);
                  generateMask(true);
                }}
              >
                Use Existing Mask
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default BoundingBoxDraw;
