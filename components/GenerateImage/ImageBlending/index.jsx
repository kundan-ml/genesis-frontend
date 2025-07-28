import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineExpand } from "react-icons/ai";
import { MdOutlineRectangle } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { SiCoronarenderer } from "react-icons/si";
import axios from "axios";
import Modal from "react-modal";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ImageBlending = ({
  setErrorMessage,
  setShowAlert,
  profile,
  uploadedImage1,
  setUploadedImage1,
  uploadedImage2,
  setUploadedImage2,
  image1File,
  setImage1File,
  image2File,
  setImage2File,
  type,
  isDefault,
  setIsDefault,
  isPdfLoading,
  isPdf,
  loadPdf,
  totalPages,
  currentPage,
  handlePageChange,
  originalImage2DataURL,
  setOriginalImage2DataURL,
  processedImage2File,
  setProcessedImage2File,
  checkIfColorImage,
  convertToGrayscale,
  isColorImage2,
  setIsColorImage2,
  selectedChannel,
  setSelectedChannel,
  roi1,
  roi2,
  setRoi1,
  setRoi2,
}) => {
  // State variables
  const [isBlending, setIsBlending] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentImage, setCurrentImage] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedForROI, setExpandedForROI] = useState(null);
  const [tempRoi, setTempRoi] = useState({ roi1: null, roi2: null });
  const [modalRoi, setModalRoi] = useState(null);
  const [modalStartPos, setModalStartPos] = useState({ x: 0, y: 0 });
  const [isModalDrawing, setIsModalDrawing] = useState(false);
  const [image1Dimensions, setImage1Dimensions] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
  });
  const [image2Dimensions, setImage2Dimensions] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
  });
  const [blendedResult, setBlendedResult] = useState(null);
  const [bright_field, set_bright_field] = useState("");
  const [dark_field, set_dark_field] = useState("");
  const [phase_contrast, set_phase_contrast] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [image2_gray, setImage2_gray] = useState("");

  // NEW STATE VARIABLES FOR IMAGE 1 COLOR HANDLING
  const [isColorImage1, setIsColorImage1] = useState(false);
  const [selectedChannel1, setSelectedChannel1] = useState("rgb");
  const [originalImage1DataURL, setOriginalImage1DataURL] = useState("");
  const [processedImage1File, setProcessedImage1File] = useState(null);
  const [image1_gray, setImage1_gray] = useState("");

  // NEW STATE FOR COLOR OUTPUT OPTION
  const [outputColor, setOutputColor] = useState(false);
  const [colorBlendedResult, setColorBlendedResult] = useState(null);

  // Add these to your existing state variables
  const [generatedMask, setGeneratedMask] = useState(null);
  const [roiPreview, setRoiPreview] = useState(null);

  const [drawingTool, setDrawingTool] = useState("rectangle");
  const [useSAM, setUseSAM] = useState(false);

  // NEW STATE VARIABLES FOR FREEHAND DRAWING
  const [freehandPath1, setFreehandPath1] = useState([]);
  const [freehandPath2, setFreehandPath2] = useState([]);
  const [modalFreehandPath, setModalFreehandPath] = useState([]);
  const [freehandMask1, setFreehandMask1] = useState(null);
  const [freehandMask2, setFreehandMask2] = useState(null);

  // Add these new state variables to your existing state section
  const [polylinePath1, setPolylinePath1] = useState([]);
  const [polylinePath2, setPolylinePath2] = useState([]);
  const [modalPolylinePath, setModalPolylinePath] = useState([]);
  const [polylineMask1, setPolylineMask1] = useState(null);
  const [polylineMask2, setPolylineMask2] = useState(null);
  const [isPolylineComplete1, setIsPolylineComplete1] = useState(false);
  const [isPolylineComplete2, setIsPolylineComplete2] = useState(false);
  const [modalPolylineComplete, setModalPolylineComplete] = useState(false);

  // Add these zoom/pan state variables with your existing state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Add these new state variables with your existing state (around line 50):
  const [modalScale, setModalScale] = useState(1);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isModalDragging, setIsModalDragging] = useState(false);
  const [modalDragStart, setModalDragStart] = useState({ x: 0, y: 0 });

  // Add these new state variables with your existing state (around line 50):
  const [isDraggingRect, setIsDraggingRect] = useState(false);
  const [isResizingRect, setIsResizingRect] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'move', 'resize-se', 'resize-nw', etc.
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [originalRect, setOriginalRect] = useState(null);

  // Add these new state variables (add to your existing state section around line 50)
  const [modalIsDraggingRect, setModalIsDraggingRect] = useState(false);
  const [modalIsResizingRect, setModalIsResizingRect] = useState(false);
  const [modalDragMode, setModalDragMode] = useState(null);
  const [modalDragStartPos, setModalDragStartPos] = useState({ x: 0, y: 0 });
  const [modalOriginalRect, setModalOriginalRect] = useState(null);

  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const imgRef1 = useRef(null);
  const imgRef2 = useRef(null);
  const modalCanvasRef = useRef(null);
  const modalImgRef = useRef(null);
  const BACKEND_URL = process.env.BACKEND_URL;

  // NEW STATE FOR COLOR OUTPUT
  const [isGeneratingColor, setIsGeneratingColor] = useState(false);
  // Handle image upload
  const handleImageUpload = (e, isSecondImage = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isSecondImage && file.type === "application/pdf") {
      loadPdf(file);
      setImage2File(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataURL = event.target.result;
      if (isSecondImage) {
        setOriginalImage2DataURL(dataURL);
        const isColor = await checkIfColorImage(dataURL);
        setIsColorImage2(isColor);
        setSelectedChannel("rgb");
        setRoi2(null);
        setFreehandPath2([]); // Clear freehand path
        setFreehandMask2(null); // Clear freehand mask
        if (!isColor) {
          setUploadedImage2(dataURL);
          setProcessedImage2File(file);
        } else {
          setUploadedImage2(dataURL);
        }
      } else {
        setOriginalImage1DataURL(dataURL);
        const isColor = await checkIfColorImage(dataURL);
        setIsColorImage1(isColor);
        setSelectedChannel1("rgb");
        setRoi1(null);
        setFreehandPath1([]); // Clear freehand path
        setFreehandMask1(null); // Clear freehand mask
        if (!isColor) {
          setUploadedImage1(dataURL);
          setProcessedImage1File(file);
        } else {
          setUploadedImage1(dataURL);
        }
      }
    };
    reader.readAsDataURL(file);

    if (isSecondImage) {
      setImage2File(file);
    } else {
      setImage1File(file);
    }

    e.target.value = null;
  };

  useEffect(() => {
    if (uploadedImage1) {
      const handleExternalImage1Update = async () => {
        setOriginalImage1DataURL(uploadedImage1);
        const isColor = await checkIfColorImage(uploadedImage1);
        setIsColorImage1(isColor);
        setSelectedChannel1("rgb");
        setRoi1(null);
        setFreehandPath1([]);
        setFreehandMask1(null);
        if (!isColor) {
          setProcessedImage1File(image1File);
        }
      };
      handleExternalImage1Update();
    }
  }, [uploadedImage1, image1File]);

  useEffect(() => {
    if (uploadedImage2) {
      const handleExternalImage2Update = async () => {
        setOriginalImage2DataURL(uploadedImage2);
        const isColor = await checkIfColorImage(uploadedImage2);
        setIsColorImage2(isColor);
        setSelectedChannel("rgb");
        setRoi2(null);
        setFreehandPath2([]);
        setFreehandMask2(null);
        if (!isColor) {
          setProcessedImage2File(image2File);
        }
      };
      handleExternalImage2Update();
    }
  }, [uploadedImage2, image2File]);

  // NEW: FUNCTION TO CREATE COLOR IMAGE FROM CHANNELS
  const createColorImage = async () => {
    if (!blendedResult || !originalImage1DataURL || !selectedChannel1) return;

    setIsGeneratingColor(true);

    try {
      // Load images
      const [originalImg, blendedImg] = await Promise.all([
        loadImage(originalImage1DataURL),
        loadImage(`${BACKEND_URL}/${blendedResult}`),
      ]);

      // Create canvas for processing
      const canvas = document.createElement("canvas");
      canvas.width = originalImg.width;
      canvas.height = originalImg.height;
      const ctx = canvas.getContext("2d");

      // Get original image data
      ctx.drawImage(originalImg, 0, 0);
      const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Get blended image data
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(blendedImg, 0, 0);
      const blendedData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Create new image data by combining channels
      const newData = new ImageData(canvas.width, canvas.height);

      for (let i = 0; i < originalData.data.length; i += 4) {
        const r = originalData.data[i];
        const g = originalData.data[i + 1];
        const b = originalData.data[i + 2];

        // Get the processed channel value from the blended image
        const processedValue = blendedData.data[i];

        // Replace only the selected channel
        if (selectedChannel1 === "red") {
          newData.data[i] = processedValue; // Use processed red channel
          newData.data[i + 1] = g; // Original green
          newData.data[i + 2] = b; // Original blue
        } else if (selectedChannel1 === "green") {
          newData.data[i] = r; // Original red
          newData.data[i + 1] = processedValue; // Use processed green channel
          newData.data[i + 2] = b; // Original blue
        } else if (selectedChannel1 === "blue") {
          newData.data[i] = r; // Original red
          newData.data[i + 1] = g; // Original green
          newData.data[i + 2] = processedValue; // Use processed blue channel
        } else {
          // For RGB, use the grayscale value for all channels
          newData.data[i] = processedValue;
          newData.data[i + 1] = processedValue;
          newData.data[i + 2] = processedValue;
        }
        newData.data[i + 3] = 255; // Alpha channel
      }

      // Draw the new image data
      ctx.putImageData(newData, 0, 0);

      // Convert to data URL
      const colorDataURL = canvas.toDataURL("image/png");
      setColorBlendedResult(colorDataURL);
    } catch (error) {
      console.error("Error creating color image:", error);
      setErrorMessage("Failed to generate color image");
      setShowAlert(true);
    } finally {
      setIsGeneratingColor(false);
    }
  };

  // Helper to load images
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };
  // NEW: Effect for Image 1 color conversion
  useEffect(() => {
    if (isColorImage1 && selectedChannel1 && originalImage1DataURL) {
      convertToGrayscale(originalImage1DataURL, selectedChannel1).then(
        ({ dataURL, file }) => {
          setImage1_gray(dataURL);
          setProcessedImage1File(file);
          setRoi1(null);
          setFreehandPath1([]);
          setFreehandMask1(null);
        }
      );
    }
  }, [isColorImage1, selectedChannel1, originalImage1DataURL]);

  useEffect(() => {
    if (uploadedImage2) {
      const handleExternalImageUpdate = async () => {
        setOriginalImage2DataURL(uploadedImage2);
        const isColor = await checkIfColorImage(uploadedImage2);
        setIsColorImage2(isColor);
        setSelectedChannel("rgb");
        setRoi2(null);
        setFreehandPath2([]);
        setFreehandMask2(null);
        if (!isColor) {
          setProcessedImage2File(image2File);
        } else {
          setUploadedImage2(uploadedImage2);
        }
      };
      handleExternalImageUpdate();
    }
  }, [uploadedImage2, image2File]);

  useEffect(() => {
    if (isColorImage2 && selectedChannel && originalImage2DataURL) {
      convertToGrayscale(originalImage2DataURL, selectedChannel).then(
        ({ dataURL, file }) => {
          setImage2_gray(dataURL);
          setIsDefault(dataURL);
          setProcessedImage2File(file);
          setRoi2(null);
          setFreehandPath2([]);
          setFreehandMask2(null);
        }
      );
    }
  }, [isColorImage2, selectedChannel, originalImage2DataURL]);

  useEffect(() => {
    setImage2_gray("");
    setIsDefault(uploadedImage2);
  }, [setUploadedImage2]);

  // Initialize canvas with ROI
  const initCanvas = (imgRef, canvasRef, imageNum) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (img && canvas) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      // Store natural dimensions
      if (imageNum === 1) {
        setImage1Dimensions({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
        });
      } else if (imageNum === 2) {
        setImage2Dimensions({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
        });
      }

      // Draw existing ROI if available
      const roi = imageNum === 1 ? roi1 : roi2;
      const freehandPath = imageNum === 1 ? freehandPath1 : freehandPath2;
      const polylinePath = imageNum === 1 ? polylinePath1 : polylinePath2;
      const isPolylineComplete =
        imageNum === 1 ? isPolylineComplete1 : isPolylineComplete2;

      if (roi && img.naturalWidth > 0 && drawingTool === "rectangle") {
        const scaleX = img.offsetWidth / img.naturalWidth;
        const scaleY = img.offsetHeight / img.naturalHeight;

        const displayRoi = {
          x: roi.x * scaleX,
          y: roi.y * scaleY,
          width: roi.width * scaleX,
          height: roi.height * scaleY,
        };

        drawRoiOnCanvas(canvas, displayRoi);
      } else if (
        freehandPath.length > 0 &&
        img.naturalWidth > 0 &&
        drawingTool === "pencil"
      ) {
        drawFreehandOnCanvas(canvas, freehandPath, img);
      } else if (
        polylinePath.length > 0 &&
        img.naturalWidth > 0 &&
        drawingTool === "polyline"
      ) {
        drawPolylineOnCanvas(
          canvas,
          polylinePath,
          img,
          "#ff0000",
          isPolylineComplete
        );
      }
    }
  };

  // Helper function to draw ROI on canvas
  const drawRoiOnCanvas = (canvas, roi, color = "#ff0000") => {
    if (!canvas || !roi) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Round dimensions to integers
    const roundedRoi = {
      x: Math.round(roi.x),
      y: Math.round(roi.y),
      width: Math.round(roi.width),
      height: Math.round(roi.height),
    };

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      roundedRoi.x,
      roundedRoi.y,
      roundedRoi.width,
      roundedRoi.height
    );

    ctx.fillStyle = color;
    const fontSize = canvas.width > 500 ? "16px" : "12px";
    ctx.font = `${fontSize} Arial`;

    // Display rounded dimensions
    ctx.fillText(
      `${roundedRoi.width}x${roundedRoi.height}`,
      roundedRoi.x + roundedRoi.width / 2 - 30,
      roundedRoi.y + roundedRoi.height / 2
    );
  };

  // NEW: Helper function to draw freehand path on canvas
  const drawFreehandOnCanvas = (canvas, path, img, color = "#ff0000") => {
    if (!canvas || !path || path.length === 0) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Scale the path from natural coordinates to display coordinates
    const scaleX = canvas.width / img.naturalWidth;
    const scaleY = canvas.height / img.naturalHeight;

    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const displayX = point.x * scaleX;
      const displayY = point.y * scaleY;

      if (i === 0) {
        ctx.moveTo(displayX, displayY);
      } else {
        ctx.lineTo(displayX, displayY);
      }
    }
    ctx.stroke();
  };

  // NEW: Generate mask from freehand path
  const generateMaskFromFreehand = (path, imgElement) => {
    if (!path || path.length === 0 || !imgElement) return null;

    const canvas = document.createElement("canvas");
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    const ctx = canvas.getContext("2d");

    // Create black background
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw white path for freehand area
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 10; // Make the line thicker for better visibility
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();

    // Fill the enclosed area if path is closed
    if (path.length > 2) {
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fill();
    }

    return canvas.toDataURL("image/png");
  };

  // Handle downloading all images as a ZIP
  const downloadAllAsZip = async () => {
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("rendered_images");

      const imagesToDownload = [];

      if (type === "multiple") {
        imagesToDownload.push(
          {
            url: `${BACKEND_URL}/${phase_contrast}`,
            name: "phase_contrast.bmp",
          },
          { url: `${BACKEND_URL}/${bright_field}`, name: "bright_field.bmp" },
          { url: `${BACKEND_URL}/${dark_field}`, name: "dark_field.bmp" },
          { url: `${BACKEND_URL}/${blendedResult}`, name: "blended_result.bmp" }
        );
      } else {
        imagesToDownload.push({
          url: `${BACKEND_URL}/${blendedResult}`,
          name: "blended_result.bmp",
        });

        // NEW: Add color result if available
        if (colorBlendedResult) {
          imagesToDownload.push({
            url: `${BACKEND_URL}/${colorBlendedResult}`,
            name: "color_result.bmp",
          });
        }
      }

      // Fetch all images and add them to the ZIP
      await Promise.all(
        imagesToDownload.map(async (image) => {
          const response = await fetch(image.url);
          const blob = await response.blob();
          imgFolder.file(image.name, blob);
        })
      );

      // Generate the ZIP file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "rendered_images.zip");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      setErrorMessage("Failed to download images as ZIP");
      setShowAlert(true);
    }
  };

  // Updated initModalCanvas function to properly show existing polylines
  const initModalCanvas = () => {
    const canvas = modalCanvasRef.current;
    const img = modalImgRef.current;
    if (img && canvas) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      // Draw existing selections based on current drawing tool and which image is expanded
      if (expandedForROI === "image1") {
        const existingRoi = tempRoi.roi1 || roi1;
        const existingFreehandPath = freehandPath1;
        const existingPolylinePath = polylinePath1;
        const isPolyComplete = isPolylineComplete1;

        if (
          drawingTool === "rectangle" &&
          existingRoi &&
          image1Dimensions.naturalWidth > 0
        ) {
          const scaleX = img.offsetWidth / image1Dimensions.naturalWidth;
          const scaleY = img.offsetHeight / image1Dimensions.naturalHeight;
          const displayRoi = {
            x: existingRoi.x * scaleX,
            y: existingRoi.y * scaleY,
            width: existingRoi.width * scaleX,
            height: existingRoi.height * scaleY,
          };
          setModalRoi(displayRoi);
          drawRoiOnCanvas(canvas, displayRoi);
        } else if (
          drawingTool === "pencil" &&
          existingFreehandPath.length > 0 &&
          image1Dimensions.naturalWidth > 0
        ) {
          drawFreehandOnCanvas(canvas, existingFreehandPath, {
            naturalWidth: image1Dimensions.naturalWidth,
            naturalHeight: image1Dimensions.naturalHeight,
          });
        } else if (
          drawingTool === "polyline" &&
          existingPolylinePath.length > 0 &&
          image1Dimensions.naturalWidth > 0
        ) {
          // Set modal polyline path from existing path
          setModalPolylinePath([...existingPolylinePath]);
          setModalPolylineComplete(isPolyComplete);
          drawPolylineOnCanvas(
            canvas,
            existingPolylinePath,
            {
              naturalWidth: image1Dimensions.naturalWidth,
              naturalHeight: image1Dimensions.naturalHeight,
            },
            "#ff0000",
            isPolyComplete
          );
        }
      } else if (expandedForROI === "image2") {
        const existingRoi = tempRoi.roi2 || roi2;
        const existingFreehandPath = freehandPath2;
        const existingPolylinePath = polylinePath2;
        const isPolyComplete = isPolylineComplete2;

        if (
          drawingTool === "rectangle" &&
          existingRoi &&
          image2Dimensions.naturalWidth > 0
        ) {
          const scaleX = img.offsetWidth / image2Dimensions.naturalWidth;
          const scaleY = img.offsetHeight / image2Dimensions.naturalHeight;
          const displayRoi = {
            x: existingRoi.x * scaleX,
            y: existingRoi.y * scaleY,
            width: existingRoi.width * scaleX,
            height: existingRoi.height * scaleY,
          };
          setModalRoi(displayRoi);
          drawRoiOnCanvas(canvas, displayRoi);
        } else if (
          drawingTool === "pencil" &&
          existingFreehandPath.length > 0 &&
          image2Dimensions.naturalWidth > 0
        ) {
          drawFreehandOnCanvas(canvas, existingFreehandPath, {
            naturalWidth: image2Dimensions.naturalWidth,
            naturalHeight: image2Dimensions.naturalHeight,
          });
        } else if (
          drawingTool === "polyline" &&
          existingPolylinePath.length > 0 &&
          image2Dimensions.naturalWidth > 0
        ) {
          // Set modal polyline path from existing path
          setModalPolylinePath([...existingPolylinePath]);
          setModalPolylineComplete(isPolyComplete);
          drawPolylineOnCanvas(
            canvas,
            existingPolylinePath,
            {
              naturalWidth: image2Dimensions.naturalWidth,
              naturalHeight: image2Dimensions.naturalHeight,
            },
            "#ff0000",
            isPolyComplete
          );
        }
      }
    }
  };

  // Update the startDrawingRect function to handle existing rectangles:
  const startDrawingRect = (e, canvasRef, setRoi, imageNum) => {
    e.stopPropagation();
    e.preventDefault();
    if (!uploadedImage1 || !uploadedImage2 || drawingTool !== "rectangle")
      return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const existingRoi = imageNum === 1 ? roi1 : roi2;
    const img = imageNum === 1 ? imgRef1.current : imgRef2.current;

    // Check if clicking on existing rectangle
    if (existingRoi) {
      const interaction = detectRectInteraction(x, y, existingRoi, img);

      if (interaction) {
        // Set up drag/resize mode
        setDragMode(interaction);
        setIsDraggingRect(interaction === "move");
        setIsResizingRect(interaction.startsWith("resize"));
        setDragStartPos({ x, y });
        setOriginalRect({ ...existingRoi });
        setCurrentImage(imageNum);

        // Change cursor based on interaction
        if (interaction === "move") {
          canvas.style.cursor = "move";
        } else if (interaction.includes("resize")) {
          canvas.style.cursor =
            interaction.includes("se") || interaction.includes("nw")
              ? "nw-resize"
              : "ne-resize";
        }
        return;
      }
    }

    // Start drawing new rectangle (existing code)
    setStartPos({ x, y });
    setIsDrawing(true);
    setCurrentImage(imageNum);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleModalMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const canvas = modalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingTool === "rectangle") {
      // Check if clicking on existing rectangle first
      if (modalRoi) {
        const interaction = detectModalRectInteraction(x, y, modalRoi);

        if (interaction) {
          // Set up drag/resize mode for modal
          setModalDragMode(interaction);
          setModalIsDraggingRect(interaction === "move");
          setModalIsResizingRect(interaction.startsWith("resize"));
          setModalDragStartPos({ x, y });
          setModalOriginalRect({ ...modalRoi });

          // Change cursor based on interaction
          if (interaction === "move") {
            canvas.style.cursor = "move";
          } else if (interaction.includes("resize")) {
            canvas.style.cursor =
              interaction.includes("se") || interaction.includes("nw")
                ? "nw-resize"
                : "ne-resize";
          }
          return;
        }
      }

      // Start drawing new rectangle
      setModalStartPos({ x, y });
      setIsModalDrawing(true);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (drawingTool === "pencil") {
      // Get natural coordinates for freehand
      const img = modalImgRef.current;
      const imgDimensions =
        expandedForROI === "image1" ? image1Dimensions : image2Dimensions;
      const scaleX = imgDimensions.naturalWidth / img.offsetWidth;
      const scaleY = imgDimensions.naturalHeight / img.offsetHeight;

      const naturalX = x * scaleX;
      const naturalY = y * scaleY;

      setIsModalDrawing(true);
      setModalFreehandPath([{ x: naturalX, y: naturalY }]);

      // Clear canvas and start drawing
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleModalMouseMove = (e) => {
    if (!isModalDrawing && !modalIsDraggingRect && !modalIsResizingRect) {
      // Handle cursor changes for existing rectangles
      if (drawingTool === "rectangle" && modalRoi) {
        const canvas = modalCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const interaction = detectModalRectInteraction(x, y, modalRoi);

        if (interaction === "move") {
          canvas.style.cursor = "move";
        } else if (interaction === "resize-se" || interaction === "resize-nw") {
          canvas.style.cursor = "nw-resize";
        } else if (interaction === "resize-ne" || interaction === "resize-sw") {
          canvas.style.cursor = "ne-resize";
        } else {
          canvas.style.cursor = "crosshair";
        }
      }
      return;
    }

    e.preventDefault();
    const canvas = modalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");

    // Handle drag/resize of existing rectangle
    if ((modalIsDraggingRect || modalIsResizingRect) && modalOriginalRect) {
      const deltaX = mouseX - modalDragStartPos.x;
      const deltaY = mouseY - modalDragStartPos.y;

      let newRoi = { ...modalOriginalRect };

      if (modalDragMode === "move") {
        // Move the rectangle
        newRoi.x = Math.max(
          0,
          Math.min(canvas.width - newRoi.width, modalOriginalRect.x + deltaX)
        );
        newRoi.y = Math.max(
          0,
          Math.min(canvas.height - newRoi.height, modalOriginalRect.y + deltaY)
        );
      } else if (modalDragMode.startsWith("resize")) {
        // Resize the rectangle
        if (modalDragMode === "resize-se") {
          newRoi.width = Math.max(10, modalOriginalRect.width + deltaX);
          newRoi.height = Math.max(10, modalOriginalRect.height + deltaY);
        } else if (modalDragMode === "resize-nw") {
          const newWidth = Math.max(10, modalOriginalRect.width - deltaX);
          const newHeight = Math.max(10, modalOriginalRect.height - deltaY);
          newRoi.x = modalOriginalRect.x + modalOriginalRect.width - newWidth;
          newRoi.y = modalOriginalRect.y + modalOriginalRect.height - newHeight;
          newRoi.width = newWidth;
          newRoi.height = newHeight;
        } else if (modalDragMode === "resize-ne") {
          const newHeight = Math.max(10, modalOriginalRect.height - deltaY);
          newRoi.y = modalOriginalRect.y + modalOriginalRect.height - newHeight;
          newRoi.width = Math.max(10, modalOriginalRect.width + deltaX);
          newRoi.height = newHeight;
        } else if (modalDragMode === "resize-sw") {
          const newWidth = Math.max(10, modalOriginalRect.width - deltaX);
          newRoi.x = modalOriginalRect.x + modalOriginalRect.width - newWidth;
          newRoi.width = newWidth;
          newRoi.height = Math.max(10, modalOriginalRect.height + deltaY);
        }

        // Keep within canvas bounds
        newRoi.x = Math.max(0, newRoi.x);
        newRoi.y = Math.max(0, newRoi.y);
        newRoi.width = Math.min(canvas.width - newRoi.x, newRoi.width);
        newRoi.height = Math.min(canvas.height - newRoi.y, newRoi.height);
      }

      // Update the modal ROI and redraw
      setModalRoi(newRoi);
      drawRoiOnCanvas(canvas, newRoi, "#00ff00");
      return;
    }

    if (drawingTool === "rectangle" && isModalDrawing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        modalStartPos.x,
        modalStartPos.y,
        mouseX - modalStartPos.x,
        mouseY - modalStartPos.y
      );

      const width = Math.abs(mouseX - modalStartPos.x);
      const height = Math.abs(mouseY - modalStartPos.y);
      ctx.fillStyle = "#00ff00";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${width}x${height}`,
        modalStartPos.x + width / 2 - 30,
        modalStartPos.y + height / 2
      );
    } else if (drawingTool === "pencil") {
      // Get natural coordinates for freehand
      const img = modalImgRef.current;
      const imgDimensions =
        expandedForROI === "image1" ? image1Dimensions : image2Dimensions;
      const scaleX = imgDimensions.naturalWidth / img.offsetWidth;
      const scaleY = imgDimensions.naturalHeight / img.offsetHeight;

      const naturalX = mouseX * scaleX;
      const naturalY = mouseY * scaleY;

      // Add point to path
      setModalFreehandPath((prev) => [...prev, { x: naturalX, y: naturalY }]);

      // Draw on canvas
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  };

  const handleModalMouseUp = (e) => {
    if (!isModalDrawing && !modalIsDraggingRect && !modalIsResizingRect) return;

    e.preventDefault();
    const canvas = modalCanvasRef.current;

    // Reset drag/resize state
    if (modalIsDraggingRect || modalIsResizingRect) {
      setModalIsDraggingRect(false);
      setModalIsResizingRect(false);
      setModalDragMode(null);
      setModalOriginalRect(null);
      canvas.style.cursor = "crosshair";
      return;
    }
    if (!isModalDrawing) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (drawingTool === "rectangle") {
      const x = Math.min(modalStartPos.x, endX);
      const y = Math.min(modalStartPos.y, endY);
      const width = Math.abs(endX - modalStartPos.x);
      const height = Math.abs(endY - modalStartPos.y);

      if (width > 2 && height > 2) {
        const roi = { x, y, width, height };
        setModalRoi(roi);

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = "#ff0000";
        ctx.font = "16px Arial";
        ctx.fillText(`${width}x${height}`, x + width / 2 - 30, y + height / 2);
      }
    } else if (drawingTool === "pencil") {
      // Generate mask for modal freehand path
      const img = modalImgRef.current;
      const imgDimensions =
        expandedForROI === "image1" ? image1Dimensions : image2Dimensions;

      if (modalFreehandPath.length > 1) {
        const tempImg = {
          naturalWidth: imgDimensions.naturalWidth,
          naturalHeight: imgDimensions.naturalHeight,
        };
        const maskDataURL = generateMaskFromFreehand(
          modalFreehandPath,
          tempImg
        );

        // Store the mask for preview
        setGeneratedMask(maskDataURL);
      }
    }

    setIsModalDrawing(false);
  };

  // Add this new helper function
  const detectModalRectInteraction = (mouseX, mouseY, roi) => {
    if (!roi) return null;

    const handleSize = 8;

    // Check corners for resize handles
    if (
      Math.abs(mouseX - (roi.x + roi.width)) < handleSize &&
      Math.abs(mouseY - (roi.y + roi.height)) < handleSize
    ) {
      return "resize-se";
    }
    if (
      Math.abs(mouseX - roi.x) < handleSize &&
      Math.abs(mouseY - roi.y) < handleSize
    ) {
      return "resize-nw";
    }
    if (
      Math.abs(mouseX - (roi.x + roi.width)) < handleSize &&
      Math.abs(mouseY - roi.y) < handleSize
    ) {
      return "resize-ne";
    }
    if (
      Math.abs(mouseX - roi.x) < handleSize &&
      Math.abs(mouseY - (roi.y + roi.height)) < handleSize
    ) {
      return "resize-sw";
    }

    // Check if inside rectangle for moving
    if (
      mouseX >= roi.x &&
      mouseX <= roi.x + roi.width &&
      mouseY >= roi.y &&
      mouseY <= roi.y + roi.height
    ) {
      return "move";
    }

    return null;
  };

  // Save ROI from modal
  const saveModalROI = () => {
    if (drawingTool === "rectangle" && modalRoi) {
      const img = modalImgRef.current;
      const imgDimensions =
        expandedForROI === "image1" ? image1Dimensions : image2Dimensions;

      if (img && imgDimensions.naturalWidth > 0) {
        // Convert modal ROI to natural dimensions
        const scaleX = imgDimensions.naturalWidth / img.offsetWidth;
        const scaleY = imgDimensions.naturalHeight / img.offsetHeight;

        const naturalRoi = {
          x: Math.round(modalRoi.x * scaleX),
          y: Math.round(modalRoi.y * scaleY),
          width: Math.round(modalRoi.width * scaleX),
          height: Math.round(modalRoi.height * scaleY),
        };

        if (expandedForROI === "image1") {
          setRoi1(naturalRoi);
          setTempRoi({ ...tempRoi, roi1: naturalRoi });
          setFreehandPath1([]);
          setFreehandMask1(null);
          setPolylinePath1([]);
          setPolylineMask1(null);
          setIsPolylineComplete1(false);

          // Update main canvas immediately with proper scaling
          setTimeout(() => {
            if (canvasRef1.current && imgRef1.current) {
              const mainImg = imgRef1.current;
              const mainScaleX =
                mainImg.offsetWidth / imgDimensions.naturalWidth;
              const mainScaleY =
                mainImg.offsetHeight / imgDimensions.naturalHeight;

              const displayRoi = {
                x: naturalRoi.x * mainScaleX,
                y: naturalRoi.y * mainScaleY,
                width: naturalRoi.width * mainScaleX,
                height: naturalRoi.height * mainScaleY,
              };

              drawRoiOnCanvas(canvasRef1.current, displayRoi);
            }
          }, 100);
        } else {
          setRoi2(naturalRoi);
          setTempRoi({ ...tempRoi, roi2: naturalRoi });
          setFreehandPath2([]);
          setFreehandMask2(null);
          setPolylinePath2([]);
          setPolylineMask2(null);
          setIsPolylineComplete2(false);

          // Update main canvas immediately with proper scaling
          setTimeout(() => {
            if (canvasRef2.current && imgRef2.current) {
              const mainImg = imgRef2.current;
              const mainScaleX =
                mainImg.offsetWidth / imgDimensions.naturalWidth;
              const mainScaleY =
                mainImg.offsetHeight / imgDimensions.naturalHeight;

              const displayRoi = {
                x: naturalRoi.x * mainScaleX,
                y: naturalRoi.y * mainScaleY,
                width: naturalRoi.width * mainScaleX,
                height: naturalRoi.height * mainScaleY,
              };

              drawRoiOnCanvas(canvasRef2.current, displayRoi);
            }
          }, 100);
        }
      }
    } else if (drawingTool === "pencil" && modalFreehandPath.length > 1) {
      // Save freehand path from modal
      if (expandedForROI === "image1") {
        setFreehandPath1([...modalFreehandPath]);
        setRoi1(null);

        // Generate and set mask
        const img = imgRef1.current;
        if (img) {
          const maskDataURL = generateMaskFromFreehand(modalFreehandPath, img);
          setFreehandMask1(maskDataURL);
        }

        // Update main canvas immediately
        if (canvasRef1.current && imgRef1.current) {
          drawFreehandOnCanvas(
            canvasRef1.current,
            modalFreehandPath,
            imgRef1.current
          );
        }
      } else {
        setFreehandPath2([...modalFreehandPath]);
        setRoi2(null);

        // Generate and set mask
        const img = imgRef2.current;
        if (img) {
          const maskDataURL = generateMaskFromFreehand(modalFreehandPath, img);
          setFreehandMask2(maskDataURL);
        }

        // Update main canvas immediately
        if (canvasRef2.current && imgRef2.current) {
          drawFreehandOnCanvas(
            canvasRef2.current,
            modalFreehandPath,
            imgRef2.current
          );
        }
      }
    } else if (drawingTool === "polyline" && modalPolylinePath.length > 2) {
      // Save polyline path from modal
      if (expandedForROI === "image1") {
        setPolylinePath1([...modalPolylinePath]);
        setIsPolylineComplete1(modalPolylineComplete);
        setRoi1(null);
        setFreehandPath1([]);
        setFreehandMask1(null);

        // Generate and set mask
        const img = imgRef1.current;
        if (img && modalPolylineComplete) {
          const maskDataURL = generateMaskFromPolyline(modalPolylinePath, img);
          setPolylineMask1(maskDataURL);
        }

        // Update main canvas immediately
        if (canvasRef1.current && imgRef1.current) {
          drawPolylineOnCanvas(
            canvasRef1.current,
            modalPolylinePath,
            imgRef1.current,
            "#ff0000",
            modalPolylineComplete
          );
        }
      } else {
        setPolylinePath2([...modalPolylinePath]);
        setIsPolylineComplete2(modalPolylineComplete);
        setRoi2(null);
        setFreehandPath2([]);
        setFreehandMask2(null);

        // Generate and set mask
        const img = imgRef2.current;
        if (img && modalPolylineComplete) {
          const maskDataURL = generateMaskFromPolyline(modalPolylinePath, img);
          setPolylineMask2(maskDataURL);
        }

        // Update main canvas immediately
        if (canvasRef2.current && imgRef2.current) {
          drawPolylineOnCanvas(
            canvasRef2.current,
            modalPolylinePath,
            imgRef2.current,
            "#ff0000",
            modalPolylineComplete
          );
        }
      }
    }

    // Clear modal state
    setModalRoi(null);
    setModalFreehandPath([]);
    setModalPolylinePath([]);
    setModalPolylineComplete(false);
    setGeneratedMask(null);

    // Reset modal drag states
    setModalIsDraggingRect(false);
    setModalIsResizingRect(false);
    setModalDragMode(null);
    setModalOriginalRect(null);

    setExpandedForROI(null);
  };

  // Update the drawRect function to handle drag/resize:
  const drawRect = (e, canvasRef) => {
    if (drawingTool !== "rectangle") return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Handle drag/resize of existing rectangle
    if (
      (isDraggingRect || isResizingRect) &&
      originalRect &&
      currentImage !== null
    ) {
      const img = currentImage === 1 ? imgRef1.current : imgRef2.current;
      const setRoi = currentImage === 1 ? setRoi1 : setRoi2;

      const scaleX = img.naturalWidth / img.offsetWidth;
      const scaleY = img.naturalHeight / img.offsetHeight;

      const deltaX = mouseX - dragStartPos.x;
      const deltaY = mouseY - dragStartPos.y;

      let newRoi = { ...originalRect };

      if (dragMode === "move") {
        // Move the rectangle
        const displayDeltaX = deltaX * scaleX;
        const displayDeltaY = deltaY * scaleY;

        newRoi.x = Math.max(
          0,
          Math.min(
            img.naturalWidth - newRoi.width,
            originalRect.x + displayDeltaX
          )
        );
        newRoi.y = Math.max(
          0,
          Math.min(
            img.naturalHeight - newRoi.height,
            originalRect.y + displayDeltaY
          )
        );
      } else if (dragMode.startsWith("resize")) {
        // Resize the rectangle
        const displayDeltaX = deltaX * scaleX;
        const displayDeltaY = deltaY * scaleY;

        if (dragMode === "resize-se") {
          newRoi.width = Math.max(10, originalRect.width + displayDeltaX);
          newRoi.height = Math.max(10, originalRect.height + displayDeltaY);
        } else if (dragMode === "resize-nw") {
          const newWidth = Math.max(10, originalRect.width - displayDeltaX);
          const newHeight = Math.max(10, originalRect.height - displayDeltaY);
          newRoi.x = originalRect.x + originalRect.width - newWidth;
          newRoi.y = originalRect.y + originalRect.height - newHeight;
          newRoi.width = newWidth;
          newRoi.height = newHeight;
        } else if (dragMode === "resize-ne") {
          const newHeight = Math.max(10, originalRect.height - displayDeltaY);
          newRoi.y = originalRect.y + originalRect.height - newHeight;
          newRoi.width = Math.max(10, originalRect.width + displayDeltaX);
          newRoi.height = newHeight;
        } else if (dragMode === "resize-sw") {
          const newWidth = Math.max(10, originalRect.width - displayDeltaX);
          newRoi.x = originalRect.x + originalRect.width - newWidth;
          newRoi.width = newWidth;
          newRoi.height = Math.max(10, originalRect.height + displayDeltaY);
        }

        // Keep within image bounds
        newRoi.x = Math.max(0, newRoi.x);
        newRoi.y = Math.max(0, newRoi.y);
        newRoi.width = Math.min(img.naturalWidth - newRoi.x, newRoi.width);
        newRoi.height = Math.min(img.naturalHeight - newRoi.y, newRoi.height);
      }

      // Update the ROI
      setRoi(newRoi);

      // Draw updated rectangle
      const displayRoi = {
        x: newRoi.x * (img.offsetWidth / img.naturalWidth),
        y: newRoi.y * (img.offsetHeight / img.naturalHeight),
        width: newRoi.width * (img.offsetWidth / img.naturalWidth),
        height: newRoi.height * (img.offsetHeight / img.naturalHeight),
      };

      drawRoiOnCanvas(canvas, displayRoi);
      return;
    }

    // Original drawing logic for new rectangles
    if (!isDrawing || currentImage === null) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      startPos.x,
      startPos.y,
      mouseX - startPos.x,
      mouseY - startPos.y
    );
    const width = Math.abs(mouseX - startPos.x);
    const height = Math.abs(mouseY - startPos.y);
    ctx.fillStyle = "#00ff00";
    ctx.font = "12px Arial";
    ctx.fillText(
      `${width}x${height}`,
      startPos.x + width / 2 - 20,
      startPos.y + height / 2
    );
  };

  // Finish drawing in main view
  // Update the finishDrawingRect function:
  const finishDrawingRect = (e, canvasRef, setRoi, imageNum) => {
    e.preventDefault();
    const canvas = canvasRef.current;

    // Reset drag/resize state
    if (isDraggingRect || isResizingRect) {
      setIsDraggingRect(false);
      setIsResizingRect(false);
      setDragMode(null);
      setCurrentImage(null);
      setOriginalRect(null);
      canvas.style.cursor = "crosshair";
      return;
    }

    // Original logic for new rectangles
    if (!isDrawing || currentImage === null) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const x = Math.min(startPos.x, endX);
    const y = Math.min(startPos.y, endY);
    const width = Math.abs(endX - startPos.x);
    const height = Math.abs(endY - startPos.y);

    if (width > 2 && height > 2) {
      // Get natural dimensions
      const img = imageNum === 1 ? imgRef1.current : imgRef2.current;
      if (!img) return;

      const scaleX = img.naturalWidth / img.offsetWidth;
      const scaleY = img.naturalHeight / img.offsetHeight;

      const naturalRoi = {
        x: Math.round(x * scaleX),
        y: Math.round(y * scaleY),
        width: Math.round(width * scaleX),
        height: Math.round(height * scaleY),
      };

      setRoi(naturalRoi);
      if (imageNum === 1) {
        setFreehandPath1([]);
        setFreehandMask1(null);
      } else {
        setFreehandPath2([]);
        setFreehandMask2(null);
      }
      // Draw ROI on canvas with handles
      drawRoiOnCanvas(canvas, { x, y, width, height });

      // Update dimensions state
      if (imageNum === 1) {
        setImage1Dimensions({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
        });
      } else {
        setImage2Dimensions({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight,
        });
      }
    } else {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsDrawing(false);
    setCurrentImage(null);
  };

  // Add mouse move handler for cursor changes:
  const handleRectMouseMove = (e, canvasRef, imageNum) => {
    if (drawingTool !== "rectangle") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const existingRoi = imageNum === 1 ? roi1 : roi2;
    const img = imageNum === 1 ? imgRef1.current : imgRef2.current;

    if (existingRoi && !isDrawing && !isDraggingRect && !isResizingRect) {
      const interaction = detectRectInteraction(x, y, existingRoi, img);

      if (interaction === "move") {
        canvas.style.cursor = "move";
      } else if (interaction === "resize-se" || interaction === "resize-nw") {
        canvas.style.cursor = "nw-resize";
      } else if (interaction === "resize-ne" || interaction === "resize-sw") {
        canvas.style.cursor = "ne-resize";
      } else {
        canvas.style.cursor = "crosshair";
      }
    }
  };

  // NEW: FREEHAND DRAWING FUNCTIONS
  const startDrawingFreehand = (e, canvasRef, imageNum) => {
    e.stopPropagation();
    e.preventDefault();
    if (!uploadedImage1 || !uploadedImage2 || drawingTool !== "pencil") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get natural coordinates
    const img = imageNum === 1 ? imgRef1.current : imgRef2.current;
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;

    const naturalX = x * scaleX;
    const naturalY = y * scaleY;

    setIsDrawing(true);
    setCurrentImage(imageNum);

    // Clear rectangle ROI when starting freehand
    if (imageNum === 1) {
      setRoi1(null);
      setFreehandPath1([{ x: naturalX, y: naturalY }]);
    } else {
      setRoi2(null);
      setFreehandPath2([{ x: naturalX, y: naturalY }]);
    }

    // Clear canvas and start drawing
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawFreehand = (e, canvasRef, imageNum) => {
    if (!isDrawing || currentImage === null || drawingTool !== "pencil") return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get natural coordinates
    const img = imageNum === 1 ? imgRef1.current : imgRef2.current;
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;

    const naturalX = x * scaleX;
    const naturalY = y * scaleY;

    // Add point to path
    if (imageNum === 1) {
      setFreehandPath1((prev) => [...prev, { x: naturalX, y: naturalY }]);
    } else {
      setFreehandPath2((prev) => [...prev, { x: naturalX, y: naturalY }]);
    }

    // Draw on canvas
    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const finishDrawingFreehand = (e, canvasRef, imageNum) => {
    if (!isDrawing || currentImage === null || drawingTool !== "pencil") return;
    e.preventDefault();

    const img = imageNum === 1 ? imgRef1.current : imgRef2.current;

    // Generate mask from freehand path
    const currentPath = imageNum === 1 ? freehandPath1 : freehandPath2;
    if (currentPath.length > 1) {
      const maskDataURL = generateMaskFromFreehand(currentPath, img);
      if (imageNum === 1) {
        setFreehandMask1(maskDataURL);
      } else {
        setFreehandMask2(maskDataURL);
      }
    }

    setIsDrawing(false);
    setCurrentImage(null);
  };

  // Updated drawPolylineOnCanvas function with dots
  const drawPolylineOnCanvas = (
    canvas,
    path,
    img,
    color = "#ff0000",
    isComplete = false
  ) => {
    if (!canvas || !path || path.length === 0) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale the path from natural coordinates to display coordinates
    const scaleX = canvas.width / img.naturalWidth;
    const scaleY = canvas.height / img.naturalHeight;

    if (path.length === 1) {
      // Draw single point/dot - SMALLER SIZE
      ctx.fillStyle = color;
      const displayX = path[0].x * scaleX;
      const displayY = path[0].y * scaleY;
      ctx.beginPath();
      ctx.arc(displayX, displayY, 3, 0, 2 * Math.PI); // REDUCED from 6 to 3
      ctx.fill();

      // Add a white border to make it more visible - SMALLER BORDER
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1; //  REDUCED from 2 to 1
      ctx.stroke();
      return;
    }

    // Draw lines between points - THINNER LINE
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5; //  REDUCED from 3 to 1.5
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const displayX = point.x * scaleX;
      const displayY = point.y * scaleY;

      if (i === 0) {
        ctx.moveTo(displayX, displayY);
      } else {
        ctx.lineTo(displayX, displayY);
      }
    }

    // Close the path if complete
    if (isComplete && path.length > 2) {
      ctx.closePath();
      ctx.fillStyle = color + "20"; // Semi-transparent fill
      ctx.fill();
    }

    ctx.stroke();

    // Draw dots at each point - SMALLER DOTS
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const displayX = point.x * scaleX;
      const displayY = point.y * scaleY;

      // Outer white circle for visibility - SMALLER
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(displayX, displayY, 4, 0, 2 * Math.PI); // REDUCED from 8 to 4
      ctx.fill();

      // Inner colored circle - SMALLER
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(displayX, displayY, 2.5, 0, 2 * Math.PI); //  REDUCED from 6 to 2.5
      ctx.fill();

      // // Point number (commented out as before)
      // ctx.fillStyle = "#ffffff";
      // ctx.font = "12px Arial";
      // ctx.textAlign = "center";
      // ctx.textBaseline = "middle";
      // ctx.fillText((i + 1).toString(), displayX, displayY);
    }
  };
  // Updated startDrawingPolyline function with immediate visual feedback
  const startDrawingPolyline = (e, canvasRef, imageNum) => {
    e.stopPropagation();
    e.preventDefault();
    if (!uploadedImage1 || !uploadedImage2 || drawingTool !== "polyline")
      return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get natural coordinates
    const img = imageNum === 1 ? imgRef1.current : imgRef2.current;
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;

    const naturalX = x * scaleX;
    const naturalY = y * scaleY;

    // Clear other selection types
    if (imageNum === 1) {
      setRoi1(null);
      setFreehandPath1([]);
      setFreehandMask1(null);

      if (isPolylineComplete1) {
        // Reset if already complete
        setPolylinePath1([{ x: naturalX, y: naturalY }]);
        setIsPolylineComplete1(false);
        setPolylineMask1(null);
      } else {
        // Add point to existing path
        setPolylinePath1((prev) => {
          const newPath = [...prev, { x: naturalX, y: naturalY }];
          // Immediately redraw canvas with new point
          setTimeout(() => {
            if (canvasRef.current && img) {
              drawPolylineOnCanvas(
                canvasRef.current,
                newPath,
                img,
                "#ff0000",
                false
              );
            }
          }, 0);
          return newPath;
        });
      }
    } else {
      setRoi2(null);
      setFreehandPath2([]);
      setFreehandMask2(null);

      if (isPolylineComplete2) {
        // Reset if already complete
        setPolylinePath2([{ x: naturalX, y: naturalY }]);
        setIsPolylineComplete2(false);
        setPolylineMask2(null);
      } else {
        // Add point to existing path
        setPolylinePath2((prev) => {
          const newPath = [...prev, { x: naturalX, y: naturalY }];
          // Immediately redraw canvas with new point
          setTimeout(() => {
            if (canvasRef.current && img) {
              drawPolylineOnCanvas(
                canvasRef.current,
                newPath,
                img,
                "#ff0000",
                false
              );
            }
          }, 0);
          return newPath;
        });
      }
    }

    setCurrentImage(imageNum);
  };

  // Clear polyline functions
  const clearPolyline1 = () => {
    setPolylinePath1([]);
    setPolylineMask1(null);
    setIsPolylineComplete1(false);
    if (canvasRef1.current) {
      const ctx = canvasRef1.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef1.current.width, canvasRef1.current.height);
    }
  };

  const clearPolyline2 = () => {
    setPolylinePath2([]);
    setPolylineMask2(null);
    setIsPolylineComplete2(false);
    if (canvasRef2.current) {
      const ctx = canvasRef2.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef2.current.width, canvasRef2.current.height);
    }
  };

  const completePolyline = (imageNum) => {
    const currentPath = imageNum === 1 ? polylinePath1 : polylinePath2;

    if (currentPath.length < 3) return; // Need at least 3 points

    if (imageNum === 1) {
      setIsPolylineComplete1(true);
      // Generate mask
      const img = imgRef1.current;
      if (img) {
        const maskDataURL = generateMaskFromPolyline(currentPath, img);
        setPolylineMask1(maskDataURL);
      }
      // Redraw canvas
      if (canvasRef1.current && imgRef1.current) {
        drawPolylineOnCanvas(
          canvasRef1.current,
          currentPath,
          imgRef1.current,
          "#ff0000",
          true
        );
      }
    } else {
      setIsPolylineComplete2(true);
      // Generate mask
      const img = imgRef2.current;
      if (img) {
        const maskDataURL = generateMaskFromPolyline(currentPath, img);
        setPolylineMask2(maskDataURL);
      }
      // Redraw canvas
      if (canvasRef2.current && imgRef2.current) {
        drawPolylineOnCanvas(
          canvasRef2.current,
          currentPath,
          imgRef2.current,
          "#ff0000",
          true
        );
      }
    }

    setCurrentImage(null);
  };

  // Handle double click to complete polyline
  const handlePolylineDoubleClick = (e, imageNum) => {
    e.preventDefault();
    if (drawingTool !== "polyline") return;

    completePolyline(imageNum);
  };

  // Modal polyline functions
  const handleModalPolylineClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (drawingTool !== "polyline") return;

    const canvas = modalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get natural coordinates
    const img = modalImgRef.current;
    const imgDimensions =
      expandedForROI === "image1" ? image1Dimensions : image2Dimensions;
    const scaleX = imgDimensions.naturalWidth / img.offsetWidth;
    const scaleY = imgDimensions.naturalHeight / img.offsetHeight;

    const naturalX = x * scaleX;
    const naturalY = y * scaleY;

    if (modalPolylineComplete) {
      // Reset if already complete
      setModalPolylinePath([{ x: naturalX, y: naturalY }]);
      setModalPolylineComplete(false);
      // Immediate redraw
      setTimeout(() => {
        drawPolylineOnCanvas(
          canvas,
          [{ x: naturalX, y: naturalY }],
          {
            naturalWidth: imgDimensions.naturalWidth,
            naturalHeight: imgDimensions.naturalHeight,
          },
          "#00ff00",
          false
        );
      }, 0);
    } else {
      // Add point to existing path
      setModalPolylinePath((prev) => {
        const newPath = [...prev, { x: naturalX, y: naturalY }];
        // Immediate redraw
        setTimeout(() => {
          drawPolylineOnCanvas(
            canvas,
            newPath,
            {
              naturalWidth: imgDimensions.naturalWidth,
              naturalHeight: imgDimensions.naturalHeight,
            },
            "#00ff00",
            false
          );
        }, 0);
        return newPath;
      });
    }
  };

  const handleModalPolylineDoubleClick = (e) => {
    e.preventDefault();
    if (drawingTool !== "polyline" || modalPolylinePath.length < 3) return;

    setModalPolylineComplete(true);

    // Generate mask for preview
    const img = modalImgRef.current;
    const imgDimensions =
      expandedForROI === "image1" ? image1Dimensions : image2Dimensions;

    if (modalPolylinePath.length > 2) {
      const tempImg = {
        naturalWidth: imgDimensions.naturalWidth,
        naturalHeight: imgDimensions.naturalHeight,
      };
      const maskDataURL = generateMaskFromPolyline(modalPolylinePath, tempImg);
      setGeneratedMask(maskDataURL);
    }

    // Redraw canvas with completed polyline
    const canvas = modalCanvasRef.current;
    drawPolylineOnCanvas(
      canvas,
      modalPolylinePath,
      {
        naturalWidth: imgDimensions.naturalWidth,
        naturalHeight: imgDimensions.naturalHeight,
      },
      "#00ff00",
      true
    );
  };

  // Generate mask from polyline path
  const generateMaskFromPolyline = (path, imgElement) => {
    if (!path || path.length === 0 || !imgElement) return null;

    const canvas = document.createElement("canvas");
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    const ctx = canvas.getContext("2d");

    // Create black background
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (path.length < 3) return canvas.toDataURL("image/png");

    // Draw white filled polygon
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    return canvas.toDataURL("image/png");
  };

  // Add these helper functions to your component
  const generateMaskFromROI = (roi, imgElement) => {
    if (!roi || !imgElement) return null;

    const canvas = document.createElement("canvas");
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;
    const ctx = canvas.getContext("2d");

    // Create black background
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw white rectangle for ROI
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(roi.x, roi.y, roi.width, roi.height);

    return canvas.toDataURL("image/png");
  };

  const createROIPreview = (imageSrc, maskDataURL) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = imageSrc;

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Draw mask overlay
        const maskImg = new Image();
        maskImg.src = maskDataURL;
        ctx.globalAlpha = 0.5;
        ctx.drawImage(maskImg, 0, 0);
        ctx.globalAlpha = 1.0;

        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const downloadAsBMP = async () => {
    if (!expandedImage) return;
    try {
      const response = await fetch(expandedImage);
      const blob = await response.blob();
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const bmpData = canvasToBMP(canvas);
        const blob = new Blob([bmpData], { type: "image/bmp" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        let filename = "blended_result.bmp";
        if (type === "multiple") {
          if (expandedImage.includes("phase_contrast"))
            filename = "phase_contrast.bmp";
          else if (expandedImage.includes("bright_field"))
            filename = "bright_field.bmp";
          else if (expandedImage.includes("dark_field"))
            filename = "dark_field.bmp";
        }
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error downloading image:", error);
      setErrorMessage("Failed to download image");
      setShowAlert(true);
    }
  };

  const canvasToBMP = (canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const fileSize = 54 + width * height * 3;
    const header = new ArrayBuffer(54);
    const view = new DataView(header);
    view.setUint8(0, 0x42); // 'B'
    view.setUint8(1, 0x4d); // 'M'
    view.setUint32(2, fileSize, true);
    view.setUint32(6, 0, true);
    view.setUint32(10, 54, true);
    view.setUint32(14, 40, true);
    view.setInt32(18, width, true);
    view.setInt32(22, -height, true);
    view.setUint16(26, 1, true);
    view.setUint16(28, 24, true);
    view.setUint32(30, 0, true);
    view.setUint32(34, 0, true);
    view.setInt32(38, 2835, true);
    view.setInt32(42, 2835, true);
    view.setUint32(46, 0, true);
    view.setUint32(50, 0, true);
    const pixelData = new Uint8Array(width * height * 3);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const p = (y * width + x) * 3;
        pixelData[p] = data[i + 2]; // B
        pixelData[p + 1] = data[i + 1]; // G
        pixelData[p + 2] = data[i]; // R
      }
    }
    const bmp = new Uint8Array(fileSize);
    bmp.set(new Uint8Array(header), 0);
    bmp.set(pixelData, 54);
    return bmp;
  };

  const handleBlendImages = async () => {
    // Validation checks
    if (!uploadedImage1 || !uploadedImage2) {
      setErrorMessage("Please upload both images");
      setShowAlert(true);
      return;
    }

    const hasImage1Selection =
      roi1 ||
      (freehandPath1.length > 0 && freehandMask1) ||
      (polylinePath1.length > 2 && isPolylineComplete1 && polylineMask1);

    const hasImage2Selection =
      roi2 ||
      (freehandPath2.length > 0 && freehandMask2) ||
      (polylinePath2.length > 2 && isPolylineComplete2 && polylineMask2);

    if (!hasImage1Selection || !hasImage2Selection) {
      setErrorMessage(
        "Please select regions on both images (rectangle, freehand, or polyline)"
      );
      setShowAlert(true);
      return;
    }

    if (isColorImage2 && !selectedChannel) {
      setErrorMessage("Please select a color channel for the color image");
      setShowAlert(true);
      return;
    }

    if (profile.credit < 1) {
      setErrorMessage("Insufficient credits to perform blending");
      setShowAlert(true);
      return;
    }

    setIsBlending(true);

    try {
      const img1 = imgRef1.current;
      const img2 = imgRef2.current;
      const uniqueCode = Math.floor(
        100000000000 + Math.random() * 900000000000
      ).toString();
      const formData = new FormData();

      // Basic form data
      formData.append("image1", processedImage1File || image1File);
      formData.append("image2", processedImage2File || image2File);
      formData.append("unique_code", uniqueCode);
      formData.append("type", type);
      formData.append("use_sam", useSAM);

      // Image dimensions
      formData.append(
        "display_dimensions1",
        JSON.stringify({
          width: img1.offsetWidth,
          height: img1.offsetHeight,
        })
      );
      formData.append(
        "display_dimensions2",
        JSON.stringify({
          width: img2.offsetWidth,
          height: img2.offsetHeight,
        })
      );

      // Color information
      formData.append("is_color_image1", isColorImage1);
      formData.append("selected_channel1", selectedChannel1);
      formData.append("is_color_image2", isColorImage2);
      formData.append("selected_channel2", selectedChannel);
      formData.append("output_color", outputColor && type === "single");

      // Handle Image 1 selection data
      if (roi1) {
        // Rectangle mode for Image 1
        formData.append("image1_selection_type", "rectangle");
        formData.append(
          "image1_coordinates",
          JSON.stringify({
            x1: roi1.x,
            y1: roi1.y,
            x2: roi1.x + roi1.width,
            y2: roi1.y + roi1.height,
            naturalWidth: img1.naturalWidth,
            naturalHeight: img1.naturalHeight,
            displayWidth: img1.offsetWidth,
            displayHeight: img1.offsetHeight,
          })
        );
      } else if (freehandPath1.length > 0 && freehandMask1) {
        // Freehand mode for Image 1
        formData.append("image1_selection_type", "freehand");

        // Convert mask data URL to blob and append
        const maskBlob1 = await dataURLToBlob(freehandMask1);
        formData.append("image1_mask", maskBlob1, "image1_mask.png");

        // Send image dimensions for reference
        formData.append(
          "image1_dimensions",
          JSON.stringify({
            naturalWidth: img1.naturalWidth,
            naturalHeight: img1.naturalHeight,
            displayWidth: img1.offsetWidth,
            displayHeight: img1.offsetHeight,
          })
        );
      } else if (
        polylinePath1.length > 2 &&
        isPolylineComplete1 &&
        polylineMask1
      ) {
        // NEW: Polyline mode for Image 1
        formData.append("image1_selection_type", "polyline");

        const maskBlob1 = await dataURLToBlob(polylineMask1);
        formData.append("image1_mask", maskBlob1, "image1_mask.png");

        formData.append(
          "image1_dimensions",
          JSON.stringify({
            naturalWidth: img1.naturalWidth,
            naturalHeight: img1.naturalHeight,
            displayWidth: img1.offsetWidth,
            displayHeight: img1.offsetHeight,
          })
        );
      }

      // Handle Image 2 selection data
      if (roi2) {
        // Rectangle mode for Image 2
        formData.append("image2_selection_type", "rectangle");
        formData.append(
          "image2_coordinates",
          JSON.stringify({
            x1: roi2.x,
            y1: roi2.y,
            x2: roi2.x + roi2.width,
            y2: roi2.y + roi2.height,
            naturalWidth: img2.naturalWidth,
            naturalHeight: img2.naturalHeight,
            displayWidth: img2.offsetWidth,
            displayHeight: img2.offsetHeight,
          })
        );
      } else if (freehandPath2.length > 0 && freehandMask2) {
        // Freehand mode for Image 2
        formData.append("image2_selection_type", "freehand");

        // Convert mask data URL to blob and append
        const maskBlob2 = await dataURLToBlob(freehandMask2);
        formData.append("image2_mask", maskBlob2, "image2_mask.png");

        // Send image dimensions for reference
        formData.append(
          "image2_dimensions",
          JSON.stringify({
            naturalWidth: img2.naturalWidth,
            naturalHeight: img2.naturalHeight,
            displayWidth: img2.offsetWidth,
            displayHeight: img2.offsetHeight,
          })
        );
      } else if (
        polylinePath2.length > 2 &&
        isPolylineComplete2 &&
        polylineMask2
      ) {
        // NEW: Polyline mode for Image 2
        formData.append("image2_selection_type", "polyline");

        const maskBlob2 = await dataURLToBlob(polylineMask2);
        formData.append("image2_mask", maskBlob2, "image2_mask.png");

        formData.append(
          "image2_dimensions",
          JSON.stringify({
            naturalWidth: img2.naturalWidth,
            naturalHeight: img2.naturalHeight,
            displayWidth: img2.offsetWidth,
            displayHeight: img2.offsetHeight,
          })
        );
      }

      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BACKEND_URL}/api/blend-images/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBlendedResult(response.data.blended_image);

        if (type === "single" && response.data.color_blended_image) {
          setColorBlendedResult(response.data.color_blended_image);
        } else {
          setColorBlendedResult(null);
        }

        if (type === "multiple") {
          set_bright_field(response.data.bright_field);
          set_dark_field(response.data.dark_field);
          set_phase_contrast(response.data.phase_contrast);
        }
      } else {
        throw new Error(response.data.message || "Failed to blend images");
      }
    } catch (error) {
      console.error("Error blending images:", error);
      setErrorMessage(
        error.message || "Failed to blend images. Please try again."
      );
      setShowAlert(true);
    } finally {
      setIsBlending(false);
    }
  };

  // Helper function to convert data URL to blob
  const dataURLToBlob = (dataURL) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      };

      img.src = dataURL;
    });
  };

  const expandImage = (imageSrc) => {
    const images = [`${BACKEND_URL}/${blendedResult}`];

    // NEW: Include color result
    if (colorBlendedResult) {
      images.push(`${BACKEND_URL}/${colorBlendedResult}`);
    }

    if (type === "multiple") {
      images.push(
        `${BACKEND_URL}/${phase_contrast}`,
        `${BACKEND_URL}/${bright_field}`,
        `${BACKEND_URL}/${dark_field}`
      );
    }
    const index = images.findIndex((img) => img === imageSrc);
    setAllImages(images);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setExpandedImage(imageSrc);
  };

  const navigateImage = (direction) => {
    if (!allImages.length) return;
    let newIndex;
    if (direction === "next") {
      newIndex = (currentImageIndex + 1) % allImages.length;
    } else {
      newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    }
    setCurrentImageIndex(newIndex);
    setExpandedImage(allImages[newIndex]);
  };

  const handleKeyDown = (e) => {
    if (expandedImage) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateImage("next");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateImage("prev");
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedImage, currentImageIndex, allImages]);

  const closeModal = () => {
    setExpandedImage(null);
    setAllImages([]);
    setCurrentImageIndex(0);
    // Reset modal zoom state
    setModalScale(1);
    setModalPosition({ x: 0, y: 0 });
    setIsModalDragging(false);
  };

  const handleModalWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY * -0.002; // More precise scaling
    const minScale = 0.1;
    const maxScale = 5;

    setModalScale((prevScale) => {
      const newScale = Math.min(
        Math.max(minScale, prevScale * (1 + delta)),
        maxScale
      );

      // Auto-center when zooming out to minimum
      if (newScale <= 0.5) {
        setModalPosition({ x: 0, y: 0 });
      }

      return newScale;
    });
  };

  // Improved mouse down with better drag detection
  const handleModalImageMouseDown = (e) => {
    if (e.button === 0) {
      // Left mouse button only
      e.preventDefault();
      e.stopPropagation();

      setIsModalDragging(true);
      setModalDragStart({
        x: e.clientX - modalPosition.x,
        y: e.clientY - modalPosition.y,
      });

      // Change cursor
      document.body.style.cursor = "grabbing";
    }
  };

  // Smooth mouse movement
  const handleModalImageMouseMove = (e) => {
    if (isModalDragging) {
      e.preventDefault();
      e.stopPropagation();

      const newX = e.clientX - modalDragStart.x;
      const newY = e.clientY - modalDragStart.y;

      setModalPosition({ x: newX, y: newY });
    }
  };

  // Clean mouse up
  const handleModalImageMouseUp = () => {
    setIsModalDragging(false);
    document.body.style.cursor = "";
  };

  // Simple double click reset
  const handleModalDoubleClick = () => {
    setModalScale(1);
    setModalPosition({ x: 0, y: 0 });
  };
  // Add useEffect for modal mouse events
  useEffect(() => {
    if (isModalDragging) {
      const handleMouseMove = (e) => handleModalImageMouseMove(e);
      const handleMouseUp = () => handleModalImageMouseUp();

      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);

      // Prevent text selection while dragging
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };
    }
  }, [isModalDragging, modalDragStart]);

  // Reset modal zoom when modal opens/closes
  useEffect(() => {
    if (expandedImage) {
      setModalScale(1);
      setModalPosition({ x: 0, y: 0 });
      setIsModalDragging(false);
    }
  }, [expandedImage]);

  const handleMouseMove = (event) => {
    if (isDragging) {
      console.log("handleMouseMove - dragging", {
        movementX: event.movementX,
        movementY: event.movementY,
      });
      setPosition((prev) => ({
        x: prev.x + event.movementX,
        y: prev.y + event.movementY,
      }));
    }
  };

  const handleMouseUp = () => {
    console.log("handleMouseUp triggered!");
    setIsDragging(false);
  };

  // Add useEffect for mouse events
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Add this helper function to detect what part of rectangle is being clicked:
  const detectRectInteraction = (mouseX, mouseY, roi, img) => {
    if (!roi || !img) return null;

    const scaleX = img.offsetWidth / img.naturalWidth;
    const scaleY = img.offsetHeight / img.naturalHeight;

    const displayRoi = {
      x: roi.x * scaleX,
      y: roi.y * scaleY,
      width: roi.width * scaleX,
      height: roi.height * scaleY,
    };

    const handleSize = 8; // Size of resize handles

    // Check corners for resize handles
    if (
      Math.abs(mouseX - (displayRoi.x + displayRoi.width)) < handleSize &&
      Math.abs(mouseY - (displayRoi.y + displayRoi.height)) < handleSize
    ) {
      return "resize-se"; // Southeast corner
    }
    if (
      Math.abs(mouseX - displayRoi.x) < handleSize &&
      Math.abs(mouseY - displayRoi.y) < handleSize
    ) {
      return "resize-nw"; // Northwest corner
    }
    if (
      Math.abs(mouseX - (displayRoi.x + displayRoi.width)) < handleSize &&
      Math.abs(mouseY - displayRoi.y) < handleSize
    ) {
      return "resize-ne"; // Northeast corner
    }
    if (
      Math.abs(mouseX - displayRoi.x) < handleSize &&
      Math.abs(mouseY - (displayRoi.y + displayRoi.height)) < handleSize
    ) {
      return "resize-sw"; // Southwest corner
    }

    // Check if inside rectangle for moving
    if (
      mouseX >= displayRoi.x &&
      mouseX <= displayRoi.x + displayRoi.width &&
      mouseY >= displayRoi.y &&
      mouseY <= displayRoi.y + displayRoi.height
    ) {
      return "move";
    }

    return null;
  };

  return (
    <div className="p-4 ml-28 dark:bg-[#1a1a1a] bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white text-gray-800">
          Renderer
        </h2>
        <div className="flex items-center space-x-4">
          <button
            className={`flex items-center px-3 py-1 rounded-md transition-all
              ${
                drawingTool === "rectangle"
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 border border-indigo-300 dark:border-indigo-500"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-transparent"
              }`}
            onClick={() => setDrawingTool("rectangle")}
          >
            <MdOutlineRectangle className="mr-1" size={18} />
            Rectangle
          </button>
          <button
            className={`flex items-center px-3 py-1 rounded-md transition-all
              ${
                drawingTool === "pencil"
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 border border-indigo-300 dark:border-indigo-500"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-transparent"
              }`}
            onClick={() => setDrawingTool("pencil")}
          >
            <FaPencilAlt className="mr-1" size={14} />
            FreeHand
          </button>
          <button
            className={`flex items-center px-3 py-1 rounded-md transition-all
      ${
        drawingTool === "polyline"
          ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 border border-indigo-300 dark:border-indigo-500"
          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-transparent"
      }`}
            onClick={() => setDrawingTool("polyline")}
          >
            <svg
              className="mr-1"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2 12L4 10L8 14L12 10L16 14L20 10L22 12L20 14L16 10L12 14L8 10L4 14L2 12Z" />
            </svg>
            Polyline
          </button>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div
              className={`relative rounded-md p-1 transition-all ${
                useSAM ? "bg-indigo-100 dark:bg-indigo-900/50" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={useSAM}
                onChange={() => setUseSAM(!useSAM)}
                className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-500"
              />
            </div>
            <span
              className={`text-sm transition-all ${
                useSAM
                  ? "font-medium text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Segment
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Image 1 Upload and Canvas */}
        <div className="border dark:border-gray-600 border-gray-300 rounded-lg p-2">
          <div className="relative">
            <label
              className="flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-300 transition duration-300 dark:border-gray-500 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900"
              onMouseDown={(e) => {
                if (uploadedImage1) e.preventDefault();
              }}
            >
              {uploadedImage1 ? (
                <div className="relative">
                  <img
                    ref={imgRef1}
                    src={
                      isColorImage1
                        ? image1_gray || uploadedImage1
                        : uploadedImage1
                    }
                    alt="Uploaded 1"
                    className="max-h-96 w-auto object-contain rounded-md"
                    onLoad={() => initCanvas(imgRef1, canvasRef1, 1)}
                  />
                  <canvas
                    ref={canvasRef1}
                    className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                    onMouseDown={(e) => {
                      if (drawingTool === "rectangle") {
                        startDrawingRect(e, canvasRef1, setRoi1, 1);
                      } else if (drawingTool === "pencil") {
                        startDrawingFreehand(e, canvasRef1, 1);
                      } else if (drawingTool === "polyline") {
                        startDrawingPolyline(e, canvasRef1, 1);
                      }
                    }}
                    onMouseMove={(e) => {
                      if (drawingTool === "rectangle") {
                        handleRectMouseMove(e, canvasRef1, 1); // Add this line for cursor changes
                        drawRect(e, canvasRef1);
                      } else if (drawingTool === "pencil") {
                        drawFreehand(e, canvasRef1, 1);
                      }
                    }}
                    onMouseUp={(e) => {
                      if (drawingTool === "rectangle") {
                        finishDrawingRect(e, canvasRef1, setRoi1, 1);
                      } else if (drawingTool === "pencil") {
                        finishDrawingFreehand(e, canvasRef1, 1);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (drawingTool === "rectangle") {
                        finishDrawingRect(e, canvasRef1, setRoi1, 1);
                      } else if (drawingTool === "pencil") {
                        finishDrawingFreehand(e, canvasRef1, 1);
                      }
                    }}
                  />
                  <div className="absolute top-0 right-2 p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTempRoi({ ...tempRoi, roi1: roi1 });
                      }}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 flex items-center gap-3"
                    >
                      {/* Expand Tool */}
                      <div className="relative group">
                        <AiOutlineExpand
                          size={20}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedForROI("image1");
                          }}
                        />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Expand View
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <AiOutlineCloudUpload className="h-12 w-12 dark:text-gray-500 text-indigo-600" />
                  <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">
                    Click to upload Raw Image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="hidden"
              />
            </label>
          </div>
          {drawingTool === "polyline" && polylinePath1.length > 0 && (
            <div className="mt-2 flex justify-center space-x-2">
              <button
                onClick={clearPolyline1}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
              >
                Clear Polyline
              </button>
              {polylinePath1.length > 2 && !isPolylineComplete1 && (
                <button
                  onClick={() => completePolyline(1)}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
                >
                  Complete Polyline
                </button>
              )}
            </div>
          )}
          {drawingTool === "polyline" && (
            <div className="mt-2 text-center">
              {/* Image 1 Status */}
              {polylinePath1.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Raw Image: {polylinePath1.length} points{" "}
                  {isPolylineComplete1
                    ? "(Complete)"
                    : "(Click more points, use Complete button to finish)"}
                </div>
              )}
            </div>
          )}
          {isColorImage1 && (
            <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-neutral-900/30 dark:to-neutral-900/30 border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
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

                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    Raw Image Color Channel Selection
                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-800/60 text-indigo-700 dark:text-indigo-200 rounded-full">
                      Grayscale Conversion
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Select which color channel to use for grayscale conversion
                  </p>

                  <div className="mt-3 relative">
                    <select
                      value={selectedChannel1}
                      onChange={(e) => setSelectedChannel1(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 text-sm rounded-lg bg-white dark:bg-neutral-800 border-0 shadow-sm ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none transition-all"
                    >
                      <option value="rgb">RGB channel</option>
                      <option value="red" className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                        Red Channel
                      </option>
                      <option value="green">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        Green Channel
                      </option>
                      <option value="blue">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        Blue Channel
                      </option>
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

        {/* Image 2 */}
        <div className="border dark:border-gray-600 border-gray-300 rounded-lg p-2">
          <div className="relative">
            <label
              className="flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-300 transition duration-300 dark:border-gray-500 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900"
              onMouseDown={(e) => {
                if (uploadedImage2) e.preventDefault();
              }}
            >
              {isPdfLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Loading PDF...
                  </p>
                </div>
              ) : uploadedImage2 ? (
                <div className="relative">
                  <img
                    ref={imgRef2}
                    src={isDefault || uploadedImage2}
                    alt="Uploaded 2"
                    className="max-h-96 w-auto object-contain rounded-md"
                    onLoad={() => initCanvas(imgRef2, canvasRef2, 2)}
                  />
                  <canvas
                    ref={canvasRef2}
                    className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                    onMouseDown={(e) => {
                      if (drawingTool === "rectangle") {
                        startDrawingRect(e, canvasRef2, setRoi2, 2);
                      } else if (drawingTool === "pencil") {
                        startDrawingFreehand(e, canvasRef2, 2);
                      } else if (drawingTool === "polyline") {
                        startDrawingPolyline(e, canvasRef2, 2);
                      }
                    }}
                    onMouseMove={(e) => {
                      if (drawingTool === "rectangle") {
                        handleRectMouseMove(e, canvasRef2, 2); // Add this line for cursor changes
                        drawRect(e, canvasRef2);
                      } else if (drawingTool === "pencil") {
                        drawFreehand(e, canvasRef2, 2);
                      }
                    }}
                    onMouseUp={(e) => {
                      if (drawingTool === "rectangle") {
                        finishDrawingRect(e, canvasRef2, setRoi2, 2);
                      } else if (drawingTool === "pencil") {
                        finishDrawingFreehand(e, canvasRef2, 2);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (drawingTool === "rectangle") {
                        finishDrawingRect(e, canvasRef2, setRoi2, 2);
                      } else if (drawingTool === "pencil") {
                        finishDrawingFreehand(e, canvasRef2, 2);
                      }
                    }}
                  />
                  <div className="absolute top-0 right-2 p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTempRoi({ ...tempRoi, roi2: roi2 });
                      }}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 flex items-center gap-3"
                    >
                      {/* Expand Tool */}
                      <div className="relative group">
                        <AiOutlineExpand
                          size={20}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedForROI("image2");
                          }}
                        />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Expand View
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <AiOutlineCloudUpload className="h-12 w-12 dark:text-gray-500 text-indigo-600" />
                  <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">
                    Click to upload Photo Image or PDF
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleImageUpload(e, true)}
                className="hidden"
              />
            </label>
          </div>
          {drawingTool === "polyline" && polylinePath2.length > 0 && (
            <div className="mt-2 flex justify-center space-x-2">
              <button
                onClick={clearPolyline2}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
              >
                Clear Polyline
              </button>
              {polylinePath2.length > 2 && !isPolylineComplete2 && (
                <button
                  onClick={() => completePolyline(2)}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
                >
                  Complete Polyline
                </button>
              )}
            </div>
          )}
          {drawingTool === "polyline" && (
            <div className="mt-2 text-center">
              {/* Image 2 Status */}
              {polylinePath2.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Photo Image: {polylinePath2.length} points{" "}
                  {isPolylineComplete2
                    ? "(Complete)"
                    : "(Click more points, use Complete button to finish)"}
                </div>
              )}
            </div>
          )}
          {/* PDF page selector */}
          {isPdf && totalPages > 0 && (
            <div className="mt-3 flex items-center justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-l-md disabled:opacity-50"
              >
                &lt;
              </button>
              <div className="px-4 py-1 bg-gray-100 dark:bg-gray-800">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-r-md disabled:opacity-50"
              >
                &gt;
              </button>

              <div className="ml-4">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value))}
                  className="w-16 p-1 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Color channel selection for Image 2 */}
          {isColorImage2 && (
            <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-neutral-900/30 dark:to-neutral-900/30 border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
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

                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    Photo Image Color Channel Selection
                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-800/60 text-indigo-700 dark:text-indigo-200 rounded-full">
                      Grayscale Conversion
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Select which color channel to use for grayscale conversion
                  </p>

                  <div className="mt-3 relative">
                    <select
                      value={selectedChannel}
                      onChange={(e) => setSelectedChannel(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 text-sm rounded-lg bg-white dark:bg-neutral-800 border-0 shadow-sm ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none transition-all"
                    >
                      <option value="rgb">RGB channel</option>
                      <option value="red" className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                        Red Channel
                      </option>
                      <option value="green">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        Green Channel
                      </option>
                      <option value="blue">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        Blue Channel
                      </option>
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

      {/* NEW: Color channel selection for Image 1 */}

      {/* Blend Button */}
      <button
        onClick={handleBlendImages}
        disabled={
          !uploadedImage1 ||
          !uploadedImage2 ||
          !(
            roi1 ||
            (freehandPath1.length > 0 && freehandMask1) ||
            (polylinePath1.length > 2 && isPolylineComplete1 && polylineMask1)
          ) ||
          !(
            roi2 ||
            (freehandPath2.length > 0 && freehandMask2) ||
            (polylinePath2.length > 2 && isPolylineComplete2 && polylineMask2)
          ) ||
          isBlending ||
          (isColorImage2 && !selectedChannel) ||
          (isColorImage1 && !selectedChannel1)
        }
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-200 disabled:opacity-50"
      >
        {isBlending ? (
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
            Rendering...
          </>
        ) : (
          <>
            <SiCoronarenderer className="h-4 w-4 mx-2" />
            Render Images
          </>
        )}
      </button>

      {blendedResult && (
        // {blendedResult && type === "single" && (
        <section>
          <div className=" flex flex-wrap ">
            <div className="m-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Rendered Image (Single Spot)
              </h3>
              {/* <div
                className="relative overflow-hidden rounded-md border dark:border-gray-600 inline-block"
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
              >
                <img
                  src={`${BACKEND_URL}/${blendedResult}`}
                  alt="Blended result"
                  className="max-h-96 w-auto object-contain cursor-move"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                  onWheel={(e) => handleWheel(e, e.currentTarget.parentElement)}
                  onMouseDown={handleMouseDown}
                  onDoubleClick={handleDoubleClick}
                  draggable={false}
                />
                <button
                  onClick={() => expandImage(`${BACKEND_URL}/${blendedResult}`)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  <AiOutlineExpand size={20} />
                </button>
              </div> */}
              <div className="relative">
                <img
                  src={`${BACKEND_URL}/${blendedResult}`}
                  alt="Blended result"
                  className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                />
                <button
                  onClick={() => expandImage(`${BACKEND_URL}/${blendedResult}`)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  <AiOutlineExpand size={20} />
                </button>
              </div>
            </div>

            <div>
              {type === "multiple" && (
                <div className="m-4">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Phase Contrast
                  </h3>
                  <div className="relative">
                    <img
                      src={`${BACKEND_URL}/${phase_contrast}`}
                      alt="Blended result"
                      className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                    />
                    <button
                      onClick={() =>
                        expandImage(`${BACKEND_URL}/${phase_contrast}`)
                      }
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                    >
                      <AiOutlineExpand size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NEW: COLOR OUTPUT SECTION */}
            {isColorImage1 && selectedChannel1 !== "rgb" && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">
                  Color Output Options
                </h4>

                <button
                  onClick={createColorImage}
                  disabled={isGeneratingColor}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {isGeneratingColor ? (
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
                      Generating Color Image...
                    </>
                  ) : (
                    "Create Color Image from Original Channels"
                  )}
                </button>

                <p className="mt-2 text-sm text-blue-600 dark:text-blue-300">
                  Combines the processed {selectedChannel1} channel with
                  original{" "}
                  {selectedChannel1 === "red"
                    ? "green and blue"
                    : selectedChannel1 === "green"
                    ? "red and blue"
                    : "red and green"}{" "}
                  channels
                </p>
              </div>
            )}

            {/* Display color result */}
            {colorBlendedResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold dark:text-white">
                  Color Output Result
                </h3>
                <div className="relative">
                  <img
                    src={colorBlendedResult}
                    alt="Color blended result"
                    className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                  />
                  <button
                    onClick={() => {
                      setExpandedImage(colorBlendedResult);
                      setAllImages([colorBlendedResult]);
                    }}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                  >
                    <AiOutlineExpand size={20} />
                  </button>
                </div>

                {/* Download button for color result */}
                <div className="mt-2 flex justify-center">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = colorBlendedResult;
                      link.download = "color_output.bmp";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download Color Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {type === "multiple" && (
            <div className=" flex flex-wrap ">
              <div className="m-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  Bright Field
                </h3>
                <div className="relative">
                  <img
                    src={`${BACKEND_URL}/${bright_field}`}
                    alt="Blended result"
                    className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                  />
                  <button
                    onClick={() =>
                      expandImage(`${BACKEND_URL}/${bright_field}`)
                    }
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                  >
                    <AiOutlineExpand size={20} />
                  </button>
                </div>
              </div>
              <div className="m-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  Dark Field
                </h3>
                <div className="relative">
                  <img
                    src={`${BACKEND_URL}/${dark_field}`}
                    alt="Blended result"
                    className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                  />
                  <button
                    onClick={() => expandImage(`${BACKEND_URL}/${dark_field}`)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                  >
                    <AiOutlineExpand size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ROI Drawing Modal */}
      <Modal
        isOpen={!!expandedForROI}
        onRequestClose={() => setExpandedForROI(null)}
        className=" bg-neutral-900 w-3/4 mx-auto mt-5 h-[95vh] "
        overlayClassName="modal-overlay"
      >
        <div className="relative flex flex-col items-center max-h-[94vh] ">
          <div className=" flex border-b w-full my-2 ">
            <h2 className=" text-lg mx-auto text-gray-300 font-bold mb-2 dark:text-white">
              Draw ROI on{" "}
              {expandedForROI === "image1" ? "Raw Image" : "Photo Image"}
            </h2>
            {/* Add complete button for modal polyline */}
            {drawingTool === "polyline" &&
              modalPolylinePath.length > 2 &&
              !modalPolylineComplete && (
                <button
                  onClick={() => {
                    setModalPolylineComplete(true);
                    // Generate mask for preview
                    const img = modalImgRef.current;
                    const imgDimensions =
                      expandedForROI === "image1"
                        ? image1Dimensions
                        : image2Dimensions;

                    if (modalPolylinePath.length > 2) {
                      const tempImg = {
                        naturalWidth: imgDimensions.naturalWidth,
                        naturalHeight: imgDimensions.naturalHeight,
                      };
                      const maskDataURL = generateMaskFromPolyline(
                        modalPolylinePath,
                        tempImg
                      );
                      setGeneratedMask(maskDataURL);
                    }

                    // Redraw canvas with completed polyline
                    const canvas = modalCanvasRef.current;
                    drawPolylineOnCanvas(
                      canvas,
                      modalPolylinePath,
                      {
                        naturalWidth: imgDimensions.naturalWidth,
                        naturalHeight: imgDimensions.naturalHeight,
                      },
                      "#00ff00",
                      true
                    );
                  }}
                  className="absolute left-20 h-8 px-3 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded cursor-pointer transition-colors"
                >
                  Complete
                </button>
              )}
            {/* Add clear button for modal polyline */}
            {drawingTool === "polyline" && modalPolylinePath.length > 0 && (
              <button
                onClick={() => {
                  setModalPolylinePath([]);
                  setModalPolylineComplete(false);
                  if (modalCanvasRef.current) {
                    const ctx = modalCanvasRef.current.getContext("2d");
                    ctx.clearRect(
                      0,
                      0,
                      modalCanvasRef.current.width,
                      modalCanvasRef.current.height
                    );
                  }
                }}
                className="absolute left-6 h-8 px-3 flex items-center justify-center text-red-400 hover:text-red-300 text-sm font-medium rounded cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={saveModalROI}
              className="absolute right-6 h-8 w-8 flex items-center justify-center text-gray-300  hover:text-white  font-extrabold rounded-full cursor-pointer hover:rotate-45 transition-transform duration-200"
            >
              ✕
            </button>
          </div>

          <div className="relative border-2 border-blue-400 rounded-lg overflow-auto">
            {expandedForROI === "image1" && uploadedImage1 && (
              <img
                src={
                  isColorImage1 ? image1_gray || uploadedImage1 : uploadedImage1
                }
                alt="Full size Raw Image"
                className="max-h-[85vh] max-w-full object-contain"
                ref={modalImgRef}
                onLoad={initModalCanvas}
              />
            )}
            {expandedForROI === "image2" && (uploadedImage2 || isDefault) && (
              <img
                src={isDefault || uploadedImage2}
                alt="Full size Photo Image"
                className="max-h-[85vh] max-w-full object-contain"
                ref={modalImgRef}
                onLoad={initModalCanvas}
              />
            )}
            <canvas
              ref={modalCanvasRef}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
              onMouseDown={(e) => {
                if (drawingTool === "rectangle") {
                  handleModalMouseDown(e);
                } else if (drawingTool === "pencil") {
                  handleModalMouseDown(e);
                } else if (drawingTool === "polyline") {
                  handleModalPolylineClick(e);
                }
              }}
              onMouseMove={(e) => {
                if (drawingTool === "rectangle" || drawingTool === "pencil") {
                  handleModalMouseMove(e);
                }
              }}
              onMouseUp={(e) => {
                if (drawingTool === "rectangle" || drawingTool === "pencil") {
                  handleModalMouseUp(e);
                }
              }}
              onMouseLeave={(e) => {
                if (drawingTool === "rectangle" || drawingTool === "pencil") {
                  handleModalMouseUp(e);
                }
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Expanded Image Modal */}
      <Modal
        isOpen={!!expandedImage}
        onRequestClose={closeModal}
        contentLabel="Expanded Image"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div
          className="relative h-full w-full flex items-center justify-center overflow-hidden"
          onWheel={handleModalWheel}
        >
          {allImages.length > 1 && (
            <button
              onClick={() => navigateImage("prev")}
              className="absolute left-4 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 z-10"
            >
              ←
            </button>
          )}
          <img
            src={expandedImage}
            alt="Expanded view"
            className="max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-200"
            style={{
              transform: `translate(${modalPosition.x}px, ${modalPosition.y}px) scale(${modalScale})`,
              cursor: isModalDragging
                ? "grabbing"
                : modalScale > 1
                ? "grab"
                : "default",
            }}
            onMouseDown={handleModalImageMouseDown}
            onDoubleClick={handleModalDoubleClick}
            draggable={false}
          />
          {allImages.length > 1 && (
            <button
              onClick={() => navigateImage("next")}
              className="absolute right-4 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 z-10"
            >
              →
            </button>
          )}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
          >
            ✕
          </button>
          <div className="absolute top-4 right-12 flex space-x-2 z-10">
            <button
              onClick={downloadAsBMP}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              title="Download current as BMP"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={downloadAllAsZip}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              title="Download all as ZIP"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
                <path d="M17 8V5a2 2 0 0 0-2 2H9a2 2 0 0 0-2 2v3"></path>
              </svg>
            </button>
          </div>
          {allImages.length > 1 && (
            <div className="absolute bottom-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg z-10">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
          {/* Zoom controls */}
          <div className="absolute bottom-14 right-4 bg-white dark:bg-neutral-800 p-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-10">
            <button
              onClick={() => setModalScale((prev) => Math.min(prev * 1.2, 3))}
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
              onClick={() => setModalScale((prev) => Math.max(prev * 0.8, 0.5))}
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
              onClick={() => {
                setModalScale(1);
                setModalPosition({ x: 0, y: 0 });
              }}
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
      </Modal>

      {/* Modal Styles */}
      <style jsx global>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          margin-right: -50%;
          transform: translate(-50%, -50%);
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 0.5rem;
          max-width: 100%;
          max-height: 90vh;
          overflow: hidden;
          outline: none;
          z-index: 1001;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 1000;
          overflow: hidden;
        }
        body.ReactModal__Body--open {
          overflow: hidden;
        }

        .modal button {
          transition: all 0.2s ease;
        }

        .modal button:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ImageBlending;
