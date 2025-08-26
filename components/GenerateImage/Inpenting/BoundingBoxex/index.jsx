import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SelectTool from "../SelectTools";
import Modal from "react-modal";
import { AiOutlineCloudUpload, AiOutlineExpand } from "react-icons/ai";
import { SiCoronarenderer } from "react-icons/si";

const BoundingBoxDraw = ({
  image,
  setImage,
  maskImage,
  setMaskImage,
  uploadedImage,
  setUploadedImage,
  inputPrompt,
  set_inpenting_uniqe_code,
  onChannelSelected,
  loading,
  handleGenerate,
  selectedProject,
  username,
}) => {
  const [isMaskGenerated, setIsMaskGenerated] = useState(false);
  const [loadingInpenting, setLoadingInpenting] = useState(false);
  const [currentBoundingBox, setCurrentBoundingBox] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [existingMask, setExistingMask] = useState(null);
  const [freehandPath, setFreehandPath] = useState([]);
  const [clientSideMask, setClientSideMask] = useState(null);
  const [freehandPaths, setFreehandPaths] = useState([]);
  const [polylinePaths, setPolylinePaths] = useState([]);
  const [currentPolylinePath, setCurrentPolylinePath] = useState([]);
  const [roiImage, setRoiImage] = useState(null);
  const [isColorImage, setIsColorImage] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState("rgb");
  const [originalImageDataURL, setOriginalImageDataURL] = useState("");
  const [processedImageDataURL, setProcessedImageDataURL] = useState("");
  const [processedImageFile, setProcessedImageFile] = useState(null);
  const isProcessingRef = useRef(false);
  // Modal states
  const [showExpandModal, setShowExpandModal] = useState(false);
  const [modalScale, setModalScale] = useState(1);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  // Mask Modal states
  const [showMaskExpandModal, setShowMaskExpandModal] = useState(false);
  const [maskModalScale, setMaskModalScale] = useState(1);
  const [maskModalPosition, setMaskModalPosition] = useState({ x: 0, y: 0 });
  const [isMaskPanning, setIsMaskPanning] = useState(false);
  const [maskPanStart, setMaskPanStart] = useState({ x: 0, y: 0 });
  // Polyline double-click detection
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickPos, setLastClickPos] = useState({ x: 0, y: 0 });

  // Refs
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const modalImgRef = useRef(null);
  const modalCanvasRef = useRef(null);

  const BACKEND_URL = process.env.BACKEND_URL;
  const [selectedTool, setSelectedTool] = useState("sam_rectangle");
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    setIsMaskGenerated(!!(maskImage || clientSideMask));
  }, [maskImage, clientSideMask]);

  // Initialize color detection when image is uploaded
  useEffect(() => {
    if (uploadedImage && uploadedImage !== originalImageDataURL) {
      setOriginalImageDataURL(uploadedImage);
      checkIfColorImage(uploadedImage).then((isColor) => {
        setIsColorImage(isColor);
        if (!isColor) {
          setSelectedChannel("rgb");
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
          clearAllShapes();
        }
      );
    } else if (!isColorImage && originalImageDataURL) {
      setProcessedImageDataURL(originalImageDataURL);
      setProcessedImageFile(image);
    }
  }, [isColorImage, selectedChannel, originalImageDataURL]);

  // Keyboard event handlers for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showExpandModal && e.code === "Space") {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      if (showExpandModal && e.code === "Space") {
        e.preventDefault();
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [showExpandModal]);

  // Polyline enter key to complete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Enter" &&
        selectedTool === "polyline" &&
        currentPolylinePath.length >= 3
      ) {
        e.preventDefault();
        e.stopPropagation();
        completePolyline();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTool, currentPolylinePath.length]);

  useEffect(() => {
    const clearShapes = async () => {
      if (loadingInpenting) {
        return;
      }
      if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
        setFreehandPaths([]);
        setFreehandPath([]);
        setPolylinePaths([]);
        setCurrentPolylinePath([]);
      } else if (selectedTool === "freehand") {
        setBoundingBoxes([]);
        setCurrentBoundingBox(null);
        setPolylinePaths([]);
        setCurrentPolylinePath([]);
      } else if (selectedTool === "polyline") {
        setBoundingBoxes([]);
        setCurrentBoundingBox(null);
        setFreehandPaths([]);
        setFreehandPath([]);
      }

      // Clear masks when switching tools
      setClientSideMask(null);
      setRoiImage(null);
      setExistingMask(null);

      setTimeout(() => {
        redrawCanvas();
        redrawModalCanvas();
      }, 50);
    };

    clearShapes();
  }, [selectedTool]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageDataURL = event.target.result;
        setImage(file); // Pass the file object to parent
        setOriginalImageDataURL(newImageDataURL);

        // Update parent state immediately
        setUploadedImage(newImageDataURL);

        // Then check color (if needed for your component logic)
        checkIfColorImage(newImageDataURL).then((isColor) => {
          setIsColorImage(isColor);
          if (!isColor) {
            setSelectedChannel("rgb");
          }
        });

        clearAllShapes();
      };
      reader.readAsDataURL(file);
    }
  };

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
            value = (data[i] + data[i + 1] + data[i + 2]) / 3;
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

  const initCanvas = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    // Set internal dimensions to natural image size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    redrawCanvas();
  };

  const initModalCanvas = () => {
    if (!modalImgRef.current || !modalCanvasRef.current) return;
    const img = modalImgRef.current;
    const canvas = modalCanvasRef.current;
    // Set internal dimensions to natural image size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    redrawModalCanvas();
  };

  const drawShapes = (ctx) => {
    // Draw bounding boxes
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
    // Draw freehand paths
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

    // Draw polyline paths
    polylinePaths.forEach((path, index) => {
      ctx.strokeStyle =
        index === polylinePaths.length - 1 ? "red" : "rgba(255, 0, 0, 0.5)";
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
      if (path.length > 2) {
        ctx.closePath();
      }
      ctx.stroke();
    });

    // Draw current shapes
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

    if (freehandPath.length > 0) {
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

    if (currentPolylinePath.length > 0) {
      // Draw lines if there are 2 or more points
      if (currentPolylinePath.length > 1) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 7;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        currentPolylinePath.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
      // Draw dots
      currentPolylinePath.forEach((point) => {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    }
  };

  const redrawCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawShapes(ctx);
  };

  const redrawModalCanvas = () => {
    if (!modalCanvasRef.current) return;
    const ctx = modalCanvasRef.current.getContext("2d");
    ctx.clearRect(
      0,
      0,
      modalCanvasRef.current.width,
      modalCanvasRef.current.height
    );
    drawShapes(ctx);
  };

  useEffect(() => {
    redrawCanvas();
    redrawModalCanvas();
  }, [
    boundingBoxes,
    freehandPaths,
    polylinePaths,
    currentBoundingBox,
    freehandPath,
    currentPolylinePath,
  ]);

  const getCanvasCoordinates = (e, canvas) => {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getModalCanvasCoordinates = (e) => {
    if (!modalCanvasRef.current) return { x: 0, y: 0 };
    const canvas = modalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Adjust for modal scale and position
    const x = (e.clientX - rect.left) / modalScale;
    const y = (e.clientY - rect.top) / modalScale;
    const scaleX = canvas.width / (rect.width / modalScale);
    const scaleY = canvas.height / (rect.height / modalScale);
    return {
      x: x * scaleX,
      y: y * scaleY,
    };
  };

  // Main canvas event handlers
  const handleMouseDown = (e) => {
    if (!canvasRef.current || !imgRef.current) return;
    // Right click for panning
    if (e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({
        x: e.clientX,
        y: e.clientY,
      });
      return;
    }
    const coords = getCanvasCoordinates(e, canvasRef.current);
    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
      setCurrentBoundingBox({
        x1: coords.x,
        y1: coords.y,
        x2: coords.x,
        y2: coords.y,
      });
      setIsDrawing(true);
    } else if (selectedTool === "freehand") {
      setFreehandPath([coords]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current || !imgRef.current) return;

    const coords = getCanvasCoordinates(e, canvasRef.current);

    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
      setCurrentBoundingBox((prev) => ({
        ...prev,
        x2: coords.x,
        y2: coords.y,
      }));
    } else if (selectedTool === "freehand") {
      setFreehandPath((prev) => [...prev, coords]);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
      if (currentBoundingBox) {
        setBoundingBoxes((prev) => {
          const newBox = { ...currentBoundingBox };
          const updated = [...prev, newBox];
          if (selectedTool === "rectangle") {
            generateRectangleMask(updated);
          } else {
            generateSAMMask(newBox, prev.length > 0);
          }
          return updated;
        });
        setCurrentBoundingBox(null);
      }
    } else if (selectedTool === "freehand" && freehandPath.length > 0) {
      setFreehandPaths((prev) => {
        const newPath = [...freehandPath];
        const updated = [...prev, newPath];
        generateFreehandMask(updated);
        return updated;
      });
      setFreehandPath([]);
    }
  };

  const handleCanvasClick = (e) => {
    if (selectedTool !== "polyline") return;
    e.stopPropagation();
    e.preventDefault();
    const coords = getCanvasCoordinates(e, canvasRef.current, imgRef.current);
    const now = Date.now();
    const dist = Math.hypot(
      coords.x - lastClickPos.x,
      coords.y - lastClickPos.y
    );

    if (
      now - lastClickTime < 500 &&
      dist < 10 &&
      currentPolylinePath.length >= 2
    ) {
      completePolyline(e);
    } else {
      setCurrentPolylinePath((prev) => [...prev, coords]);
    }

    setLastClickTime(now);
    setLastClickPos(coords);
  };

  const completePolyline = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (currentPolylinePath.length >= 3) {
      setPolylinePaths((prev) => {
        const newPath = [...currentPolylinePath];
        const updated = [...prev, newPath];
        generatePolylineMask(updated);
        return updated;
      });
      setCurrentPolylinePath([]);
    }
  };

  const generateSAMMask = async (box, useExisting = false) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoadingInpenting(true);

    try {
      const formData = new FormData();
      const imageToSend = processedImageFile || image;
      formData.append("file", imageToSend);
      formData.append("x1", Math.round(box.x1));
      formData.append("y1", Math.round(box.y1));
      formData.append("x2", Math.round(box.x2));
      formData.append("y2", Math.round(box.y2));
      formData.append("use_existing_mask", useExisting);
      if (useExisting && existingMask) {
        formData.append("existing_mask", existingMask.mask_url);
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/generate-mask/`,
        formData
      );

      setMaskImage(response.data.mask.mask_url);
      setRoiImage(response.data.mask.roi_url);
      set_inpenting_uniqe_code(response.data.mask.unique_code);
      setExistingMask(response.data.mask);
      setIsMaskGenerated(true);
    } catch (error) {
      console.error("Error generating SAM mask:", error);
    } finally {
      setLoadingInpenting(false);
      isProcessingRef.current = false;
    }
  };

  const generateRectangleMask = async (boxes) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoadingInpenting(true);

    try {
      const maskDataURL = await createMaskFromRectangles(boxes);
      setClientSideMask(maskDataURL);
      await saveMaskToBackend(maskDataURL);
      generateClientSideRoi(maskDataURL);
      setIsMaskGenerated(true);
    } catch (error) {
      console.error("Error generating rectangle mask:", error);
    } finally {
      setLoadingInpenting(false);
      isProcessingRef.current = false;
    }
  };

  const generateFreehandMask = async (paths) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoadingInpenting(true);

    try {
      const maskDataURL = await createMaskFromFreehand(paths);
      setClientSideMask(maskDataURL);
      await saveMaskToBackend(maskDataURL);
      generateClientSideRoi(maskDataURL);
      setIsMaskGenerated(true);
    } catch (error) {
      console.error("Error generating freehand mask:", error);
    } finally {
      setLoadingInpenting(false);
      isProcessingRef.current = false;
    }
  };

  const generatePolylineMask = async (paths) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoadingInpenting(true);

    try {
      const maskDataURL = await createMaskFromPolylines(paths);
      setClientSideMask(maskDataURL);
      await saveMaskToBackend(maskDataURL);
      generateClientSideRoi(maskDataURL);
      setIsMaskGenerated(true);
    } catch (error) {
      console.error("Error generating polyline mask:", error);
    } finally {
      setLoadingInpenting(false);
      isProcessingRef.current = false;
    }
  };

  const createMaskFromRectangles = async (boxes) => {
    if (!imgRef.current || boxes.length === 0) return null;

    const img = imgRef.current;
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = img.naturalWidth;
    maskCanvas.height = img.naturalHeight;
    const ctx = maskCanvas.getContext("2d");

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    boxes.forEach((box) => {
      ctx.fillRect(
        Math.min(box.x1, box.x2),
        Math.min(box.y1, box.y2),
        Math.abs(box.x2 - box.x1),
        Math.abs(box.y2 - box.y1)
      );
    });

    return maskCanvas.toDataURL("image/png");
  };

  const createMaskFromFreehand = async (paths) => {
    if (!imgRef.current || paths.length === 0) return null;

    const img = imgRef.current;
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = img.naturalWidth;
    maskCanvas.height = img.naturalHeight;
    const ctx = maskCanvas.getContext("2d");

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    paths.forEach((path) => {
      if (path.length > 0) {
        ctx.beginPath();
        path.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fill();
      }
    });

    return maskCanvas.toDataURL("image/png");
  };

  const createMaskFromPolylines = async (paths) => {
    if (!imgRef.current || paths.length === 0) return null;

    const img = imgRef.current;
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = img.naturalWidth;
    maskCanvas.height = img.naturalHeight;
    const ctx = maskCanvas.getContext("2d");

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    paths.forEach((path) => {
      if (path.length > 2) {
        ctx.beginPath();
        path.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fill();
      }
    });

    return maskCanvas.toDataURL("image/png");
  };

  const generateClientSideRoi = (maskDataURL) => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const roiCanvas = document.createElement("canvas");
    roiCanvas.width = img.naturalWidth;
    roiCanvas.height = img.naturalHeight;
    const ctx = roiCanvas.getContext("2d");

    const tempImg = new Image();
    const imageSource = processedImageDataURL || uploadedImage;
    tempImg.src = imageSource;
    tempImg.onload = () => {
      ctx.drawImage(tempImg, 0, 0);

      const maskImg = new Image();
      maskImg.src = maskDataURL;
      maskImg.onload = () => {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(maskImg, 0, 0);
        ctx.globalAlpha = 1.0;
        setRoiImage(roiCanvas.toDataURL("image/png"));
      };
    };
  };

  const saveMaskToBackend = async (maskDataURL) => {
    try {
      const response = await fetch(maskDataURL);
      const blob = await response.blob();

      const formData = new FormData();
      const imageToSend = processedImageFile || image;
      formData.append("file", imageToSend);
      formData.append("mask", blob, "mask.png");

      const result = await axios.post(
        `${BACKEND_URL}/api/save-mask/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMaskImage(result.data.mask_url);
      setRoiImage(result.data.roi_url);
      set_inpenting_uniqe_code(result.data.unique_code);

      return result.data;
    } catch (error) {
      console.error("Error saving mask to backend:", error);
      throw error;
    }
  };

  // Modal event handlers
  const handleModalMouseDown = (e) => {
    // Right click for panning
    if (e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y,
      });
      return;
    }

    if (!modalCanvasRef.current || !modalImgRef.current) return;

    const coords = getModalCanvasCoordinates(e);

    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
      setCurrentBoundingBox({
        x1: coords.x,
        y1: coords.y,
        x2: coords.x,
        y2: coords.y,
      });
      setIsDrawing(true);
    } else if (selectedTool === "freehand") {
      setFreehandPath([coords]);
      setIsDrawing(true);
    }
  };

  const handleModalMouseMove = (e) => {
    if (isPanning) {
      setModalPosition({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!isDrawing || !modalCanvasRef.current || !modalImgRef.current) return;

    const coords = getModalCanvasCoordinates(e);

    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
      setCurrentBoundingBox((prev) => ({
        ...prev,
        x2: coords.x,
        y2: coords.y,
      }));
    } else if (selectedTool === "freehand") {
      setFreehandPath((prev) => [...prev, coords]);
    }
  };

  const handleModalMouseUp = () => {
    setIsPanning(false);

    if (!isDrawing) return;
    setIsDrawing(false);

    if (selectedTool === "rectangle" || selectedTool === "sam_rectangle") {
      if (currentBoundingBox) {
        setBoundingBoxes((prev) => {
          const newBox = { ...currentBoundingBox };
          const updated = [...prev, newBox];
          if (selectedTool === "rectangle") {
            generateRectangleMask(updated);
          } else {
            generateSAMMask(newBox, prev.length > 0);
          }
          return updated;
        });
        setCurrentBoundingBox(null);
      }
    } else if (selectedTool === "freehand" && freehandPath.length > 0) {
      setFreehandPaths((prev) => {
        const newPath = [...freehandPath];
        const updated = [...prev, newPath];
        generateFreehandMask(updated);
        return updated;
      });
      setFreehandPath([]);
    }
  };

  const handleModalCanvasClick = (e) => {
    if (selectedTool !== "polyline") return;

    const coords = getModalCanvasCoordinates(e);
    const now = Date.now();
    const dist = Math.hypot(
      coords.x - lastClickPos.x,
      coords.y - lastClickPos.y
    );

    if (
      now - lastClickTime < 500 &&
      dist < 10 &&
      currentPolylinePath.length >= 2
    ) {
      completePolyline();
    } else {
      setCurrentPolylinePath((prev) => [...prev, coords]);
    }

    setLastClickTime(now);
    setLastClickPos(coords);
  };

  const handleModalWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setModalScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
  };

  const handleMaskModalWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setMaskModalScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
  };

  const resetModalView = () => {
    setModalScale(1);
    setModalPosition({ x: 0, y: 0 });
  };

  const openExpandModal = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowExpandModal(true);
  };

  const openMaskExpandModal = () => {
    setShowMaskExpandModal(true);
    setMaskModalScale(1);
    setMaskModalPosition({ x: 0, y: 0 });
  };

  const closeMaskExpandModal = () => {
    setShowMaskExpandModal(false);
  };

  const handleMaskModalMouseDown = (e) => {
    if (e.button === 0) {
      // Left click for panning
      setIsMaskPanning(true);
      setMaskPanStart({
        x: e.clientX - maskModalPosition.x,
        y: e.clientY - maskModalPosition.y,
      });
    }
  };

  const handleMaskModalMouseMove = (e) => {
    if (isMaskPanning) {
      setMaskModalPosition({
        x: e.clientX - maskPanStart.x,
        y: e.clientY - maskPanStart.y,
      });
    }
  };

  const handleMaskModalMouseUp = () => {
    setIsMaskPanning(false);
  };

  const resetMaskModalView = () => {
    setMaskModalScale(1);
    setMaskModalPosition({ x: 0, y: 0 });
  };

  const clearCurrentPolyline = () => {
    setCurrentPolylinePath([]);
    redrawCanvas();
    redrawModalCanvas();
  };

  const closeExpandModal = () => {
    resetModalView();
    setShowExpandModal(false);
  };

  const clearAllShapes = () => {
    setBoundingBoxes([]);
    setFreehandPaths([]);
    setPolylinePaths([]);
    setClientSideMask(null);
    setRoiImage(null);
    setCurrentBoundingBox(null);
    setFreehandPath([]);
    setCurrentPolylinePath([]);
    setExistingMask(null);
    setIsMaskGenerated(false);
    redrawCanvas();
    redrawModalCanvas();
  };

  const handleInpaintingGenerate = () => {
    handleGenerate(null, 1, inputPrompt, selectedProject);
  };

  return (
    <>
      <div className="p-4 ml-28 dark:bg-[#1a1a1a] bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white text-gray-800">
            Composer
          </h2>
          <SelectTool
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            clearAllShapes={clearAllShapes}
            isShrunk={isShrunk}
            setIsShrunk={setIsShrunk}
          />
        </div>

        <div className="border dark:border-gray-600 border-gray-300 rounded-lg p-2">
          {/* Images Container - Side by Side Layout */}
          <div
            className={`grid gap-4 ${
              maskImage || clientSideMask
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {/* Original Image */}
            <div className="relative">
              <label
                className="flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-300 transition duration-300 dark:border-gray-500 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900"
                onMouseDown={(e) => {
                  if (uploadedImage || originalImageDataURL) e.preventDefault();
                }}
              >
                {uploadedImage || originalImageDataURL ? (
                  <div className="relative">
                    <img
                      ref={imgRef}
                      src={
                        processedImageDataURL ||
                        uploadedImage ||
                        originalImageDataURL
                      }
                      alt="Uploaded"
                      className="max-h-96 w-auto object-contain rounded-md"
                      onLoad={initCanvas}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full cursor-crosshair rounded-md"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e);
                      }}
                      onMouseMove={(e) => {
                        e.stopPropagation();
                        handleMouseMove(e);
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleMouseUp(e);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleCanvasClick(e);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />

                    {/* Expand button */}
                    <div className="absolute top-2 right-2 p-1">
                      <button
                        onClick={openExpandModal}
                        className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 flex items-center justify-center w-8 h-8"
                      >
                        <div className="relative group">
                          <AiOutlineExpand size={20} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Expand View
                          </span>
                        </div>
                      </button>
                    </div>

                    {loadingInpenting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md z-20">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <AiOutlineCloudUpload className="h-12 w-12 dark:text-gray-500 text-indigo-600" />
                    <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">
                      Click to upload Image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {/* Polyline buttons */}
              {selectedTool === "polyline" &&
                currentPolylinePath.length > 0 && (
                  <div className="mt-2 flex justify-center space-x-2">
                    {currentPolylinePath.length >= 3 && (
                      <button
                        onClick={completePolyline}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={clearCurrentPolyline}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Clear
                    </button>
                  </div>
                )}
            </div>

            {/* Processed Mask Image */}
            {(maskImage || clientSideMask) && (
              <div className="relative">
                <div className="flex flex-col items-center justify-center p-4 border rounded-md dark:border-gray-500 dark:bg-neutral-800 border-indigo-300 bg-gray-100 min-h-[200px]">
                  <div className="relative">
                    <img
                      src={clientSideMask || `${BACKEND_URL}/${maskImage}`}
                      alt="Mask"
                      className="max-h-96 w-auto object-contain rounded-md"
                    />

                    {/* Expand button - positioned exactly like the original image */}
                    <div className="absolute top-2 right-2 p-1">
                      <button
                        onClick={openMaskExpandModal}
                        className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 flex items-center justify-center w-8 h-8"
                      >
                        <div className="relative group">
                          <AiOutlineExpand size={20} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Expand View
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color Channel Selection - Only show when image is uploaded and is color */}
          {(uploadedImage || originalImageDataURL) && isColorImage && (
            <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-neutral-900/30 dark:to-neutral-900/30 border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-all duration-300 hover:shadow-md">
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

          <button
            onClick={handleInpaintingGenerate}
            disabled={loading || !isMaskGenerated || !inputPrompt}
            className={`w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-200 ${
              loading || !isMaskGenerated || !inputPrompt
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Composing...
              </>
            ) : (
              <>
                <SiCoronarenderer className="h-4 w-4 mx-2" />
                Compose Images
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expand View Modal */}
      <Modal
        isOpen={showExpandModal}
        onRequestClose={closeExpandModal}
        className="bg-neutral-900 w-3/4 mx-auto mt-5 h-[95vh]"
        overlayClassName="modal-overlay"
      >
        <div className="relative flex flex-col items-center max-h-[94vh]">
          <div className="flex border-b w-full my-2 ">
            <h2 className="text-lg mx-auto text-gray-300 font-bold mb-2 dark:text-white">
              Expand View - Draw ROI (Right-click and drag to pan)
            </h2>

            {/* Polyline buttons */}
            {selectedTool === "polyline" && currentPolylinePath.length > 0 && (
              <div className="absolute left-4 flex gap-2">
                {currentPolylinePath.length >= 3 && (
                  <button
                    onClick={completePolyline}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={clearCurrentPolyline}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Clear
                </button>
              </div>
            )}

            <button
              onClick={closeExpandModal}
              className="absolute right-2 text-gray-300 hover:text-white font-extrabold text-xl hover:rotate-45 transition-transform duration-200"
            >
              ✕
            </button>
          </div>

          <div
            className="relative border-2 border-blue-400 rounded-lg overflow-hidden"
            onWheel={handleModalWheel}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="relative">
              <img
                ref={modalImgRef}
                src={processedImageDataURL || uploadedImage}
                alt="Expanded view"
                className="max-h-[85vh] max-w-full object-contain transition-transform duration-200"
                onLoad={initModalCanvas}
                style={{
                  transform: `translate(${modalPosition.x}px, ${modalPosition.y}px) scale(${modalScale})`,
                  cursor: isPanning ? "grabbing" : "default",
                }}
                onMouseDown={handleModalMouseDown}
                onMouseMove={handleModalMouseMove}
                onMouseUp={(e) => {
                  handleModalMouseUp();
                  e.stopPropagation();
                }}
                onMouseLeave={handleModalMouseUp}
                draggable={false}
              />
              <canvas
                ref={modalCanvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  transform: `translate(${modalPosition.x}px, ${modalPosition.y}px) scale(${modalScale})`,
                  transformOrigin: "center center",
                  cursor: isPanning ? "grabbing" : "crosshair",
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleModalMouseDown(e);
                }}
                onMouseMove={(e) => {
                  e.stopPropagation();
                  handleModalMouseMove(e);
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleModalMouseUp();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  handleModalMouseUp();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleModalCanvasClick(e);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-neutral-800 p-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-10">
              <button
                onClick={() => setModalScale((prev) => Math.min(prev * 1.2, 5))}
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
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setModalScale((prev) => Math.max(prev * 0.8, 0.1))
                }
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
                  />
                </svg>
              </button>
              <button
                onClick={resetModalView}
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
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Mask Expand View Modal */}
      <Modal
        isOpen={showMaskExpandModal}
        onRequestClose={closeMaskExpandModal}
        className="bg-neutral-900 w-3/4 mx-auto mt-5 h-[95vh]"
        overlayClassName="modal-overlay"
      >
        <div className="relative flex flex-col items-center max-h-[94vh]">
          <div className="flex border-b w-full my-2 ">
            <h2 className="text-lg mx-auto text-gray-300 font-bold mb-2 dark:text-white">
              Mask Expand View (Left-click and drag to pan)
            </h2>

            <button
              onClick={closeMaskExpandModal}
              className="absolute right-2 text-gray-300 hover:text-white font-extrabold text-xl hover:rotate-45 transition-transform duration-200"
            >
              ✕
            </button>
          </div>

          <div
            className="relative border-2 border-blue-400 rounded-lg overflow-hidden"
            onWheel={handleMaskModalWheel}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="relative">
              <img
                src={clientSideMask || `${BACKEND_URL}/${maskImage}`}
                alt="Mask expanded view"
                className="max-h-[85vh] max-w-full object-contain transition-transform duration-200"
                style={{
                  transform: `translate(${maskModalPosition.x}px, ${maskModalPosition.y}px) scale(${maskModalScale})`,
                  cursor: isMaskPanning ? "grabbing" : "grab",
                }}
                onMouseDown={handleMaskModalMouseDown}
                onMouseMove={handleMaskModalMouseMove}
                onMouseUp={handleMaskModalMouseUp}
                onMouseLeave={handleMaskModalMouseUp}
                draggable={false}
              />
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-neutral-800 p-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-10">
              <button
                onClick={() =>
                  setMaskModalScale((prev) => Math.min(prev * 1.2, 5))
                }
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
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setMaskModalScale((prev) => Math.max(prev * 0.8, 0.1))
                }
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
                  />
                </svg>
              </button>
              <button
                onClick={resetMaskModalView}
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
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BoundingBoxDraw;
