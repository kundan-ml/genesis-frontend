import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload, FaTrashAlt, FaRegEye, FaRegEyeSlash, FaImage, FaDatabase, FaExpandArrowsAlt, FaShapes } from "react-icons/fa";
import axios from "axios";
import { Files } from "lucide-react";

const UploadImages = ({
  username,
  modelname,
  set_unique_id,
  set_train_upload,
  setErrorMessage,
  setShowAlert,
  allDatasets,
  datasetName,
  selectedProject,
  setSelectedProject,
  newProject,
  project_list,
  setDatasetsName,
  setSelectedDatasets,
  fetchDatasets,
}) => {
  const [trainFiles, setTrainFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [showPreviews, setShowPreviews] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const BACKEND_URL = process.env.BACKEND_URL;
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB per chunk
  // Handle file drop
  // const onDrop = (acceptedFiles) => {
  //   const imageFiles = acceptedFiles.filter((file) => file.type.startsWith('image/'));
  //   setTrainFiles((prevFiles) => [...prevFiles, ...imageFiles]);

  //   const newSize = imageFiles.reduce((acc, file) => acc + file.size, 0);
  //   setTotalSize((prevSize) => prevSize + newSize);
  // };

  // // Initialize dropzone
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: 'image/*',
  // });

  // // Remove a specific file
  // const handleRemoveFile = (index) => {
  //   const updatedFiles = trainFiles.filter((_, i) => i !== index);
  //   setTrainFiles(updatedFiles);

  //   const newSize = updatedFiles.reduce((acc, file) => acc + file.size, 0);
  //   setTotalSize(newSize);
  // };

  const onDrop = (acceptedFiles) => {
    // Filter out non-image files
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    // Filter out duplicate images
    const newFiles = imageFiles.filter(
      (file) =>
        !trainFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        )
    );

    // Alert the names of duplicate files, if any
    const duplicateFiles = imageFiles.filter((file) =>
      trainFiles.some(
        (existingFile) =>
          existingFile.name === file.name && existingFile.size === file.size
      )
    );

    if (duplicateFiles.length > 0) {
      const duplicateNames = duplicateFiles.map((file) => file.name).join(", ");
      alert(
        `The following images are already present and will not be added: ${duplicateNames}`
      );
    }

    // Add only the unique files
    setTrainFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Update the total size
    const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    setTotalSize((prevSize) => prevSize + newSize);
  };

  // Initialize dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Remove a specific file
  const handleRemoveFile = (index) => {
    const updatedFiles = trainFiles.filter((_, i) => i !== index);
    setTrainFiles(updatedFiles);

    const newSize = updatedFiles.reduce((acc, file) => acc + file.size, 0);
    setTotalSize(newSize);
  };

  // Clear all files
  const handleClearAll = () => {
    setTrainFiles([]);
    setTotalSize(0);
  };

  // To keep track of the total file size of all datasets
  let totalDatasetSize = 0;
  let totalUploadedBytes = 0;

  const uploadChunk = async (
    file,
    chunk,
    index,
    totalChunks,
    datasetName,
    username
  ) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("chunkIndex", index);
    formData.append("totalChunks", totalChunks);
    formData.append("fileName", file.name);
    formData.append("username", username);
    formData.append("datasetName", datasetName);
    formData.append("project", selectedProject);
    formData.append("newProject", newProject);


    return axios.post(`${BACKEND_URL}/train/files/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        // Accumulate the uploaded bytes
        totalUploadedBytes += loaded;

        // Calculate the overall progress for all datasets
        const overallProgress = Math.floor(
          (totalUploadedBytes / totalDatasetSize) * 100
        );

        // Update the progress bar with the calculated overall progress
        setProgress(Math.min(100, overallProgress)); // Ensure it doesn't exceed 100%
      },
    });
  };

  // Handle file upload with chunks
  const handleSubmit = async () => {
    if (!datasetName) {
      setErrorMessage("Please enter your Dataset Name.");
      setShowAlert(true);
      return;
    }

    if (allDatasets.includes(datasetName)) {
      setErrorMessage(`Dataset name "${datasetName}" already exists.`);
      setShowAlert(true);
      return;
    }

    if (!selectedProject || selectedProject.trim() === "") {
      setErrorMessage("Please select a project first.");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    try {
      // Calculate the total size of all datasets
      totalDatasetSize = 0;
      for (const file of trainFiles) {
        totalDatasetSize += file.size; // Add up the sizes of all files
      }

      // Reset the total uploaded bytes
      totalUploadedBytes = 0;

      // Upload each file in chunks
      for (const file of trainFiles) {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let index = 0; index < totalChunks; index++) {
          const start = index * CHUNK_SIZE;
          const end = Math.min(file.size, start + CHUNK_SIZE);
          const chunk = file.slice(start, end);

          await uploadChunk(
            file,
            chunk,
            index,
            totalChunks,
            datasetName,
            username
          );
        }
      }
      setUploadSuccess(true);
      setErrorMessage("Files uploaded successfully!");
      console.log("Datasts name", datasetName);
      set_unique_id(Math.random().toString(36).substring(2, 15));
      set_train_upload(true);
      setShowAlert(true);
      // setSelectedDatasets`${datasetName}`
      // setSelectedDatasets(datasetName);
      // fetchDatasets()
          if (selectedProject === 'new' ){
      setSelectedProject(newProject)
    }

      setSelectedDatasets(datasetName);
      // setDatasetsName`${datasetName}`
      // setSelectedDatasets("datasetName")
    } catch (error) {
      // console.error(error);
      setErrorMessage("An error occurred during the upload. Please try again.");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isSubmitting) {
        event.preventDefault();
        event.returnValue =
          "Processing is in progress. Are you sure you want to leave?";
      }
    };

    const handleVisibilityChange = () => {
      if (isSubmitting && document.visibilityState === "hidden") {
        alert(
          "Processing is in progress. Please don't switch tabs or close this page."
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSubmitting]);

  const [imageDetails, setImageDetails] = useState({});

  const handleImageLoad = (event, index, files) => {
    const { naturalWidth, naturalHeight } = event.target;
    const file = files[index];

    setImageDetails((prev) => ({
      ...prev,
      [index]: {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB", // Convert size to KB
        dimensions: `${naturalWidth}x${naturalHeight}`,
        shape: naturalWidth === naturalHeight ? "Square" : "Rectangle",
      },
    }));
  };
  // Render uploaded files
  const renderFiles = (files) => (
    <div
      className={`grid h-96 grid-cols-3 gap-4 mt-4 ${
        showPreviews ? "grid-cols-5" : "grid-cols-3"
      }`}
    >
      {files.map((file, index) => (
        <div
          key={index}
          className="relative p-2 border border-neutral-700 dark:bg-neutral-800 bg-gray-100 rounded-lg shadow-inner hover:shadow-lg transition-transform transform hover:scale-105 text-center group"
        >
          {showPreviews ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="object-cover z-20 h-28 rounded-md"
                onLoad={(e) => handleImageLoad(e, index, files)}
              />
              {/* Tooltip */}
              <div className="fixed bottom-4 left-1/2 z-[100] transform -translate-x-1/2 translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white text-xs p-3 rounded-lg shadow-2xl backdrop-blur-md border border-neutral-700 w-48 pointer-events-none">
  <p className="flex items-center gap-1">
    <FaImage className="text-blue-400" />
    <span className="font-semibold">Name:</span>{" "}
    {imageDetails[index]?.name || "Loading..."}
  </p>
  <p className="flex items-center gap-1">
    <FaDatabase className="text-green-400" />
    <span className="font-semibold">Size:</span>{" "}
    {imageDetails[index]?.size || "Loading..."}
  </p>
  <p className="flex items-center gap-1">
    <FaExpandArrowsAlt className="text-yellow-400" />
    <span className="font-semibold">Dimensions:</span>{" "}
    {imageDetails[index]?.dimensions || "Loading..."}
  </p>
  {/* <p className="flex items-center gap-1">
    <FaShapes className="text-pink-400" />
    <span className="font-semibold">Shape:</span>{" "}
    {imageDetails[index]?.shape || "Loading..."}
  </p> */}
</div>
</div>
          ) : (
            <p className="text-sm dark:text-gray-300 text-gray-700 truncate">
              {file.name}
            </p>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile(index);
            }}
            className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <section className="flex w-full mt-10  items-center">
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

        <div className="relative w-full max-w-4xl p-6 dark:bg-neutral-900 bg bg-gray-200 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl border border-opacity-20 border-gray-700 hover:shadow-neon-blue transition-all duration-300 ease-out">
          {/* <div className='fixed z-40 bg-neutral-900 h-100 flex w-full h-full top-0 left-0 opacity-50 rounded-3xl'  >
<h1 className='mx-auto my-auto text-white text-5xl font-extrabold '  >Upload Successfull</h1>
      </div> */}
          <h2 className="text-4xl font-extrabold dark:text-gray-200 text-gray-800 mb-6 text-center animate-pulse">
            Upload Your Dataset
          </h2>

          <div className="flex gap-4 mb-4 justify-center">
            <button
              onClick={() => setShowPreviews((prev) => !prev)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-gray-200 font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-lg hover:shadow-neon-blue transition-transform transform hover:scale-105"
            >
              {showPreviews ? (
                <>
                  <FaRegEyeSlash /> Show Names
                </>
              ) : (
                <>
                  <FaRegEye /> Show Previews
                </>
              )}
            </button>
            <button
              onClick={handleClearAll}
              disabled={trainFiles.length === 0}
              className="bg-gradient-to-r from-red-700 to-pink-600 text-gray-200 font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-lg hover:shadow-neon-pink transition-transform transform hover:scale-105"
            >
              <FaTrashAlt /> Clear All
            </button>
          </div>

          <div
            {...getRootProps()}
            className={`h-96 pt-20 scrollbar-dark overflow-y-scroll cursor-pointer flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl ${
              isDragActive
                ? "border-gradient-animated"
                : "dark:border-neutral-700 border-indigo-700"
            } bg-opacity-40 transition-all duration-300 shadow-inner hover:shadow-glow`}
          >
            <input {...getInputProps()} />
            <FaUpload className="text-7xl dark:text-gray-400 text-indigo-600 mb-4 animate-bounce" />
            <p className="text-xl font-semibold dark:text-gray-300 text-indigo-500">
              Drag & Drop or Click to Select
            </p>
            {trainFiles.length > 0 && renderFiles(trainFiles)}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || trainFiles.length === 0 || uploadSuccess}
            className={`relative mt-8 w-full py-4 rounded-full font-bold text-xl text-gray-200 transition-all duration-300 transform overflow-hidden ${
              uploadSuccess
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : isSubmitting
                ? "bg-gradient-to-r from-neutral-600 to-neutral-700"
                : "bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 hover:shadow-neon-pink hover:scale-105"
            }`}
          >
            {uploadSuccess
              ? "Successfully Uploaded"
              : isSubmitting
              ? `Uploading... ${progress}%`
              : "Submit Dataset"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UploadImages;
