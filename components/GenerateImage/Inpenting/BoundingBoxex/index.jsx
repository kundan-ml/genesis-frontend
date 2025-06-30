import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SelectTool from "../SelectTools";

const BoundingBoxDraw = ({ image, setImage, maskImage, setMaskImage, uploadedImage, inputPrompt, set_inpenting_uniqe_code }) => {
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

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const BACKEND_URL = process.env.BACKEND_URL;
  const [selectedTool, setSelectedTool] = useState("sam_rectangle");

  useEffect(() => {
    if (uploadedImage) {
      drawImage();
    }
  }, [uploadedImage, currentBoundingBox, boundingBoxes, freehandPath, freehandPaths, clientSideMask]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = uploadedImage;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Draw all existing bounding boxes
      boundingBoxes.forEach((box, index) => {
        ctx.strokeStyle = index === boundingBoxes.length - 1 ? "red" : "rgba(255, 0, 0, 0.5)";
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
        ctx.strokeStyle = index === freehandPaths.length - 1 ? "red" : "rgba(255, 0, 0, 0.5)";
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
      if (selectedTool === "rectangle" || selectedTool === "sam_rectangle" || selectedTool === "circle") {
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
    
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const ctx = maskCanvas.getContext('2d');
  
    // Create black background
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  
    // Draw all selected regions in white
    ctx.fillStyle = 'rgb(255, 255, 255)';
    
    // Draw bounding boxes
    boundingBoxes.forEach(box => {
      if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
        ctx.fillRect(
          Math.min(box.x1, box.x2),
          Math.min(box.y1, box.y2),
          Math.abs(box.x2 - box.x1),
          Math.abs(box.y2 - box.y1)
        );
      } else if (selectedTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(box.x2 - box.x1, 2) + 
          Math.pow(box.y2 - box.y1, 2)
        );
        ctx.beginPath();
        ctx.arc(box.x1, box.y1, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // Draw freehand paths
    freehandPaths.forEach(path => {
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
        ctx.arc(currentBoundingBox.x1, currentBoundingBox.y1, radius, 0, 2 * Math.PI);
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
  
    const maskDataURL = maskCanvas.toDataURL('image/png');
    setClientSideMask(maskDataURL);
    generateClientSideRoi(maskDataURL);
    return maskDataURL;
  };

  const generateClientSideRoi = (maskDataURL) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const roiCanvas = document.createElement('canvas');
    roiCanvas.width = canvas.width;
    roiCanvas.height = canvas.height;
    const ctx = roiCanvas.getContext('2d');
    
    // Draw original image
    const img = new Image();
    img.src = uploadedImage;
    ctx.drawImage(img, 0, 0);
    
    // Draw mask overlay
    const maskImg = new Image();
    maskImg.src = maskDataURL;
    ctx.globalAlpha = 0.5;
    ctx.drawImage(maskImg, 0, 0);
    ctx.globalAlpha = 1.0;
    
    setRoiImage(roiCanvas.toDataURL('image/png'));
  };

  const saveMaskToBackend = async (maskDataURL) => {
    try {
      // Convert mask data URL to blob
      const response = await fetch(maskDataURL);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append("file", image); // Original image
      formData.append("mask", blob, "mask.png"); // Generated mask
      
      // Send to backend
      const result = await axios.post(`${BACKEND_URL}/api/save-mask/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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

    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle" || selectedTool === "circle") {
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

    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle" || selectedTool === "circle") {
      setCurrentBoundingBox((prev) => ({ ...prev, x2: currentX, y2: currentY }));
    } else if (selectedTool === "freehand") {
      setFreehandPath((prev) => [...prev, { x: currentX, y: currentY }]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle" || selectedTool === "circle") {
      if (!currentBoundingBox) return;
      
      setBoundingBoxes(prev => [...prev, currentBoundingBox]);
      
      if (selectedTool === "sam_rectangle" && maskImage) {
        setNewBoundingBox(currentBoundingBox);
        setShowPopup(true);
      } else {
        generateMask(false);
      }
      
      setCurrentBoundingBox(null);
    } else if (selectedTool === "freehand" && freehandPath.length > 0) {
      setFreehandPaths(prev => [...prev, freehandPath]);
      generateMask(false);
      setFreehandPath([]);
    }
  };

  const generateMask = async (useExistingMask) => {
    if (selectedTool === "sam_rectangle") {
      // SAM rectangle logic
      const formData = new FormData();
      formData.append("file", image);
      formData.append("x1", Math.round(newBoundingBox ? newBoundingBox.x1 : currentBoundingBox.x1));
      formData.append("y1", Math.round(newBoundingBox ? newBoundingBox.y1 : currentBoundingBox.y1));
      formData.append("x2", Math.round(newBoundingBox ? newBoundingBox.x2 : currentBoundingBox.x2));
      formData.append("y2", Math.round(newBoundingBox ? newBoundingBox.y2 : currentBoundingBox.y2));
      formData.append("use_existing_mask", useExistingMask);
      formData.append("existing_mask", maskImage);
      
      setLoadingInpenting(true);
      try {
        const response = await axios.post(`${BACKEND_URL}/api/generate-mask/`, formData);
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
      />

      
      <section
        className={`transition-width duration-1000 ease-in-out ${inputPrompt ? "w-[400px]" : "w-full"
          } max-w-10xl mb-0 border-none h-auto py-0 sm:px-0`}
      >
        <div className="mb-8 mx-0 sm:ml-[7vw] py-6 sm:py-0 border-none rounded-2xl shadow-lg">
          <div className="flex items-center justify-between space-x-8">
            <div className="grid grid-cols-2 gap-8 w-full">
              {/* Image Canvas */}
              <div className="relative">
                <div className={`relative mt-4 ${inputPrompt ? "p-1" : "p-2"} bg-white/10 rounded-lg shadow-xl`}>
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

              {/* Processed Mask Image */}
              {(maskImage || clientSideMask) && (
                <div className="relative w-full"
                onClick={() => {
                  const parts = image.name.split(".");
                  const fileName = `${parts.slice(0, -1)}.jpeg_msk_0.${parts.at(-1)}`;
                  downloadImage(
                    clientSideMask || `${BACKEND_URL}/${maskImage}`,
                    fileName
                  );
                }}
                >
                  <div className={`relative mt-6 ${inputPrompt ? "p-1" : "p-2"} bg-white/10 rounded-lg shadow-xl`}>
                    <img
                      src={clientSideMask || `${BACKEND_URL}/${maskImage}`}
                      alt="Mask"
                      className="w-full h-auto rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
              


               {/* Process ROI Image  */}
               {/* {(roiImage || clientSideMask) && (
                <div className="relative w-full"
                onClick={() => {
                  const parts = image.name.split(".");
                  const fileName = `${parts.slice(0, -1)}.jpeg_msk_0.${parts.at(-1)}`;
                  downloadImage(
                    clientSideMask || `${BACKEND_URL}/${roiImage}`,
                    fileName
                  );
                }}
                >
                  <div className={`relative mt-6 ${inputPrompt ? "p-1" : "p-2"} bg-white/10 rounded-lg shadow-xl`}>
                    <img
                      src={ `${BACKEND_URL}/${roiImage}`}
                      alt="Mask"
                      className="w-full h-auto rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-neutral-900 p-4 rounded-lg shadow-lg">
              <p className="text-lg font-bold mb-4">Choose Mask Generation Method</p>
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