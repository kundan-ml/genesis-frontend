import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import AnomalyBody from "../AnomalyBody";
import Model from "../Model";
import StatsPopup from "../Model/StatPopup";
import { useAuth } from "@/utils/auth";
import ImageGenerationSkeleton from "../Skeleton";
import TrainingStatus from "../Training/TrainginBody/training-status/page";
import CustomAlert from "@/components/common/CustomAlert";
import AnomalyBottom from "../SideBar/BottomForm";
import axios from "axios";

const Anomaly = ({ profile, prompt, darkTheme, setDarkTheme }) => {
  const [seed, setSeed] = useState("");
  const [promptStrength, setPromptStrength] = useState("");
  const [generationsStep, setGenerationsStep] = useState("");
  const [selectedModel, setSelectedModel] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer visibility

  const [uploadedImage, setUploadedImage] = useState([]);
  const [colorMapImage, setColorMapImage] = useState([]);
  const [overlapedImg, setOverlapedImg] = useState([]);
  const [OutoutImage, setOutputImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [key, setKey] = useState();
  const [selectedImageType, setSelectedImageType] = useState("fgs");
  const [result, setResult] = useState("");
  const [anomalyScore, setAnomalyScore] = useState(0);
  const [threshold, setthreshold] = useState(0.5);
  const [min_area, set_min_area] = useState(2500)
  const [imageStats, setImageStats] = useState({
    totalImages: 0,
    passImages: 0,
    failImages: 0,
    passPercentage: 0,
    failPercentage: 0,
  });
  const [statsPopupOpen, setStatsPopupOpen] = useState(false);
  const [showTraining, setShowTraining] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  // console.log("Uploaded Image ", uploadedImage)
  const BACKEND_URL = process.env.BACKEND_URL;
  const [anomalyId, setAnomalyId] = useState();
  const projects = [""];
  const { username, logout } = useAuth();

  const [step, setStep] = useState(1); // 1: Upload, 2: Detect
  const [sessionId, setSessionId] = useState(null); // To store the session ID after upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (prompt) {
      setAnomalyId(prompt.id);
      fetchImages(prompt.id);
    }
  }, [prompt]);

  const fetchImages = async (anomalyId) => {
    try {
      setLoading(true);
      // const response = await fetch(`api/fetch-anomaly/?anomalyid=${anomalyId}`);
      const response = await fetch(
        `${BACKEND_URL}/anomaly/fetch-anomaly/?prompt=${anomalyId}`
      );
      if (!response.ok) {
        console.error("Failed to fetch images");
        return;
      }
      const data = await response.json();
      setOutputImage(data);
      setStatsPopupOpen(true);
      // console.log("Data", data);

      let totalImages = 0;
      let passImages = 0;
      let failImages = 0;

      // Use forEach to iterate through the PassImages array
      data.PassImages.forEach((image) => {
        totalImages++;
        if (image.result === "Pass") {
          passImages++;
        } else if (image.result === "Fail") {
          failImages++;
        }
      });

      const passPercentage = ((passImages / totalImages) * 100).toFixed(2);
      const failPercentage = ((failImages / totalImages) * 100).toFixed(2);
      setImageStats({
        totalImages,
        passImages,
        failImages,
        passPercentage,
        failPercentage,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (uploadedImage.length === 0) {
      setErrorMessage("Please upload at least one image");
      setShowAlert(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    let currentSessionId = null;

    try {
      const CHUNK_SIZE = 10;
      const totalChunks = Math.ceil(uploadedImage.length / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = start + CHUNK_SIZE;
        const chunk = uploadedImage.slice(start, end);

        const formData = new FormData();
        chunk.forEach((image) => {
          formData.append("images", image);
        });
        formData.append("username", username);
        formData.append("action", "upload");
        formData.append("chunk_index", i);
        formData.append("total_chunks", totalChunks);

        // Add session ID for subsequent chunks
        if (currentSessionId) {
          formData.append("session_id", currentSessionId);
        }

        const response = await axios.post(
          `${BACKEND_URL}/anomaly/detect/`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const chunkProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              const overallProgress = Math.round(
                (i * CHUNK_SIZE * 100 + chunkProgress * chunk.length) /
                  uploadedImage.length
              );
              setUploadProgress(overallProgress);
            },
          }
        );

        if (i === 0) {
          // Store session ID for subsequent chunks
          currentSessionId = response.data.session_id;
          setSessionId(currentSessionId);
        }

        setUploadedFiles((prev) => [
          ...prev,
          ...chunk.map((file) => ({
            name: file.name,
            size: file.size,
            status: "uploaded",
          })),
        ]);
      }
      setStep(2);
      setErrorMessage("Image uploaded Successfully");
      setShowAlert(true);
    } catch (error) {
      console.error("Upload error:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      setErrorMessage(error.response?.data?.error || "Upload failed");
      setShowAlert(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDetect = async () => {
    if (!selectedModel) {
      setErrorMessage("Please select a model");
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("session_id", sessionId); // Use the stored session ID
    formData.append("model", selectedModel);
    formData.append("username", username);
    formData.append("setthreshold", threshold);
    formData.append("action", "detect"); // Indicate this is detection
    formData.append('min_area', min_area)

    setLoading(true);
    setStep(3);
    try {
      const response = await fetch(`${BACKEND_URL}/anomaly/detect/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setOutputImage(data);
        setStatsPopupOpen(true);

        // Calculate stats
        let totalImages = 0;
        let passImages = 0;
        let failImages = 0;

        data.PassImages.forEach((image) => {
          totalImages++;
          if (image.result === "Pass") passImages++;
          else if (image.result === "Fail") failImages++;
        });

        setImageStats({
          totalImages,
          passImages,
          failImages,
          passPercentage: ((passImages / totalImages) * 100).toFixed(2),
          failPercentage: ((failImages / totalImages) * 100).toFixed(2),
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Detection failed");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setShowAlert(true);
    } finally {
      setStep(2); // Reset step to 2 after detection
      setLoading(false);
    }
  };

  const handleReuse = async (reuseimage) => {
    const reusedImage = reuseimage;
    if (!reusedImage) return;

    const formData = new FormData();
    formData.append("images", reusedImage); // Reuse the raw image
    formData.append("model", selectedModel);
    formData.append("username", username);

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/anomaly/detect/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setOutputImage(data);
        setStatsPopupOpen(true);

        let totalImages = 0;
        let passImages = 0;
        let failImages = 0;

        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            totalImages++;

            if (data[key].result === "Pass") {
              passImages++;
            } else if (data[key].result === "Fail") {
              failImages++;
            }
          }
        }

        const passPercentage = ((passImages / totalImages) * 100).toFixed(2);
        const failPercentage = ((failImages / totalImages) * 100).toFixed(2);
        setImageStats({
          totalImages,
          passImages,
          failImages,
          passPercentage,
          failPercentage,
        });
      } else {
        console.error("Error reusing image");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (key, imageType, model, result, anomalyScore) => {
    setCurrentGroup(OutoutImage[key]);
    setKey(key);
    setSelectedImageType(imageType);

    setSelectedModel(model);
    setModalOpen(true);
    setResult(result);
    const percentage = (anomalyScore * 1).toFixed(6);
    setAnomalyScore(percentage);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentGroup(null);
  };

  // Allert model

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (loading) {
  //       event.preventDefault();
  //       event.returnValue = "Processing is in progress. Are you sure you want to leave?";
  //     }
  //   };

  //   const handleVisibilityChange = () => {
  //     if (loading && document.visibilityState === "hidden") {
  //       alert("Processing is in progress. Please don't switch tabs or close this page.");
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [loading]);

  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState([]);
  useEffect(() => {
    let interval;
    // Start polling only when loading is true
    if (loading) {
      interval = setInterval(() => {
        fetch(`${BACKEND_URL}/anomaly/progress/${username}/`)
          .then((response) => response.json())
          .then((data) => {
            // console.log(data)
            // setProgress(data.progress_percentage);
            setImages(data.images);
            // console.log("Images are", data)

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

  return (
    <div
      className={`flex dark:bg-neutral-800 w-full dark:text-gray-100 bg-neutral-200 text-neutral-900 `}
    >
      <section className="md:w-1/4 max-w-96 ">
        <SideBar
          seed={seed}
          setSeed={setSeed}
          promptStrength={promptStrength}
          setPromptStrength={setPromptStrength}
          generationsStep={generationsStep}
          setGenerationsStep={setGenerationsStep}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          projects={projects}
          // handleSubmit={handleSubmit}
          handleUpload={handleUpload}
          handleDetect={handleDetect}
          setColorMapImage={setColorMapImage}
          setOverlapedImg={setOverlapedImg}
          darkTheme={darkTheme}
          setDarkTheme={setDarkTheme}
          threshold={threshold}
          setthreshold={setthreshold}
          username={username}
          step={step}
          sessionId={sessionId}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          setStep={setStep}
          uploadedFiles={uploadedFiles}
          min_area={min_area} 
          set_min_area={set_min_area}
        />
      </section>
      <main className="flex-1  md:w-3/4 ml-1/4  sm:w-[100vw] px-4 md:px-10  pt-20 pb-8 md:py-8 flex   bg-gradient-to-r from-gradient-start to-gradient-end min-h-[100vh] ">
        {loading ? (
          <>
            {/* <AnomalyBody
              OutoutImage={OutoutImage}
              openModal={openModal}
              handleReuse={handleReuse} // Pass the reuse handler
              darkTheme={darkTheme}
              setSelectedImageType={setSelectedImageType}
            /> */}
            <ImageGenerationSkeleton
              uploadedImage={uploadedImage}
              images={images}
            />
          </>
        ) : (
          <>
            <AnomalyBody
              OutoutImage={OutoutImage}
              openModal={openModal}
              handleReuse={handleReuse} // Pass the reuse handler
              darkTheme={darkTheme}
              setSelectedImageType={setSelectedImageType}
            />
            {modalOpen && (
              <Model
                closeModal={closeModal}
                key={key}
                images={[OutoutImage[key]]} // Pass the entire images array
                selectedImageType={selectedImageType}
                setSelectedImageType={setSelectedImageType}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                result={result}
                anomalyScore={anomalyScore}
                darkTheme={darkTheme}
                handleReuse={handleReuse}
              />
            )}
            {showTraining && <TrainingStatus username={username} />}
            {statsPopupOpen && (
              <StatsPopup
                stats={{
                  totalImages: imageStats.totalImages,
                  passImages: imageStats.passImages,
                  failImages: imageStats.failImages,
                  passPercentage: imageStats.passPercentage,
                  failPercentage: imageStats.failPercentage,
                }}
                onClose={() => setStatsPopupOpen(false)}
              />
            )}
            {showAlert && (
              <CustomAlert
                message={errorMessage}
                onClose={() => setShowAlert(false)}
              />
            )}
          </>
        )}
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

        <AnomalyBottom
          seed={seed}
          setSeed={setSeed}
          promptStrength={promptStrength}
          setPromptStrength={setPromptStrength}
          generationsStep={generationsStep}
          setGenerationsStep={setGenerationsStep}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          projects={projects}
          // handleSubmit={handleSubmit}
          setColorMapImage={setColorMapImage}
          setOverlapedImg={setOverlapedImg}
          darkTheme={darkTheme}
          setDarkTheme={setDarkTheme}
          threshold={threshold}
          setthreshold={setthreshold}
          username={username}
        />
      </div>
    </div>
  );
};

export default Anomaly;
