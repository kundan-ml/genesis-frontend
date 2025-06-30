import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaTrashAlt, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import CustomAlert from '@/components/common/CustomAlert';

const UploadMore = ({
  closeModal,
  username,
  selectedDatastes,
  selectedProject,
  setErrorMessage,
  setShowAlert,
  fetchDetails,
}) => {
  const [trainFiles, setTrainFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [showPreviews, setShowPreviews] = useState(false);
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
    const imageFiles = acceptedFiles.filter((file) => file.type.startsWith('image/'));
  
    // Filter out duplicate images
    const newFiles = imageFiles.filter(
      (file) =>
        !trainFiles.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        )
    );
  
    // Alert the names of duplicate files, if any
    const duplicateFiles = imageFiles.filter(
      (file) =>
        trainFiles.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        )
    );
  
    if (duplicateFiles.length > 0) {
      const duplicateNames = duplicateFiles.map((file) => file.name).join(', ');
      alert(`The following images are already present and will not be added: ${duplicateNames}`);
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
    accept: 'image/*',
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

  const uploadChunk = async (file, chunk, index, totalChunks, selectedDatastes, username) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("chunkIndex", index);
    formData.append("totalChunks", totalChunks);
    formData.append("fileName", file.name);
    formData.append("username", username);
    formData.append("datasetName", selectedDatastes);
    formData.append("project", selectedProject)

    return axios.post(`${BACKEND_URL}/train/morefiles/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        // Accumulate the uploaded bytes
        totalUploadedBytes += loaded;

        // Calculate the overall progress for all datasets
        const overallProgress = Math.floor((totalUploadedBytes / totalDatasetSize) * 100);

        // Update the progress bar with the calculated overall progress
        setProgress(Math.min(100, overallProgress)); // Ensure it doesn't exceed 100%
      },
    });
  };

  // Handle file upload with chunks
  const handleSubmit = async () => {

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

          await uploadChunk(file, chunk, index, totalChunks, selectedDatastes, username);
        }
      }
      fetchDetails()
      setErrorMessage("Files uploaded successfully!");
      setShowAlert(true);
      closeModal();
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred during the upload. Please try again.");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Render uploaded files
  const renderFiles = (files) => (
    <div className={` grid h-96 grid-cols-3 gap-4 mt-4 ${showPreviews ? 'grid-cols-5' : 'grid-cols-3'}`}>
      {files.map((file, index) => (
        <div
          key={index}
          className="relative p-2 border border-neutral-700 dark:bg-neutral-800 bg-gray-100 rounded-lg shadow-inner hover:shadow-lg transition-transform transform hover:scale-105 text-center"
        >
          {showPreviews ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="object-cover h-28 rounded-md"
            />
          ) : (
            <p className="text-sm dark:text-gray-300 text-gray-700 truncate">{file.name}</p>
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
    <section className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center `} >
      <div className={`relative md:h-[96vh] sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-800 bg-gray-100 sm:flex xs:flex-wrap rounded-lg p-8 md:py-0`}>
        <div
          className={`absolute top-2 w-full flex  border-neutral-300 border-t-0 border-x-0 border-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-neutral-500 dark:hover:text-neutral-300 hover:text-neutral-700 focus:outline-none`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer ml-auto mr-4 mt-2 hover:rotate-90 transition-transform"
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

            <div className="relative w-full max-w-4xl p-6 dark:bg-neutral-900 bg bg-gray-200 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl border border-opacity-20 border-gray-700 hover:shadow-neon-blue transition-all duration-300 ease-out">
              <h2 className="text-4xl font-extrabold dark:text-gray-200 text-gray-800 mb-6 text-center ">
                Add more Images in Your Datasets: <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]  rounded-md'> {selectedDatastes} </span>
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
                className={`h-96 pt-20 scrollbar-dark overflow-y-scroll cursor-pointer flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl ${isDragActive ? 'border-gradient-animated' : 'dark:border-neutral-700 border-indigo-700'
                  } bg-opacity-40 transition-all duration-300 shadow-inner hover:shadow-glow`}
              >
                <input {...getInputProps()} />
                <FaUpload className="text-7xl dark:text-gray-400 text-indigo-600 mb-4 animate-bounce" />
                <p className="text-xl font-semibold dark:text-gray-300 text-indigo-500">Drag & Drop or Click to Select</p>
                {trainFiles.length > 0 && renderFiles(trainFiles)}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || trainFiles.length === 0}
                className={`relative mt-8 w-full py-4 rounded-full font-bold text-xl text-gray-200 transition-all duration-300 transform overflow-hidden ${isSubmitting
                  ? 'bg-gradient-to-r from-neutral-600 to-neutral-700'
                  : 'bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 hover:shadow-neon-pink hover:scale-105'
                  }`}
              >
                {isSubmitting ? `Uploading... ${progress}%` : 'Submit Dataset'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadMore;
