import React, { useEffect, useState } from "react";
import {
  AiOutlineCloudUpload,
  AiOutlineProject,
  AiOutlineSetting,
} from "react-icons/ai";
import { FaImages, FaRegImage, FaSeedling } from "react-icons/fa";
import {
  MdExpandMore,
  MdExpandLess,
  MdOutlineSettingsSuggest,
  MdBatchPrediction,
} from "react-icons/md";
import {
  IoIosCheckmarkCircleOutline,
  IoMdRemoveCircleOutline,
} from "react-icons/io";
import Link from "next/link";
import Trash from "@/components/Icons/Trash";
import { FaBraille } from "react-icons/fa";
import { MdGrain } from "react-icons/md";
import { GrVirtualMachine } from "react-icons/gr";
import { MdOutlineDataThresholding } from "react-icons/md";
import axios from "axios";
import { GiBackboneShell } from "react-icons/gi";
import { BsPatchCheck } from "react-icons/bs";

const SideBar = ({
  selectedModel,
  setSelectedModel,
  uploadedImage,
  setUploadedImage,
  projects,
  handleSubmit,
  darkTheme,
  setDarkTheme,
  threshold,
  setthreshold,
  username,
  handleUpload,
  handleDetect,
  step,
  sessionId,
  uploadProgress,
  isUploading,
  uploadedFiles,
  setStep,
}) => {
  const [Credit, setCredit] = useState(0);
  const [openSections, setOpenSections] = useState([
    "uploadImage",
    "selectProject",
  ]);

  const [project_list, setProjectlist] = useState({});
  const BACKEND_URL = process.env.BACKEND_URL;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [trained_model, set_trained_model] = useState();
  const [trainedModels, setTrainedModels] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedModelDetails, setSelectedModelDetails] = useState(null);
  const [showImagePreviews, setShowImagePreviews] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((sec) => sec !== section)
        : [...prev, section]
    );
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/anomaly/fetch-model/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selected_project: selectedProject }),
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch models");
        setSelectedModel(null);
        setSelectedModelDetails(null); // Reset details too
        return;
      }

      const data = await response.json();
      const accessibleData = data.filter((item) => item.can_access);
      set_trained_model(accessibleData);

      if (Array.isArray(accessibleData)) {
        const filteredData = accessibleData.filter(
          (item) => item.project === selectedProject
        );

        const modelsObject = filteredData.reduce((acc, item) => {
          const modelName = item.modelname?.trim();
          if (modelName) {
            acc[modelName] = item.can_access;
          }
          return acc;
        }, {});

        setTrainedModels(modelsObject);

        if (filteredData.length > 0) {
          const firstUniqueId = filteredData[0].unique_id;
          setSelectedModel(firstUniqueId);
          // Set the details of the first model
          setSelectedModelDetails(filteredData[0]);
        } else {
          setSelectedModel(null);
          setSelectedModelDetails(null);
        }
      } else {
        console.error("Unexpected data format:", data);
        setSelectedModel(null);
        setSelectedModelDetails(null);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setSelectedModel(null);
      setSelectedModelDetails(null);
    }
  };
  useEffect(() => {
    // Trigger fetch when `username` or `selectedProject` changes
    if (username && selectedProject) {
      fetchProject();
    }
  }, [username, selectedProject]);

  useEffect(() => {
    // Fetch data from Django API
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/train/projects/${username}`
        ); // Replace with your API URL
        const projects = response.data.reduce((acc, project) => {
          acc[project.project] = project.status;
          return acc;
        }, {});

        setProjectlist(projects);

        // Set the first project as the selected project if not already set
        if (!selectedProject && Object.keys(projects).length > 0) {
          setSelectedProject(Object.keys(projects)[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
    fetchProject();
  }, []); // Dependency array is empty to ensure this runs only on mount

  const handleImageUpload = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    const totalImages = uploadedImage.length + files.length;

    if (totalImages > 10000) {
      alert("You can only upload a maximum of 10000 images.");
      return;
    }
    setStep(1);

    if (files.length > 0) {
      const duplicateFiles = files.filter((file) =>
        uploadedImage.some(
          (uploadedFile) =>
            uploadedFile.name === file.name &&
            uploadedFile.lastModified === file.lastModified
        )
      );

      if (duplicateFiles.length > 0) {
        const duplicateNames = duplicateFiles
          .map((file) => file.name)
          .join(", ");
        alert(
          `The following images are already present and will not be added: ${duplicateNames}`
        );
      }

      const newFiles = files.filter(
        (file) =>
          !uploadedImage.some(
            (uploadedFile) =>
              uploadedFile.name === file.name &&
              uploadedFile.lastModified === file.lastModified
          )
      );

      if (newFiles.length > 0) {
        setUploadedImage((prev) => [...prev, ...newFiles]);
        setCredit((prev) => prev + newFiles.length * 0.5);
      }
    }
  };

  const handleClear = () => {
    setCredit(0);
    setUploadedImage([]);
  };

  const handleRemoveImage = (index) => {
    setUploadedImage((prev) => prev.filter((_, i) => i !== index));
    setCredit((prev) => prev - 0.5);
  };

  useEffect(() => {
    if (username && selectedProject) {
      fetchProject();
      // Reset details when project changes
      setSelectedModelDetails(null);
    }
  }, [username, selectedProject]);

  const toggleImagePreviews = () => {
    setShowImagePreviews(!showImagePreviews);
  };

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 max-w-96 mt-4 left-0 z-30 min-w-64 w-1/4 dark:bg-neutral-900 bg-white h-screen pt-10 transition-transform -translate-x-full sidebar-bg border-r dark:border-gray-400 border-gray-600 sm:translate-x-0 shadow-lg pb-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-0 py-2 overflow-y-auto scrollbar-dark">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-8"
        >
          <div className="space-y-4 -mb-4 max-h-[75vh] overflow-auto scrollbar-hidden">
            <div className="flex text-sm mx-0 px-1 border-b pb-4 border-gray-600">
              <Link
                href={"/app"}
                className={`mx-auto gap-2 flex items-center w-[49%] dark:text-white px-4 dark:bg-neutral-700 text-white bg-indigo-300 py-2 rounded-sm`}
              >
                <FaBraille className="" />
                Synthesizer
              </Link>

              <div className="relative mx-auto w-[49%]">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`gap-2 flex cursor-pointer border border-gray-500 items-center w-full px-4 dark:bg-neutral-600 bg-indigo-500 text-white py-2 rounded-sm`}
                >
                  <MdGrain className="" />
                  Anomaly Detection
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full dark:bg-neutral-800 bg-indigo-300 shadow-lg mt-1">
                    <Link href={"/anomaly/training"}>
                      <div
                        className={`px-4 py-2 dark:hover:bg-neutral-500 hover:bg-indigo-500 dark:bg-neutral-700 dark:text-white text-black`}
                      >
                        Training
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`relative border-y px-4 py-2 text-sm   transition-transform duration-300 ease-in-out ${
                openSections.includes("selectProject")
                  ? "dark:border-gray-500 border-gray-500"
                  : "dark:border-gray-600 border-gray-400"
              } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600 `}
            >
              <div
                className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500 "
                onClick={() => toggleSection("selectProject")}
              >
                <div className="flex items-center">
                  <AiOutlineProject
                    className={`h-4 w-4 dark:text-white text-indigo-500  `}
                  />
                  <span className="ml-3 font-semibold ">Select Project</span>
                </div>
                <div className="dark:text-gray-500 text-indigo-500">
                  {openSections.includes("selectProject") ? (
                    <MdExpandLess size={12} />
                  ) : (
                    <MdExpandMore size={12} />
                  )}
                </div>
              </div>
              {openSections.includes("selectProject") && (
                <select
                  id="ProjectDropdown"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-2 -mx-2  py-1 mt-2 dark:border-[#1a1a1a] border-gray-200 text-xs font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-700 bg-transparent rounded focus:outline-none dark:focus:bg-neutral-700 focus:bg-white"
                  required
                >
                  <option value="" disabled>
                    Select a project...
                  </option>
                  {Object.entries(project_list).map(([key, value]) => (
                    <option key={key} value={key} disabled={value === false}>
                      {key} {value === false && "(Locked)"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div
              className={`relative border-y px-4 py-2 text-sm transition-transform duration-300 ease-in-out ${
                openSections.includes("selectProject")
                  ? "dark:border-gray-500 border-gray-500"
                  : "dark:border-gray-600 border-gray-400"
              } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600`}
            >
              <div
                className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500"
                onClick={() => toggleSection("uploadImage")}
              >
                <div className="flex items-center">
                  <FaRegImage
                    className={`h-4 w-4 dark:text-white text-indigo-500`}
                  />
                  <span className="ml-3 font-semibold">Upload Image</span>
                </div>
                <div className="text-gray-500">
                  {openSections.includes("uploadImage") ? (
                    <MdExpandLess size={12} />
                  ) : (
                    <MdExpandMore size={12} />
                  )}
                </div>
              </div>
              {openSections.includes("uploadImage") && (
                <div className="mt-4">
                  {uploadedImage.length === 0 ? (
                    <label
                      htmlFor="uploadImageInput"
                      className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-300 transition duration-300 dark:border-gray-600 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900`}
                    >
                      <AiOutlineCloudUpload
                        className={`h-12 w-12 dark:text-gray-500 text-indigo-600`}
                      />
                      <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">
                        Click to upload images
                      </span>
                      <input
                        id="uploadImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("uploadImageInput").click()
                        }
                        className={`text-white p-2 rounded-sm flex items-center transition duration-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 bg-indigo-500 hover:bg-indigo-600`}
                      >
                        <AiOutlineCloudUpload className="h-4 w-4" />
                        <span className="ml-2 text-xs font-light">
                          Add More Images
                        </span>
                      </button>
                      <input
                        id="uploadImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                      <button
                        type="button"
                        onClick={toggleImagePreviews}
                        className={` p-2 rounded-sm text-xs flex items-center transition duration-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 bg-indigo-500 hover:bg-indigo-600`}
                      >
                        {showImagePreviews ? "Hide Previews" : "Show Previews"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClear()}
                        className={`text-white p-2 rounded-sm flex items-center transition duration-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 bg-indigo-500 hover:bg-indigo-600`}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="ml-2 text-xs font-light">Clear</span>
                      </button>
                    </div>
                  )}
                  {/* // Update your file list display */}
                  <div className="mt-2 max-h-60 overflow-y-auto scrollbar-dark">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">
                        {uploadedImage.length} file(s)
                      </span>
                    </div>

                    {showImagePreviews ? (
                      <div className="grid grid-cols-3 gap-2">
                        {uploadedImage.map((image, index) => {
                          const fileStatus =
                            uploadedFiles.find((f) => f.name === image.name)
                              ?.status || "pending";
                          const imageUrl = URL.createObjectURL(image);

                          return (
                            <div
                              key={index}
                              className={`relative p-1 rounded ${
                                fileStatus === "uploaded"
                                  ? "dark:bg-green-900 bg-green-100"
                                  : "dark:bg-neutral-800 bg-gray-100"
                              }`}
                            >
                              <img
                                src={imageUrl}
                                alt={image.name}
                                className="w-full h-24 object-cover rounded"
                                onLoad={() => URL.revokeObjectURL(imageUrl)}
                              />
                              <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs p-0.5 rounded">
                                {image.name.length > 10
                                  ? `${image.name.substring(0, 7)}...`
                                  : image.name}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                className="absolute top-1 right-1 p-0.5 text-white hover:text-red-400"
                                disabled={isUploading}
                              >
                                <IoMdRemoveCircleOutline size={14} />
                              </button>
                              {fileStatus === "uploaded" && (
                                <IoIosCheckmarkCircleOutline className="absolute bottom-1 right-1 text-green-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {uploadedImage.map((image, index) => {
                          const fileStatus =
                            uploadedFiles.find((f) => f.name === image.name)
                              ?.status || "pending";

                          return (
                            <li
                              key={index}
                              className={`flex items-center justify-between p-2 text-sm rounded ${
                                fileStatus === "uploaded"
                                  ? "dark:bg-green-900 bg-green-100"
                                  : "dark:bg-neutral-800 bg-gray-100"
                              }`}
                            >
                              <span className="truncate">{image.name}</span>
                              <div className="flex items-center">
                                {fileStatus === "uploaded" && (
                                  <IoIosCheckmarkCircleOutline className="ml-2 text-green-500" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-1 dark:text-gray-400 text-gray-600 hover:text-red-600 ml-2"
                                  disabled={isUploading}
                                >
                                  <IoMdRemoveCircleOutline size={16} />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`relative border-y px-4 py-4 text-sm transition-transform duration-300 ease-in-out ${
                openSections.includes("selectProject")
                  ? "dark:border-gray-500 border-gray-500"
                  : "dark:border-gray-600 border-gray-400"
              } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600`}
            >
              <div
                className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500"
                onClick={() => toggleSection("advancedSettings")}
              >
                <div className="flex items-center">
                  <AiOutlineSetting
                    className={`h-4 w-4 dark:text-white text-indigo-500`}
                  />
                  <span className="ml-3 font-semibold text-normal">
                    Advanced Settings
                  </span>
                </div>
                <div className="dark:text-gray-500 text-indigo-500">
                  {openSections.includes("advancedSettings") ? (
                    <MdExpandLess size={12} />
                  ) : (
                    <MdExpandMore size={12} />
                  )}
                </div>
              </div>
              {openSections.includes("advancedSettings") && (
                <div className="mt-2 space-y-2">
                  <div className="flex flex-col">
                    <label
                      htmlFor="selectModel"
                      className="text-sm font-medium"
                    >
                      Select Model
                    </label>
                    {selectedProject === "" ? (
                      <></>
                    ) : (
                      <select
                        id="selectModel"
                        value={selectedModel || ""}
                        onChange={(e) => {
                          console.log("Selected value:", e.target.value);
                          const selected = trained_model.find(
                            (model) => model.unique_id === e.target.value
                          );
                          setSelectedModel(e.target.value);
                          setSelectedModelDetails(selected); // Update the details when model changes
                        }}
                        className="w-full px-2 py-1 mt-2 text-sm border rounded-sm focus:outline-none transition-all dark:border-neutral-800 dark:hover:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300 dark:focus:border-gray-600 border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                      >
                        <option value="" disabled>
                          Select a model...
                        </option>
                        {trained_model.map((model, index) => (
                          <option key={index} value={model.unique_id}>
                            {model.modelname}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div
                    className="tooltip-container-top"
                    data-title="Put Threshold value to detect anomaly in image ( Min-0, Max-1 )"
                  >
                    <div className="flex flex-col">
                      <label
                        htmlFor="threshold_value"
                        className="text-sm font-medium"
                      >
                        Threshold Value
                      </label>
                      <MdOutlineDataThresholding className="absolute left-2 bottom-1 h-5 text-indigo-500 dark:text-gray-100" />
                      <input
                        type="text"
                        name=""
                        value={threshold}
                        onChange={(e) => setthreshold(e.target.value)}
                        className={`w-full pl-8 px-2 py-1 mt-2 text-sm border rounded-sm focus:outline-none transition-all dark:border-neutral-800 dark:hover:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300 dark:focus:border-gray-600 border-gray-300 bg-white text-gray-900 focus:border-gray-500`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`border-y px-3  py-2 text-sm  bg-transparent  h-auto ${
                openSections.includes("advancedSettings")
                  ? "border-gray-500"
                  : "border-gray-600"
              } transition-all duration-300`}
            >
              <label
                htmlFor="model_info"
                className="cursor-pointer flex "
                onClick={() => toggleSection("model_info")}
              >
                <MdOutlineSettingsSuggest className="m-1" />
                <span className="ml-2  hover:text-neutral-400 ">
                  Model Information
                </span>
              </label>
              {openSections.includes("model_info") && (
                <>
                  <div className="mt-1 space-y-4 grid grid-cols-2 ">
                    <div
                      className="tooltip-container"
                      data-title="Ensure reproducibility in training.(ANY POSITIVE INTERGER)"
                    >
                      <label
                        htmlFor="seed"
                        className="block ml-1 text-xs mt-2 font-medium dark:text-gray-300"
                      >
                        Seed:
                      </label>
                      <div className="relative flex items-center">
                        <FaSeedling className="absolute left-2 top-2" />
                        <input
                          id="seed"
                          type="text"
                          value={selectedModelDetails?.seed || "N/A"}
                          readOnly
                          className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                        />
                      </div>
                    </div>
                    <div
                      className="tooltip-container-right"
                      data-title="Number of images processed per iteration. Higher batch sizes speed up training but require more GPU memory. Range-(2,4,8,16)"
                    >
                      <label
                        htmlFor="batchSize"
                        className="block text-xs ml-1 -mt-2 font-medium dark:text-gray-300"
                      >
                        Batch Size:
                      </label>
                      <div className="relative flex items-center">
                        <MdBatchPrediction className="absolute left-2 top-2" />
                        <input
                          id="batchSize"
                          type="text"
                          value={selectedModelDetails?.batch_size || "8"}
                          readOnly
                          className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                        />
                      </div>
                    </div>
                    <div
                      className="tooltip-container"
                      data-title="Input Image Resolution (min-256 max-1024)"
                    >
                      <label
                        htmlFor="imageSize"
                        className="block ml-1 text-xs mt-0 font-medium dark:text-gray-300"
                      >
                        Image Size:
                      </label>
                      <div className="relative flex items-center">
                        <FaImages className="absolute left-2 top-2" />
                        <input
                          id="imageSize"
                          type="text"
                          value={selectedModelDetails?.image_size || "N/A"}
                          readOnly
                          className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                        />
                      </div>
                    </div>
                    <div
                      className="tooltip-container-right"
                      data-title="The size of image patches processed by the model (MIN-3  MAX -8)"
                    >
                      <label
                        htmlFor="patchSize"
                        className="block ml-1 text-xs mt-0 font-medium dark:text-gray-300"
                      >
                        Patch Size:
                      </label>
                      <div className="relative flex items-center">
                        <BsPatchCheck className="absolute left-2 top-2" />
                        <input
                          id="patchSize"
                          type="text"
                          value={selectedModelDetails?.patch_size || "3"}
                          readOnly
                          className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                        />
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div className="relative">
                    <div>
                      <label
                        htmlFor="modelSelection"
                        className="block text-xs mt-2 font-medium dark:text-gray-300 text-gray-700"
                      >
                        Backbone
                      </label>
                      <GiBackboneShell
                        className=" top-6 h-[17px] left-2 absolute "
                        aria-hidden="true"
                      />
                      <select
                        id="modelSelection"
                        value={selectedModelDetails?.bacbone || ""}
                        readOnly
                        className="w-full pl-8 px-2 font-bold text-xs py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent  focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300 "
                      >
                        <option value="">
                          {selectedModelDetails?.bacbone || "wideresnet101"}
                        </option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* 
          <div className="px-2 pt-3 border-t dark:border-neutral-500 text-indigo-500">
            <button
              type="submit"
              className="w-full border-neutral-500 bg-gradient-to-r from-[#4F46E5] to-[rgb(225,20,229)] text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center hover:bg-blue-600 transition duration-200"
            >
              <span>Detect Anomaly</span>
              <span className="absolute right-4 bg-[rgb(141,39,143)] text-white ml-2 px-2 py-1 text-xs rounded-md font-light">
                {Credit}
              </span>
            </button>
          </div> */}

          {/* // Change the button section at the bottom of SideBar.jsx */}
          <div className="px-2 pt-3 border-t dark:border-neutral-500 text-indigo-500">
            {step === 1 ? (
              <>
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <div className="text-xs text-center mt-1">
                      {uploadProgress}% Complete (
                      {
                        uploadedFiles.filter((f) => f.status === "uploaded")
                          .length
                      }
                      /{uploadedImage.length} files)
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleUpload}
                  className="w-full border-neutral-500 bg-gradient-to-r from-[#4F46E5] to-[rgb(225,20,229)] text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center hover:bg-blue-600 transition duration-200"
                >
                  <span>Upload Images</span>
                  <span className="absolute right-4 bg-[rgb(141,39,143)] text-white ml-2 px-2 py-1 text-xs rounded-md font-light">
                    {uploadedImage.length}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full mb-2 bg-gray-500 text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center hover:bg-gray-600 transition duration-200"
                >
                  Back to Upload
                </button> */}
                <button
                  type="button"
                  onClick={handleDetect}
                  disabled={step === 3 || uploadedImage.length === 0}
                  className={`w-full border-neutral-500 bg-gradient-to-r from-[#4F46E5] to-[rgb(225,20,229)] text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center transition duration-200
    ${
      step === 3 || uploadedImage.length === 0
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-blue-600"
    }
  `}
                >
                  <span>{step === 3 ? "Processing..." : "Detect Anomaly"}</span>
                  <span className="absolute right-4 bg-[rgb(141,39,143)] text-white ml-2 px-2 py-1 text-xs rounded-md font-light">
                    {Credit}
                  </span>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </aside>
  );
};

export default SideBar;
