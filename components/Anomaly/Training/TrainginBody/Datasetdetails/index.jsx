import React, { useState, useEffect } from "react";
import { ConstantColorFactor } from "three";
import UploadMore from "./UploadMore";
import CustomAlert from "@/components/common/CustomAlert";
import {
  MdDeleteForever,
  MdDriveFileRenameOutline,
  MdOutlinePreview,
} from "react-icons/md";
import {
  FaArrowsAltH,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { IoImagesOutline } from "react-icons/io5";
import { MdAddPhotoAlternate } from "react-icons/md";
import DrawRoi from "./DrawROi";
import { XCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";

const DatasetDetails = ({
  username,
  selectedDatastes,
  selectedProject,
  setSelectedDatasets,
  drawRoi,
  setDrawRoi,
  fetchDatasets,
  setDatasetsName,
}) => {
  const [datasetDetails, setDatasetDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelToDelete, setModelToDelete] = useState(null);
  const [datasetToDelete, setDatasetToDelete] = useState(false);
  const [visibleDetails, setVisibleDetails] = useState({});
  const [visibleImages, setVisibleImages] = useState({}); // To track expanded image sections
  const BACKEND_URL = process.env.BACKEND_URL;
  const [images, setImages] = useState([]);
  const [uploadImageModel, setUploadImageModels] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showImageNames, setShowImageNames] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [deleteOption, setDeleteOption] = useState("dataset"); // Default to dataset

  const handleImageSelection = (image) => {
    setSelectedImages((prev) =>
      prev.includes(image)
        ? prev.filter((img) => img !== image)
        : [...prev, image]
    );
  };

  // console.log(datasetDetails);

  const toggleDetailsVisibility = (modelName) => {
    setVisibleDetails((prev) => ({
      ...prev,
      [modelName]: !prev[modelName],
    }));
  };

  const closeModal = () => {
    setUploadImageModels(false);
  };

  const toggleImageVisibility = (type, index) => {
    setVisibleImages((prev) => ({
      ...prev,
      [`${type}-${index}`]: !prev[`${type}-${index}`],
    }));
  };

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/train/fetch-all-data/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedProject,
          username,
          selectedDatastes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setDatasetDetails(data);

      // Fetch all images
      const imageResponse = await fetch(
        `${BACKEND_URL}/train/fetch-all-images/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedProject,
            username,
            selectedDatastes,
          }),
        }
      );

      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch images: ${imageResponse.statusText}`);
      }

      const imageData = await imageResponse.json();
      setImages(imageData);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [username, selectedDatastes]);

  const handleModelDelete = async (modelName) => {
    try {
      const response = await fetch(`${BACKEND_URL}/train/deleteModel/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ modelName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete model.");
      }

      setDatasetDetails((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) => ({
          ...dataset,
          modelsTrained: dataset.modelsTrained.filter(
            (model) => model.name !== modelName
          ),
        })),
      }));
      setModelToDelete(null);
    } catch (err) {
      alert("Error deleting model: " + err.message);
    }
  };

  const handleDatasetDelete = async () => {
    try {
      //   if (deleteOption === "both") {
      //     console.log("Deleting both dataset and models", datasetDetails);

      //     for (const dataset of datasetDetails.datasets) {
      //         if (dataset.modelsTrained && Array.isArray(dataset.modelsTrained)) {
      //             for (const model of dataset.modelsTrained) {
      //                 console.log("Deleting model:", model.name);
      //                 await handleModelDelete(model.name);
      //             }
      //         } else {
      //             console.error("modelsTrained is not an array or is undefined for dataset:", dataset);
      //         }
      //     }
      // }

      const response = await fetch(`${BACKEND_URL}/train/delete-dataset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedDatastes,
          username,
          selectedProject,
          deleteOption,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete dataset.");
      }

      setDatasetDetails(null); // Clear dataset details after deletion
      setDatasetToDelete(false);
      setSelectedDatasets();
      // window.location.reload(); // Reloads the page to reflect changes
      fetchDatasets();
      fetchDetails();
    } catch (err) {
      alert("Error deleting dataset: " + err.message);
    }
  };

  const handleRemoveFiles = async (image) => {
    try {
      const response = await fetch(`${BACKEND_URL}/train/delete-file/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          username,
          selectedDatastes,
          selectedProject,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete Image.");
      }

      // Refresh the dataset details and images
      fetchDatasets();
      fetchDetails();
    } catch (err) {
      alert("Error deleting image: " + err.message);
    }
  };

  const deleteMultipleImages = async () => {
    try {
      if (selectedImages.length === 0) {
        alert("No images selected for deletion.");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/train/delete-multiple-file/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedImages,
            username,
            selectedDatastes,
            selectedProject,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete images.");
      }

      // Optionally, refresh dataset details and images
      fetchDetails();

      // Clear the selected images and reset checkboxes
      setSelectedImages([]);
    } catch (err) {
      alert("Error deleting images: " + err.message);
    }
  };
  // console.log("Selected Images are ", selectedImages);

  const [imageDimensions, setImageDimensions] = useState({});
  const [imageSizes, setImageSizes] = useState({});

  useEffect(() => {
    if (!images || !Array.isArray(images.images)) return; // Prevents errors if images is undefined or not an array

    images.images.forEach((image) => {
      const img = new Image();
      img.src = `${BACKEND_URL}/${image}?q=10`;

      img.onload = () => {
        setImageDimensions((prev) => ({
          ...prev,
          [image]: { width: img.width, height: img.height },
        }));
      };

      fetch(`${BACKEND_URL}/${image}`)
        .then((res) => res.blob())
        .then((blob) => {
          setImageSizes((prev) => ({
            ...prev,
            [image]: (blob.size / 1024).toFixed(2),
          }));
        });
    });
  }, [images]);

  return (
    <section
      className={`h-[88vh]  w-[80%] ml-auto mb-6 mt-16 mr-16  rounded-lg shadow-2xl transition-all duration-300 
        dark:bg-neutral-900 dark:text-white bg-neutral-200 text-gray-900`}
    >
      <div className=" m-4  scrollbar-hidden overflow-y-scroll h-[82vh] ">
        <div className="max-w-5xl mt-0 mx-auto">
          {/* {loading && <p className="text-center">Loading...</p>} */}
          {error && <p className="text-center text-red-500">{error}</p>}
          {datasetDetails?.datasets?.length ? (
            datasetDetails.datasets.map((dataset, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 shadow-xl space-y-6  transition-shadow duration-300 
                dark:bg-neutral-800 dark:text-white bg-white text-gray-900`}
              >
                <h2
                  className={`text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]`}
                >
                  {dataset.name}
                </h2>

                <div className="grid grid-cols-1 gap-8">
                  <div
                    className={`p-8 rounded-lg shadow-2xl transition-all duration-300 
        dark:bg-gradient-to-r dark:from-neutral-800 dark:to-neutral-900 bg-gray-50 hover:bg-neutral-200`}
                  >
                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      Train Images:
                    </p>
                    <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                      {images?.images?.length || 0}{" "}
                      {/* Show 0 if images.images is undefined */}
                      {/* {dataset.trainImagesCount} */}
                      {/* {dataset.images.length} */}
                      {/* Selected: {selectedImages.length} */}
                    </p>

                    <button
                      className="-mt-16 mb-12 right-12 ml-auto cursor-pointer text-indigo-600 hover:text-indigo-800 transition-all duration-300 flex items-center gap-2"
                      onClick={() => setUploadImageModels(true)}
                    >
                      <span className="text-2xl">
                        <MdAddPhotoAlternate />
                      </span>{" "}
                      Add More Images
                    </button>

                    <div className="grid md:grid-cols-2">
                      <button
                        onClick={() => toggleImageVisibility("train", index)}
                        className="mt-6 flex items-center text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-500 transition-all duration-300"
                      >
                        <span className="mr-2">
                          {visibleImages[`train-${index}`] ? (
                            <FaRegEyeSlash />
                          ) : (
                            <FaRegEye />
                          )}
                        </span>
                        <span>
                          {visibleImages[`train-${index}`]
                            ? "Hide Images"
                            : "Show Images"}
                        </span>
                      </button>

                      {visibleImages[`train-${index}`] && (
                        <button
                          onClick={() => setShowImageNames(!showImageNames)}
                          className="mt-6 flex ml-auto items-center text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-500 transition-all duration-300"
                        >
                          <span className="mr-2">
                            {showImageNames ? (
                              <MdOutlinePreview />
                            ) : (
                              <MdDriveFileRenameOutline />
                            )}
                          </span>
                          <span>
                            {showImageNames ? "Show Preview" : "Show Names"}
                          </span>
                        </button>
                      )}
                    </div>
                    {selectedImages.length > 0 && (
                      <button
                        className="mt-6 flex items-center text-red-600 dark:text-red-300"
                        onClick={() => deleteMultipleImages()}
                      >
                        <FaTrashAlt className="mr-2" /> Delete (
                        {selectedImages.length})
                      </button>
                    )}
                  </div>
                </div>

                {visibleImages[`train-${index}`] && (
                  <div className="mt-4 w-full max-h-72 overflow-y-scroll scrollbar-hidden transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-200 dark:scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-800 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-600 p-6 rounded-lg gap-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Images
                      </p>
                      <button
                        onClick={() => setShowImagePopup(true)}
                        className="p-2 rounded-full bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all duration-300"
                      >
                        <FaArrowsAltH className="text-gray-600 -rotate-45 dark:text-gray-300" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-4">
                      {images?.images?.map((image, idx) => (
                        <div
                          key={idx}
                          className="relative p-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-center cursor-pointer"
                          data-tooltip-id={`tooltip-${idx}`}
                        >
                          <input
                            type="checkbox"
                            className="absolute top-2 left-2 w-4 h-4 dark:bg-neutral-900 cursor-grab"
                            onChange={() => handleImageSelection(image)}
                            checked={selectedImages.includes(image)}
                          />

                          {showImageNames ? (
                            <p className="text-gray-700 dark:text-gray-300">
                              {image.slice(image.lastIndexOf("\\") + 1)}
                            </p>
                          ) : (
                            <img
                              src={`${BACKEND_URL}/${image}?q=10`}
                              alt={`Train Image ${idx + 1}`}
                              className="object-cover h-28 w-full rounded-md"
                              onClick={() => setSelectedImage(image)}
                            />
                          )}

                          <button
                            onClick={() => handleRemoveFiles(image)}
                            className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white shadow hover:bg-red-700 hover:shadow-lg transition-all duration-300"
                          >
                            <FaTrashAlt />
                          </button>

                          {/* Tooltip */}
                          <Tooltip
                            id={`tooltip-${idx}`}
                            place="top-start"
                            effect="solid"
                            className="p-2 z-50 text-sm bg-gray-800 text-white rounded-md"
                          >
                            <p>
                              📂 Image Name:{" "}
                              {image.slice(image.lastIndexOf("\\") + 1)}
                            </p>
                            <p>
                              📏 Dimensions: {imageDimensions[image]?.width}x
                              {imageDimensions[image]?.height}
                            </p>
                            <p>💾 Size: {imageSizes[image]} KB</p>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 
{images?.images?.map((image, idx) => (
  <div
    key={idx}
    className="relative p-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out text-center cursor-pointer"
    data-tooltip-id={`tooltip-${idx}`}
  >
    <input
      type="checkbox"
      className="absolute top-2 left-2 w-4 h-4 dark:bg-neutral-900 cursor-grab"
      onChange={() => handleImageSelection(image)}
      checked={selectedImages.includes(image)}
    />

    {showImageNames ? (
      <p className="text-gray-700 dark:text-gray-300">
        {image.slice(image.lastIndexOf("\\") + 1)}
      </p>
    ) : (
      <img
        src={`${BACKEND_URL}/${image}?q=10`}
        alt={`Train Image ${idx + 1}`}
        className="object-cover h-28 w-full rounded-md"
        onClick={() => setSelectedImage(image)}
      />
    )}

    <button
      onClick={() => handleRemoveFiles(image)}
      className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white shadow hover:bg-red-700 hover:shadow-lg transition-all duration-300"
    >
      <FaTrashAlt />
    </button>


    <Tooltip
      id={`tooltip-${idx}`}
      place="top"
      effect="solid"
      className="p-2 text-sm bg-gray-800 text-white rounded-md"
    >
      <p>📂 Image Name: {image.slice(image.lastIndexOf("\\") + 1)}</p>
      <p>📏 Dimensions: {imageDimensions[image]?.width}x{imageDimensions[image]?.height}</p>
      <p>💾 Size: {imageSizes[image]} KB</p>
    </Tooltip>
  </div>
))} */}

                {selectedImage && (
                  <div className="fixed inset-0 -top-6 h-[100vh] w-[100%] bg-black bg-opacity-80 flex items-center justify-center z-40">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 p-4 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    >
                      <FaTimes className="text-gray-700 hover:rotate-90 dark:text-gray-300 text-lg" />
                    </button>
                    <div className="relative h-[94vh] max-w-[80%] bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg">
                      <img
                        src={`${process.env.BACKEND_URL}/${selectedImage}`}
                        alt="Full Screen Image"
                        className="h-[100%] rounded-md"
                      />
                    </div>
                  </div>
                )}

                {showImagePopup && (
                  <div className="fixed inset-0 -top-6 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <button
                      onClick={() => setShowImagePopup(false)}
                      className="absolute top-4  right-4 p-4 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded-full shadow-lg transition-all duration-300"
                    >
                      <FaTimes className="text-gray-700 dark:text-gray-300 text-lg" />
                    </button>
                    <div className="relative h-[90vh] w-[95%] max-w-7xl bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg overflow-y-scroll scrollbar-hidden">
                      <div className="grid grid-cols-12 gap-6">
                        {images.images.map((image, idx) => (
                          <div
                            key={idx}
                            className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 w-full h-full flex flex-col items-center"
                          >
                            <div className="w-full h-full relative rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                              <img
                                src={`${BACKEND_URL}/${image}?q=10`}
                                alt={`Full Screen Image ${idx + 1}`}
                                className="object-cover w-full h-full rounded-md"
                              />
                              <button
                                onClick={() => handleRemoveFiles(image)}
                                className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <FaTrashAlt className="text-lg" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`p-6 rounded-lg shadow-xl flex gap-6 transition-all duration-300 
    dark:bg-gradient-to-r dark:from-neutral-900 dark:to-neutral-800 bg-neutral-200 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800`}
                >
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Last Modified:
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {dataset.uploadedAt}
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl font-bold mb-10 text-center text-indigo-600">
                    Trained Models
                  </h3>

                  <div className="space-y-8">
                    {dataset.modelsTrained.map((model, idx) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-lg shadow-lg transition-all duration-300 
        dark:bg-gradient-to-r dark:from-neutral-900 dark:to-neutral-800 bg-white hover:shadow-xl`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                            Model Name: {model.name}
                          </p>
                          <button
                            onClick={() => toggleDetailsVisibility(model.name)}
                            className="transition-all flex items-center gap-2 duration-300 font-semibold text-blue-600 hover:text-blue-800 dark:text-indigo-500 dark:hover:text-indigo-700"
                          >
                            {visibleDetails[model.name] ? (
                              <>
                                <FaEyeSlash />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <FaEye />
                                Show Details
                              </>
                            )}
                          </button>
                        </div>

                        {visibleDetails[model.name] && (
                          <section className="">
                            <div className="mt-2 space-y-4 grid md:grid-cols-2 sm:grid-cols-1 ">
                              <div className="flex items-center gap-4">
                                <span className="text-indigo-500 text-2xl">
                                  🖼️
                                </span>
                                <p className="text-sm text-gray-600">
                                  Image Size: {model.imageSize}
                                </p>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="text-indigo-500 text-2xl">
                                  ⚙️
                                </span>
                                <p className="text-sm text-gray-600">
                                  Batch Size: {model.batchSize}
                                </p>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="text-indigo-500 text-2xl">
                                  🔄
                                </span>
                                <p className="text-sm text-gray-600">
                                  Seed: {model.seed}
                                </p>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="text-indigo-500 text-2xl">
                                  ⏱️
                                </span>
                                <p className="text-sm text-gray-600">
                                  Trained At: {model.trainedAt}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setModelToDelete(model)}
                              className="mt-12 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
                            >
                              Delete Model
                            </button>
                          </section>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setDatasetToDelete(true)}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-all duration-300"
                  >
                    Delete Dataset
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Loading.....</p>
          )}
        </div>

        {modelToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-lg shadow-lg w-96 transition-all duration-300 
              dark:bg-neutral-800 dark:text-white bg-neutral-200 text-gray-900`}
            >
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">
                Are you sure you want to delete the model{" "}
                <strong>{modelToDelete.name}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setModelToDelete(null)}
                  className="px-4 py-2 bg-neutral-300 hover:bg-neutral-400 rounded-md transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleModelDelete(modelToDelete.name)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {datasetToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="p-6 rounded-xl shadow-2xl w-auto transition-all duration-300 dark:bg-neutral-900 bg-neutral-100 text-white dark:text-gray-100 relative">
              {/* Close Button */}
              <button
                // onClick={onCancel}
                onClick={() => setDatasetToDelete(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-all"
              >
                <XCircle size={24} />
              </button>

              {/* Modal Content */}
              <h2 className="text-2xl font-semibold text-red-500 mb-4">
                Confirm Deletion
              </h2>
              <p className="mb-6 text-sm text-gray-300">
                Are you sure you want to delete the{" "}
                <strong>{selectedDatastes}</strong>?
              </p>

              {/* Delete Options */}
              <div className="flex grid-cols-2  gap-3 mb-6 text-gray-200">
                <label className="flex items-center left-0 text-sm  gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deleteOption"
                    value="dataset"
                    checked={deleteOption === "dataset"}
                    onChange={() => setDeleteOption("dataset")}
                    className="hidden"
                  />
                  <span
                    className={`px-4 py-2 rounded-md transition-all ${
                      deleteOption === "dataset"
                        ? "bg-red-600"
                        : "bg-neutral-700"
                    }`}
                  >
                    Delete Dataset Only
                  </span>
                </label>
                <label className="flex items-center ml-auto right-0 text-sm gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deleteOption"
                    value="both"
                    checked={deleteOption === "both"}
                    onChange={() => setDeleteOption("both")}
                    className="hidden"
                  />
                  <span
                    className={`px-4 py-2 rounded-md transition-all ${
                      deleteOption === "both" ? "bg-red-600" : "bg-neutral-700"
                    }`}
                  >
                    Delete Both Dataset & Models
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex text-sm justify-end gap-4">
                <button
                  onClick={() => setDatasetToDelete(false)}
                  className="px-4 py-2 bg-neutral-500 hover:bg-neutral-600 rounded-md transition-all"
                >
                  Cancel
                </button>
                <button
                  // onClick={() => onConfirm(deleteOption)}
                  onClick={handleDatasetDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {uploadImageModel && (
        <UploadMore
          closeModal={closeModal}
          username={username}
          selectedDatastes={selectedDatastes}
          selectedProject={selectedProject}
          setErrorMessage={setErrorMessage}
          setShowAlert={setShowAlert}
          fetchDetails={fetchDetails}
        />
      )}
      {drawRoi && (
        <DrawRoi
          username={username}
          setDrawRoi={setDrawRoi}
          selectedProject={selectedProject}
          selectedDatastes={selectedDatastes}
          datasetDetails={datasetDetails}
          images={images}
          fetchDetails={fetchDatasets}
          setDatasetsName={setDatasetsName}
        />
      )}

      {showAlert && (
        <CustomAlert
          message={errorMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </section>
  );
};

export default DatasetDetails;
