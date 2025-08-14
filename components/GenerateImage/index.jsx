import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/utils/auth";
import Modal from "../Model";
import ReactModal from "react-modal";
import Sidebar from "./SideBar";
import BottomForm from "./BottomForm";
import { FaEdit } from "react-icons/fa";
import EmptySkeleton from "./EmptySkeleton";
import CustomAlert from "../common/CustomAlert";
import { FaShare } from "react-icons/fa";
import UserPopup from "./UserPopup";
import axios from "axios";
import BoundingBoxDraw from "./Inpenting/BoundingBoxex";
import ImageBlending from "./ImageBlending";

const GenerateImages = ({
  prompt,
  profile,
  remainingCredits,
  setRemainingCredits,
  darkTheme,
  isInpenting,
  setIsInpenting,
}) => {
  const [selectedProject, setSelectedProject] = useState("LS3 BV");
  const [inputPrompt, setInputPrompt] = useState("");
  const [negetiveInputPrompt, setNegetiveInputPrompt] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [myImage, setMyImage] = useState(null);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10001));
  const [promptStrength, setPromptStrength] = useState("7.5");
  const [generationsStep, setGenerationsStep] = useState("25");
  const [selectedModel, setSelectedModel] = useState("LensAI-v1.5-512");
  const [imageGroups, setImageGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null); // State for the current group
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer visibility
  const [images, setImages] = useState([]);
  const [imageId, setImageId] = useState(0);
  const [userPopup, setUserPopUp] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [subPromptId, SetSubPromptId] = useState(111);
  const [isPopupOpen, setPopupOpen] = useState();
  false;
  const [checkpoints, setCheckpoints] = useState([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");
  const [users, setUsers] = useState([]);
  const { username, logout } = useAuth();
  const BACKEND_URL = process.env.BACKEND_URL;

  const [inpenting_uniqe_code, set_inpenting_uniqe_code] = useState("");

  const [upscale, setUpscale] = useState("INTER_LANCZOS4");
  const [isImageBlending, setIsImageBlending] = useState(false);
  const [uploadedImage2, setUploadedImage2] = useState(null);
  const [image2, setImage2] = useState(null);
  const [type, setType] = useState("single");
  const [isDefault, setIsDefault] = useState();
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);

  // New state variables for PDF handling
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPdf, setIsPdf] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [originalImage2DataURL, setOriginalImage2DataURL] = useState(null);
  const [processedImage2File, setProcessedImage2File] = useState(null);
  const [isColorImage2, setIsColorImage2] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [roi1, setRoi1] = useState(null);
  const [roi2, setRoi2] = useState(null);

  const [colorCombinedImages, setColorCombinedImages] = useState({}); // Store combined images by group ID
  const [isGeneratingColor, setIsGeneratingColor] = useState({});
  const [originalImage1DataURL, setOriginalImage1DataURL] = useState("");
  const [selectedChannel1, setSelectedChannel1] = useState("");

  const [combinedColorModalOpen, setCombinedColorModalOpen] = useState(false);
  const [selectedCombinedImage, setSelectedCombinedImage] = useState(null);
  const [combinedModalScale, setCombinedModalScale] = useState(1);
  const [combinedModalPosition, setCombinedModalPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isCombinedModalDragging, setIsCombinedModalDragging] = useState(false);

  const [composerCheckpoint, setComposerCheckpoint] =
    useState("Composer_v1.0.0.0");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/users/`) // Replace with your actual endpoint
      .then((response) => response.json())
      .then((data) => setUsers(data)) // Assuming the response is an array of users
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    setRoi2(null);
  }, [uploadedImage2]);

  useEffect(() => {
    setRoi1(null);
  }, [uploadedImage]);

  const [fav, setFav] = useState(false);
  useEffect(() => {
    if (prompt) {
      setInputPrompt(prompt.prompt);
      fetchImages(prompt.id);
    }
  }, [prompt]);

  const fetchImages = async (promptId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/fetch-images-${isInpenting}/?prompt=${promptId}`
      );
      if (!response.ok) {
        console.error("Failed to fetch images ");
        return;
      }
      const data = await response.json();
      groupImagesBySubPrompt(data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      setUploadedImage(false);
    }
  };

  const groupImagesBySubPrompt = (images) => {
    const groupedImages = images.reduce((groups, image) => {
      const key = image.sub_prompt_id;
      if (!groups[key]) {
        groups[key] = {
          sub_prompt_id: image.sub_prompt_id,
          sub_prompt_text: image.sub_prompt_text,
          created_at: image.created_at,
          seed: image.seed,
          images: [],
        };
      }
      groups[key].images.push({
        id: image.id,
        url: image.url,
      });
      return groups;
    }, {});

    const groupsArray = Object.values(groupedImages);
    setImageGroups(groupsArray);
  };

  const reUsePrompt = (prompt) => {
    // Check if prompt contains LS3 LPC, LS3 BV, or IOL Lens and set the selected project
    let selectedProject = "";
    if (prompt.includes("ls3 lpc")) {
      selectedProject = "LS3 LPC";
      prompt = prompt.replace("ls3 lpc,", "").trim(); // Remove LS3 LPC from prompt
    } else if (prompt.includes("ls3 bv")) {
      selectedProject = "LS3 BV";
      prompt = prompt.replace("ls3 bv,", "").trim(); // Remove LS3 BV from prompt
    } else if (prompt.includes("iol")) {
      selectedProject = "IOL Lens";
      prompt = prompt.replace("iol,", "").trim(); // Remove IOL Lens from prompt
    }

    // Set the selected project based on the extracted term
    setSelectedProject(selectedProject);

    // Set the prompt and call handleGenerate with the updated prompt
    setInputPrompt(prompt);
    handleGenerate(null, 1, prompt, selectedProject); // Pass the modified prompt directly to handleGenerate
  };

  const handleGenerate = async (
    e = null,
    numImagesOverride = numImages,
    promptOverride = inputPrompt,
    project = null
  ) => {
    if (e) {
      e.preventDefault(); // Only prevent default if an event is passed
    }
    const currentProject = project || selectedProject;
    if (!Number.isInteger(numImagesOverride) || numImagesOverride < 1) {
      // alert('Number of images must be 1 or more.');
      setErrorMessage(`Number of images must be 1 or more.`);
      setShowAlert(true);
      return;
    }
    const formData = new FormData();

    if (Array.isArray(uploadedImage) && uploadedImage.length > 0) {
      uploadedImage.forEach((image) => {
        formData.append("images", image); // Ensure 'images' field matches with Django view
      });
    }

    formData.append("model", selectedModel);
    formData.append("username", username);
    formData.append("inputPrompt", promptOverride); // Use the prompt passed from reUsePrompt
    formData.append("numImages", numImagesOverride);
    formData.append("negetiveInputPrompt", negetiveInputPrompt);
    formData.append("selectedProject", currentProject);
    formData.append("seed", seed);
    formData.append("promptStrength", promptStrength);
    formData.append("generationsStep", generationsStep);
    formData.append("selectedCheckpoint", selectedCheckpoint);
    formData.append("inpenting_uniqe_code", inpenting_uniqe_code);
    formData.append("upscale", upscale);
    if (isInpenting && currentProject === "LPCC") {
      formData.append("composerCheckpoint", composerCheckpoint);
    }
    setLoading(true);
    setDrawerOpen(false);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/generate-images-${isInpenting}/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        console.error("Failed to generate images");
        return;
      }

      setImages([]);
      setUploadedImage(null);
      const data = await response.json();
      // console.log(data);
      groupImagesBySubPrompt(data.images);
      setRemainingCredits(data.profile_data.credit); // Update remaining credits
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setInputPrompt("");
      setLoading(false);
      setUploadedImage(false);
    }
  };

  const openModal = (group, index) => {
    setCurrentGroup(group);
    setImageId(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentGroup(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Show image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const editSubPrompt = (subPromptText) => {
    setInputPrompt(subPromptText);
    const number = Math.floor(Math.random() * 1001); // Generates a number between 0 and 100,000
    setNumImages(1);
    setSeed(number);
    setModalOpen(false);
    // handleGenerate();
  };

  const useImage = (images) => {
    // setMyImage(image);
    setMyImage(`${BACKEND_URL}/${images}`);
    const number = Math.floor(Math.random() * 1001); // Generates a number between 0 and 100,000
    setSeed(number);
    setModalOpen(false);
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    // Start polling only when loading is true
    if (loading) {
      interval = setInterval(() => {
        fetch(`${BACKEND_URL}/api/progress/${username}/`)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data)
            setProgress(data.progress_percentage);
            setImages(data.images);

            // Stop polling if progress reaches 100%
            if (data.progress_percentage >= 101) {
              clearInterval(interval);
            }
          })
          .catch((error) => {
            console.error("Error fetching progress:", error);
          });
      }, 1000); // Poll every second
    }

    // Clean up the interval on unmount or when loading changes to false
    return () => clearInterval(interval);
  }, [username, loading]); // Include 'loading' in the dependency array

  const sharesubprompt = (subprompt_id) => {
    SetSubPromptId(subprompt_id); // Set the selected subprompt_id
    setPopupOpen(true); // Open the popup
  };

  // Handle PDF file
  const loadPdf = async (file) => {
    setIsPdfLoading(true);
    try {
      // Dynamically import PDF.js to avoid SSR issues
      const pdfjsLib = await import("pdfjs-dist/build/pdf");

      // Get PDF.js version to construct worker URL
      const version = pdfjsLib.version;
      // CORRECTED WORKER URL - uses pdf.worker.min.js instead of pdf.min.mjs
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      await renderPdfPage(pdf, 1);
      setIsPdf(true);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setErrorMessage("Failed to load PDF file");
      setShowAlert(true);
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Render specific PDF page
  const renderPdfPage = async (pdf, pageNumber) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png");
      setUploadedImage2(dataURL);
      setOriginalImage2DataURL(dataURL);

      // Create file from canvas
      canvas.toBlob((blob) => {
        const file = new File([blob], `page-${pageNumber}.png`, {
          type: "image/png",
        });
        setImage2File(file);
        setProcessedImage2File(file);
      });

      // Check if color image
      const isColor = await checkIfColorImage(dataURL);
      setIsColorImage2(isColor);
      setSelectedChannel("rgb");
      setRoi2(null);
    } catch (error) {
      console.error("Error rendering PDF page:", error);
      setErrorMessage("Failed to render PDF page");
      setShowAlert(true);
    }
  };

  // Handle page change
  const handlePageChange = async (pageNumber) => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    setIsDefault(null);
    await renderPdfPage(pdfDoc, pageNumber);
  };

  // Check if image is color by sampling pixels
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

  // Convert color image to grayscale based on selected channel
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
            // Do nothing, keep the color channels as is
            continue; // Skip to the next pixel
          } else {
            // Fallback for grayscale or other cases
            value = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average to grayscale
            data[i] = value; // R
            data[i + 1] = value; // G
            data[i + 2] = value; // B
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const grayscaleDataURL = canvas.toDataURL("image/png");
        canvas.toBlob((blob) => {
          const file = new File([blob], "grayscale_image.png", {
            type: "image/png",
          });
          resolve({ dataURL: grayscaleDataURL, file });
        }, "image/png");
      };
      img.src = dataURL;
    });
  };

  useEffect(() => {
    if (uploadedImage && isInpenting) {
      setOriginalImage1DataURL(uploadedImage);
    }
  }, [uploadedImage, isInpenting]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const createColorImage = async (groupId, blendedResultUrl) => {
    if (!blendedResultUrl || !originalImage1DataURL || !selectedChannel1)
      return;

    setIsGeneratingColor((prev) => ({ ...prev, [groupId]: true }));

    try {
      // Load images
      const [originalImg, blendedImg] = await Promise.all([
        loadImage(originalImage1DataURL),
        loadImage(`${BACKEND_URL}${blendedResultUrl}`),
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

      // Store the combined image
      setColorCombinedImages((prev) => ({
        ...prev,
        [groupId]: colorDataURL,
      }));
    } catch (error) {
      console.error("Error creating color image:", error);
      setErrorMessage("Failed to generate color image");
      setShowAlert(true);
    } finally {
      setIsGeneratingColor((prev) => ({ ...prev, [groupId]: false }));
    }
  };

  const getRemainingChannels = (selectedChannel) => {
    if (selectedChannel === "red") return "green and blue";
    if (selectedChannel === "green") return "red and blue";
    if (selectedChannel === "blue") return "red and green";
    return "all";
  };

  // Reset color combined images when starting new generation
  useEffect(() => {
    if (loading) {
      setColorCombinedImages({});
    }
  }, [loading]);

  // Add these handler functions
  const openCombinedColorModal = (imageDataURL) => {
    setSelectedCombinedImage(imageDataURL);
    setCombinedColorModalOpen(true);
    setCombinedModalScale(1);
    setCombinedModalPosition({ x: 0, y: 0 });
  };

  const closeCombinedColorModal = () => {
    setCombinedColorModalOpen(false);
    setSelectedCombinedImage(null);
    setCombinedModalScale(1);
    setCombinedModalPosition({ x: 0, y: 0 });
    setIsCombinedModalDragging(false);
  };

  // Mouse wheel zoom handler - this makes zoom work with mouse wheel
  const handleCombinedModalWheel = (e) => {
    e.preventDefault(); // Stop page from scrolling
    const delta = e.deltaY > 0 ? 0.9 : 1.1; // If wheel goes down = zoom out (0.9), wheel goes up = zoom in (1.1)
    setCombinedModalScale((prev) => {
      const newScale = prev * delta;
      return Math.min(Math.max(newScale, 0.5), 3); // Keep zoom between 0.5x and 3x
    });
  };

  // This handles dragging the image when it's zoomed in
  const handleCombinedModalImageMouseDown = (e) => {
    // Only allow dragging if image is zoomed in (scale > 1)
    if (combinedModalScale > 1) {
      e.preventDefault(); // Stop default browser behavior
      setIsCombinedModalDragging(true); // Show we're now dragging

      // Calculate where the mouse started relative to current image position
      const startX = e.clientX - combinedModalPosition.x;
      const startY = e.clientY - combinedModalPosition.y;

      // Function that runs when mouse moves while dragging
      const handleMouseMove = (e) => {
        setCombinedModalPosition({
          x: e.clientX - startX, // New X position based on mouse movement
          y: e.clientY - startY, // New Y position based on mouse movement
        });
      };

      // Function that runs when mouse button is released
      const handleMouseUp = () => {
        setIsCombinedModalDragging(false); // Stop dragging
        // Remove the event listeners we added to document
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      // Add event listeners to document to track mouse movement and release anywhere
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  // Double-click to toggle between 1x and 2x zoom
  const handleCombinedModalDoubleClick = () => {
    setCombinedModalScale(combinedModalScale === 1 ? 2 : 1);
    if (combinedModalScale !== 1) {
      setCombinedModalPosition({ x: 0, y: 0 }); // Reset position when zooming
    }
  };

  const [image, setImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);

  return (
    <div
      className={`min-h-screen dark:bg-neutral-800 bg-neutral-200 flex flex-col sm:flex-row`}
    >
      {/* Sidebar Section */}
      <Sidebar
        inputPrompt={inputPrompt}
        setInputPrompt={setInputPrompt}
        numImages={numImages}
        setNumImages={setNumImages}
        handleGenerate={handleGenerate}
        handleFileChange={handleFileChange}
        imagePreview={imagePreview}
        negetiveInputPrompt={negetiveInputPrompt}
        setNegetiveInputPrompt={setNegetiveInputPrompt}
        seed={seed}
        setSeed={setSeed}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        promptStrength={promptStrength}
        setPromptStrength={setPromptStrength}
        generationsStep={generationsStep}
        setGenerationsStep={setGenerationsStep}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        profile={profile}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        myImage={myImage}
        setMyImage={setMyImage}
        darkTheme={darkTheme}
        setErrorMessage={setErrorMessage}
        setShowAlert={setShowAlert}
        checkpoints={checkpoints}
        setCheckpoints={setCheckpoints}
        selectedCheckpoint={selectedCheckpoint}
        setSelectedCheckpoint={setSelectedCheckpoint}
        setImage={setImage}
        setMaskImage={setMaskImage}
        isInpenting={isInpenting}
        setIsInpenting={setIsInpenting}
        setImageGroups={setImageGroups}
        isImageBlending={isImageBlending}
        setIsImageBlending={setIsImageBlending}
        uploadedImage2={uploadedImage2}
        setUploadedImage2={setUploadedImage2}
        image2={image2}
        setImage2={setImage2}
        setType={setType}
        upscale={upscale}
        setIsDefault={setIsDefault}
        setUpscale={setUpscale}
        isPdfLoading={isPdfLoading}
        isPdf={isPdf}
        loadPdf={loadPdf}
        totalPages={totalPages}
        currentPage={currentPage}
        setPdfDoc={setPdfDoc}
        setIsPdf={setIsPdf}
        loading={loading}
        composerCheckpoint={composerCheckpoint}
        setComposerCheckpoint={setComposerCheckpoint}
      />

      {/* Main Content Section */}
      <main className="flex-1 py-24 px-0 sm:px-6 lg:px-8 ">
        {isImageBlending && (
          <ImageBlending
            setErrorMessage={setErrorMessage}
            setShowAlert={setShowAlert}
            profile={profile}
            uploadedImage1={uploadedImage}
            setUploadedImage1={setUploadedImage}
            uploadedImage2={uploadedImage2}
            setUploadedImage2={setUploadedImage2}
            image1File={image}
            setImage1File={setImage}
            image2File={image2}
            setImage2File={setImage2}
            type={type}
            isDefault={isDefault}
            setIsDefault={setIsDefault}
            isPdfLoading={isPdfLoading}
            isPdf={isPdf}
            loadPdf={loadPdf}
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            originalImage2DataURL={originalImage2DataURL}
            setOriginalImage2DataURL={setOriginalImage2DataURL}
            processedImage2File={processedImage2File}
            setProcessedImage2File={setProcessedImage2File}
            checkIfColorImage={checkIfColorImage}
            convertToGrayscale={convertToGrayscale}
            isColorImage2={isColorImage2}
            setIsColorImage2={setIsColorImage2}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            roi1={roi1}
            roi2={roi2}
            setRoi1={setRoi1}
            setRoi2={setRoi2}
          />
        )}
        {uploadedImage && isInpenting && (
          <BoundingBoxDraw
            image={image}
            setImage={setImage}
            maskImage={maskImage}
            setMaskImage={setMaskImage}
            uploadedImage={uploadedImage}
            inputPrompt={inputPrompt}
            set_inpenting_uniqe_code={set_inpenting_uniqe_code}
            onChannelSelected={setSelectedChannel1}
          />
        )}
        {loading ? (
          <div>
            <EmptySkeleton
              numImages={numImages}
              inputPrompt={inputPrompt}
              progress={progress}
              generating={"animate-pulse"}
              images={images}
              seed={seed}
              selectedModel={selectedModel}
              load={true}
              selectedProject={selectedProject}
            />
          </div>
        ) : inputPrompt ? (
          <>
            <EmptySkeleton
              numImages={numImages}
              inputPrompt={inputPrompt}
              progress={progress}
              images={images}
              seed={seed}
              selectedModel={selectedModel}
              darkTheme={darkTheme}
              load={false}
              selectedProject={selectedProject}
            />
          </>
        ) : (
          <section className="w-full max-w-10xl mb-0 border-none h-auto py-0 sm:px-0">
            {imageGroups.map((group) => (
              <div
                key={group.sub_prompt_id}
                className="mb-8 mx-0 sm:ml-[7vw]  py-4 sm:py-0  border-none rounded-2xl hover:scale-102"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={` cursor-pointer text-2xl flex text-transparent bg-clip-text bg-gradient-to-r dark:{ from-[white] to-[#E114E5]} from-blue-500 to-[#E114E5]  font-bold mb-4`}
                  >
                    {group.sub_prompt_text}
                    <FaShare
                      className="ml-2 mt-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                      onClick={() => sharesubprompt(group.sub_prompt_id)}
                    />
                  </div>
                  <FaEdit
                    className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => editSubPrompt(group.sub_prompt_text)}
                  />
                </div>
                <p className="text-gray-400 text-xs font-bold mb-8">
                  Created at: {new Date(group.created_at).toLocaleString()}
                </p>
                <div className=" cursor-pointer grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {group.images.slice(0).map((image, index) => (
                    <div
                      onClick={() => openModal(group, index)}
                      key={image.id}
                      className=" relative bg-[#1a1a1a] border group gradient-border overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
                    >
                      <img
                        className="w-full min-w-20 min-h-20 object-cover"
                        src={`${BACKEND_URL}${image.url}`}
                        alt={`Generated from prompt: ${group.sub_prompt_text}`}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        {/* Overlay content */}
                        {/* <span className="text-white" >Click Here</span> */}
                      </div>
                    </div>
                  ))}
                  {/* Add a creative hover effect or animation */}
                </div>
                {isInpenting &&
                  selectedChannel1 &&
                  selectedChannel1 !== "rgb" &&
                  originalImage1DataURL &&
                  group.images.length > 0 && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() =>
                          createColorImage(
                            group.sub_prompt_id,
                            group.images[0].url
                          )
                        }
                        disabled={isGeneratingColor[group.sub_prompt_id]}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isGeneratingColor[group.sub_prompt_id] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Combining...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                            Combine the processed {selectedChannel1} channel
                            with the original{" "}
                            {getRemainingChannels(selectedChannel1)} channels
                          </>
                        )}
                      </button>
                    </div>
                  )}

                {/* Combined Color Image Display */}
                {colorCombinedImages[group.sub_prompt_id] && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                      Combined Color Result
                    </h3>
                    <div className="cursor-pointer grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
                      <div
                        className="relative bg-[#1a1a1a] border group gradient-border overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
                        onClick={() =>
                          openCombinedColorModal(
                            colorCombinedImages[group.sub_prompt_id]
                          )
                        }
                      >
                        <img
                          className="w-full min-w-20 min-h-20 object-cover"
                          src={colorCombinedImages[group.sub_prompt_id]}
                          alt="Combined color result"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                          <span className="text-white text-sm">
                            Click to View
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
        {userPopup && <UserPopup />}

        {modalOpen && currentGroup && (
          <>
            <Modal
              closeModal={closeModal}
              group={currentGroup}
              reUsePrompt={reUsePrompt}
              editSubPrompt={editSubPrompt}
              useImage={useImage}
              seed={currentGroup.seed}
              imageId={imageId}
              setImageId={setImageId}
              selectedModel={selectedModel}
              darkTheme={darkTheme}
              setIsInpenting={setIsInpenting}
              setUploadedImage={setUploadedImage}
              setImage={setImage}
              setMaskImage={setMaskImage}
              setInputPrompt={setInputPrompt}
              setImageGroups={setImageGroups}
              setNumImages={setNumImages}
              isInpenting={isInpenting}
            >
              {currentGroup.images.map((image) => (
                <div
                  key={image.id}
                  className="relative group overflow-scroll sm:overflow-auto  rounded-lg shadow-lg transform transition duration-500 hover:scale-110"
                  image={image}
                >
                  <img
                    className="sm:w-full sm:h-40 object-cover"
                    src={`${BACKEND_URL}${image.url}`}
                    alt="Generated Image"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
              ))}
            </Modal>
          </>
        )}

        <ReactModal // Using react-modal
          isOpen={combinedColorModalOpen}
          onRequestClose={closeCombinedColorModal}
          contentLabel="Combined Color Result - Expanded Image"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div
            className="relative h-full w-full flex items-center justify-center overflow-hidden"
            onWheel={handleCombinedModalWheel}
          >
            <img
              src={selectedCombinedImage}
              alt="Combined Color Result - Expanded view"
              className="max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-200"
              style={{
                transform: `translate(${combinedModalPosition.x}px, ${combinedModalPosition.y}px) scale(${combinedModalScale})`,
                cursor: isCombinedModalDragging
                  ? "grabbing"
                  : combinedModalScale > 1
                  ? "grab"
                  : "default",
              }}
              onMouseDown={handleCombinedModalImageMouseDown}
              onDoubleClick={handleCombinedModalDoubleClick}
              draggable={false}
            />

            {/* Close button */}
            <button
              onClick={closeCombinedColorModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
            >
              ✕
            </button>

            {/* Download button */}
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = selectedCombinedImage;
                link.download = `combined_color_result.bmp`;
                link.click();
              }}
              className="absolute top-4 right-12 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
              title="Download Combined Color Result"
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

            {/* Zoom controls */}
            <div className="absolute bottom-14 right-4 bg-white dark:bg-neutral-800 p-1 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col space-y-1 z-10">
              <button
                onClick={() =>
                  setCombinedModalScale((prev) => Math.min(prev * 1.2, 3))
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
                  ></path>
                </svg>
              </button>
              <button
                onClick={() =>
                  setCombinedModalScale((prev) => Math.max(prev * 0.8, 0.5))
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
                  ></path>
                </svg>
              </button>
              <button
                onClick={() => {
                  setCombinedModalScale(1);
                  setCombinedModalPosition({ x: 0, y: 0 });
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
        </ReactModal>
      </main>

      {/* Toggle Button for Drawer (Mobile) */}
      <button
        className="fixed w-full right-0 bottom-0 sm:hidden bg-gray-500 bg-opacity-50 text-white p-0 rounded-tl-lg focus:outline-none"
        onClick={() => setDrawerOpen((prevState) => !prevState)} // Toggle drawerOpen state
      >
        {/* Arrow icon based on drawer state */}
        {drawerOpen ? (
          <svg
            className="w-6 h-6 transform rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg
            className="w-6 mx-auto h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        )}
      </button>

      {/* Bottom Drawer Section (Mobile) */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-transparent shadow-md sm:hidden transform transition duration-300 ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          className="sm:hidden bg-gray-500 w-full bg-opacity-50 text-white p- rounded-tl-lg focus:outline-none"
          onClick={() => setDrawerOpen((prevState) => !prevState)} // Toggle drawerOpen state
        >
          {/* Arrow icon based on drawer state */}
          {drawerOpen ? (
            <svg
              className="w-6 h-6 mx-auto  transform "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 transform rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          )}
        </button>
        <BottomForm
          inputPrompt={inputPrompt}
          setInputPrompt={setInputPrompt}
          numImages={numImages}
          setNumImages={setNumImages}
          handleGenerate={handleGenerate}
          handleFileChange={handleFileChange}
          imagePreview={imagePreview}
          negetiveInputPrompt={negetiveInputPrompt}
          setNegetiveInputPrompt={setNegetiveInputPrompt}
          seed={seed}
          setSeed={setSeed}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          promptStrength={promptStrength}
          setPromptStrength={setPromptStrength}
          generationsStep={generationsStep}
          setGenerationsStep={setGenerationsStep}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          profile={profile}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          myImage={myImage}
          setMyImage={setMyImage}
          darkTheme={darkTheme}
          setErrorMessage={setErrorMessage}
          setShowAlert={setShowAlert}
          checkpoints={checkpoints}
          setCheckpoints={setCheckpoints}
          selectedCheckpoint={selectedCheckpoint}
          setSelectedCheckpoint={setSelectedCheckpoint}
          setImage={setImage}
          setMaskImage={setMaskImage}
          isInpenting={isInpenting}
          setIsInpenting={setIsInpenting}
          s
        />
      </div>
      {showAlert && (
        <CustomAlert
          message={errorMessage}
          onClose={() => setShowAlert(false)}
        />
      )}

      <UserPopup
        users={users}
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        subPromptId={subPromptId}
        username={username}
      />

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

export default GenerateImages;
