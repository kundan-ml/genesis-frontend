import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineCloudUpload, AiOutlineProject } from "react-icons/ai";
import { FaSeedling, FaBraille, FaImages } from "react-icons/fa";
import {
  MdExpandLess,
  MdExpandMore,
  MdGrain,
  MdOutlineAddAPhoto,
  MdOutlineMergeType,
  MdOutlineNoPhotography,
} from "react-icons/md";
import { Step, Eye, EyeSlash, Strength } from "../Icons";
import { TbBoxMultiple, TbVariable } from "react-icons/tb";
import axios from "axios";
import {
  GiArtificialHive,
  GiFountainPen,
  GiRegeneration,
  GiResize,
} from "react-icons/gi";
import { TbPointerCheck } from "react-icons/tb";
import { LuImageOff, LuImage, LuImageUpscale } from "react-icons/lu";
import { IoMdPhotos, IoMdResize } from "react-icons/io";
import InputPrompt from "./SidebarComponents/InputPrompt";
import { IoIosPricetags } from "react-icons/io";

const Sidebar = ({
  inputPrompt,
  setInputPrompt,
  numImages,
  setNumImages,
  handleGenerate,
  negativeInputPrompt,
  setNegativeInputPrompt,
  selectedProject,
  setSelectedProject,
  seed,
  setSeed,
  promptStrength,
  setPromptStrength,
  generationsStep,
  setGenerationsStep,
  selectedModel,
  setSelectedModel,
  profile,
  uploadedImage,
  setUploadedImage,
  myImage,
  setMyImage,
  setErrorMessage,
  setShowAlert,
  checkpoints,
  setCheckpoints,
  selectedCheckpoint,
  setSelectedCheckpoint,
  setImage,
  setMaskImage,
  isInpenting,
  setIsInpenting,
  setImageGroups,
  isImageBlending,
  setIsImageBlending,
  uploadedImage2,
  setUploadedImage2,
  image2,
  setImage2,
  setType,
  upscale,
  setUpscale,
  type,
  setIsDefault,
  isPdfLoading,
  isPdf,
  loadPdf,
  totalPages,
  currentPage,
  setPdfDoc,
  setIsPdf,
  loading,
  composerCheckpoint,
  setComposerCheckpoint,
}) => {
  const darkTheme = true;
  const [totalCredit, setTotalCredit] = useState(profile.credit);
  const [openSections, setOpenSections] = useState([
    "prompt",
    "imageCount",
    "project",
    "promptSugession",
    "uploadImage",
    "uploadImage2",
  ]);
  const [project_list, setProjectlist] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const trained_model = ["LensAI-v1.5-512"];
  const composerCheckpoints = ["Composer_v1.0.0.0", "Composer_v1.0.0.1"];
  // Image Blending state

  const allowedChars = /^[a-zA-Z0-9,.(){}[\]@!$+=_/?\- "\n]*$/;
  const BACKEND_URL = process.env.BACKEND_URL;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInpentingOpen, setIsInpentingOpen] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      axios
        .post(`${BACKEND_URL}/api/get_checkpoints/`, {
          project: selectedProject,
        })
        .then((response) => {
          const data = response.data.checkpoints;
          setCheckpoints(data);

          const defaultCheckpoint = data.find(
            (checkpoint) => checkpoint.default
          );
          if (defaultCheckpoint) {
            setSelectedCheckpoint(defaultCheckpoint.id);
          }
        })
        .catch((error) => {
          console.error("Error fetching checkpoints:", error);
        });
    }
  }, [selectedProject]);

  const handleCheckpointChange = (event) => {
    setSelectedCheckpoint(event.target.value);
  };

  const countCommas = (sentence) => {
    try {
      return sentence.split(",").length - 1;
    } catch (error) {
      console.error("Error counting commas:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/fetch-project/`);
        if (!response.ok) {
          console.error("Failed to fetch projects");
          return;
        }
        const data = await response.json();
        const projectObject = data.project.reduce((acc, item) => {
          const projectName = item.project.trim();
          acc[projectName] = item.status;
          return acc;
        }, {});
        setProjectlist(projectObject);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, []);

  const numberOfCommas = countCommas(inputPrompt);
  const number_of_prompt =
    selectedProject.toLowerCase() === "iol lens"
      ? inputPrompt && inputPrompt.trim()
        ? (inputPrompt.match(/"[^"]*"/g) || []).length || 1
        : 0
      : inputPrompt && inputPrompt.trim()
      ? inputPrompt.includes(",") || inputPrompt.includes('"')
        ? inputPrompt.split(",").map((prompt) => prompt.trim()).length
        : 1
      : 0;

  const credit = (number_of_prompt * numImages) / 4;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isImageBlending && (!uploadedImage || !uploadedImage2)) {
      setErrorMessage("Please upload both images for blending");
      setShowAlert(true);
      return;
    }

    if (credit > totalCredit) {
      setErrorMessage(
        `Insufficient credits. You have ${totalCredit}, but ${credit} are required.`
      );
      setShowAlert(true);
    } else {
      setErrorMessage("");
      setTotalCredit((prevCredit) => prevCredit - credit);
      handleGenerate();
    }
  };

  const closeErrorMessage = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    setTotalCredit(profile.credit);
  }, [profile.credit]);

  const toggleSection = (section) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter((sec) => sec !== section));
    } else {
      setOpenSections([...openSections, section]);
    }
  };

  const handleIntegerInput = (e, setter) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseInt(value) >= 0)) {
      setter(value === "" ? "" : parseInt(value));
    }
  };

  const handleImageUpload = (e, isSecondImage = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isSecondImage && file.type === "application/pdf") {
      // Handle PDF for second image
      setUploadedImage2("");
      setIsDefault(null);
      loadPdf(file);
      setImage2(file);
      return;
    }

    if (file) {
      setPdfDoc(null);
      setIsPdf(false);

      if (isSecondImage) {
        setUploadedImage2(URL.createObjectURL(file));
        setIsDefault(URL.createObjectURL(file));
        setImage2(file);
      } else {
        setUploadedImage(URL.createObjectURL(file));
        setImage(file);
      }
      setMaskImage(null);
    }
  };

  return (
    <aside
      id="logo-sidebar"
      className={`fixed overflow-x-hidden top-0 mt-4 left-0 z-30 min-w-64 max-w-96 w-1/4 dark:bg-[#1a1a1a] bg-white h-screen pt-10 transition-transform -translate-x-full sidebar-bg border-r dark:border-gray-400 border-gray-600 sm:translate-x-0 shadow-lg pb-0`}
      aria-label="Sidebar"
    >
      <div
        className={`h-full px-0 py-2 overflow-x-hidden scrollbar-dark overflow-y-auto dark:text-white text-gray-700`}
      >
        <div className="flex text-sm mx-0 px-1 pb-2 dark:border-gray-600 border-gray-400">
          <div className="relative mx-auto w-[49%]">
            <div
              onClick={() => setIsInpentingOpen(!isInpentingOpen)}
              className={`gap-2 cursor-pointer border border-gray-500 items-center w-full px-4 dark:bg-neutral-600 bg-indigo-500 text-white py-2 rounded-sm`}
            >
              <div className="items-center gap-2 flex rounded-sm">
                {isInpenting ? (
                  <GiFountainPen className="" />
                ) : isImageBlending ? (
                  <IoMdPhotos className="" />
                ) : (
                  <FaBraille className="" />
                )}
                {isInpenting
                  ? "Composer"
                  : isImageBlending
                  ? "Renderer"
                  : "Synthesizer"}
              </div>
            </div>

            {isInpentingOpen && (
              <div className="absolute z-10 w-full dark:bg-neutral-800 bg-indigo-300 shadow-lg mt-1 rounded-md">
                <div
                  onClick={() => {
                    setIsInpenting(false);
                    setIsImageBlending(false);
                    setIsInpentingOpen(false);
                    setInputPrompt("");
                    setImageGroups([]);
                    setNumImages(1);
                    setUpscale("INTER_LANCZOS4");
                    setSelectedProject("LS3 BV");
                  }}
                  className={`px-4 py-2 hover:bg-indigo-500 dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:text-white text-black bg-indigo-300`}
                >
                  Synthesizer
                </div>
                <div
                  onClick={() => {
                    setIsInpenting(true);
                    setIsImageBlending(false);
                    setIsInpentingOpen(false);
                    setInputPrompt("");
                    setImageGroups([]);
                    setNumImages(1);
                    setUpscale("INTER_LANCZOS4");
                    setSelectedProject("LS3 BV");
                  }}
                  className={`px-4 py-2 hover:bg-indigo-500 dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:text-white text-black bg-indigo-300`}
                >
                  Composer
                </div>
                <div
                  onClick={() => {
                    setIsInpenting(false);
                    setIsImageBlending(true);
                    setIsInpentingOpen(false);
                    setInputPrompt("");
                    setImageGroups([]);
                    setNumImages(1);
                    setUpscale("INTER_LANCZOS4");
                    setSelectedProject("LS3 BV");
                  }}
                  className={`px-4 py-2 hover:bg-indigo-500 dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:text-white text-black bg-indigo-300`}
                >
                  Renderer
                </div>
              </div>
            )}
          </div>

          <div className="relative mx-auto w-[49%]">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`gap-2 cursor-pointer flex items-center w-full px-4 dark:bg-neutral-700 bg-indigo-300 text-white py-2 rounded-sm`}
            >
              <MdGrain className="" />
              Anomaly
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full dark:bg-neutral-800 bg-indigo-300 shadow-lg mt-1 rounded-md">
                <Link href={"/anomaly"}>
                  <div
                    className={`px-4 py-2 hover:bg-indigo-500 dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:text-white text-black bg-indigo-300`}
                  >
                    Detection
                  </div>
                </Link>
                <Link href={"/anomaly/training"}>
                  <div
                    className={`px-4 py-2 hover:bg-indigo-500 dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:text-white text-black bg-indigo-300`}
                  >
                    Training
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-x-hidden relative scrollbar-hidden"
        >
          <div className="px-0 pt-3  mt-2 overflow-x-hidden border-t dark:border-gray-600 border-gray-400 space-y-4 max-h-[77vh] pb-4 -mb-4 overflow-y-scroll scrollbar-hidden">
            {!isImageBlending && (
              <div
                className={`border-y px-2 py-0 bg-transparent shadow-md overflow-hidden ${
                  openSections.includes("project")
                    ? "border-gray-500"
                    : "border-gray-600"
                } transition-all duration-300`}
              >
                <label
                  htmlFor="ProjectDropdown"
                  className="cursor-pointer flex px-2 py-2 items-center text-sm dark:hover:text-neutral-400 hover:text-gray-800"
                  onClick={() => toggleSection("project")}
                >
                  <AiOutlineProject
                    className={`h-4 w-4 mr-2 dark:text-white text-indigo-500`}
                  />
                  Project
                </label>
                {openSections.includes("project") && (
                  <select
                    id="ProjectDropdown"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-2 text-xs py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300"
                    required
                  >
                    <option value="" disabled>
                      Select a project...
                    </option>

                    {isInpenting || isImageBlending ? (
                      <>
                        <option value="LS3 BV">LS3 BV</option>
                        {isInpenting && !isImageBlending && (
                          <option value="LPC Color">LPC Color</option>
                        )}
                      </>
                    ) : (
                      Object.entries(project_list).map(([key, value]) => (
                        <option
                          key={key}
                          value={key}
                          disabled={value === false}
                        >
                          {key} {value === false && "(Locked)"}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
            )}

            {/* Upload Image sections */}
            {(isInpenting || isImageBlending) && (
              <section>
                {/* First Image Upload */}
                <div
                  className={`relative border-y px-4 py-2 text-sm transition-transform duration-300 ease-in-out ${
                    openSections.includes("uploadImage")
                      ? "dark:border-gray-500 border-gray-500"
                      : "dark:border-gray-600 border-gray-400"
                  } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600`}
                >
                  <div
                    className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500"
                    onClick={() => toggleSection("uploadImage")}
                  >
                    <div className="flex items-center">
                      {openSections.includes("uploadImage") ? (
                        <LuImage className="h-4 w-4" />
                      ) : (
                        <LuImageOff className="h-4 w-4" />
                      )}
                      <span className="ml-3 font-semibold">
                        {isImageBlending ? "Raw Image" : "Upload Image"}
                      </span>
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
                      <label
                        htmlFor="uploadImageInput"
                        className="flex flex-col items-center -mx-2 mb-2 justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-300 transition duration-300 dark:border-gray-500 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900"
                      >
                        {uploadedImage ? (
                          <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="h-24 w-auto object-cover rounded-md"
                          />
                        ) : (
                          <>
                            <AiOutlineCloudUpload className="h-12 w-12 dark:text-gray-500 text-indigo-600" />
                            <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">
                              Click to upload image
                            </span>
                          </>
                        )}
                        <input
                          id="uploadImageInput"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Second Image Upload (only for Image Blending) */}
                {isImageBlending && (
                  <div
                    className={`relative border-y px-4 py-2 text-sm transition-transform duration-300 ease-in-out ${
                      openSections.includes("uploadImage2")
                        ? "dark:border-gray-500 border-gray-500"
                        : "dark:border-gray-600 border-gray-400"
                    } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600`}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500"
                      onClick={() => toggleSection("uploadImage2")}
                    >
                      <div className="flex items-center">
                        {openSections.includes("uploadImage2") ? (
                          <MdOutlineAddAPhoto className="h-4 w-4" />
                        ) : (
                          <MdOutlineNoPhotography className="h-4 w-4" />
                        )}
                        <span className="ml-3 font-semibold">Photo Image </span>
                      </div>
                      <div className="text-gray-500">
                        {openSections.includes("uploadImage2") ? (
                          <MdExpandLess size={12} />
                        ) : (
                          <MdExpandMore size={12} />
                        )}
                      </div>
                    </div>
                    {openSections.includes("uploadImage2") && (
                      <div className="mt-4">
                        <label
                          htmlFor="uploadImageInput2"
                          className="flex flex-col items-center -mx-2 mb-2 justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-300 transition duration-300 dark:border-gray-500 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900"
                        >
                          {uploadedImage2 ? (
                            <img
                              src={uploadedImage2}
                              alt="Uploaded"
                              className="h-24 w-auto object-cover rounded-md"
                            />
                          ) : (
                            <>
                              <AiOutlineCloudUpload className="h-12 w-12 dark:text-gray-500 text-indigo-600" />
                              <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">
                                Click to upload image
                              </span>
                            </>
                          )}
                          <input
                            id="uploadImageInput2"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Prompt Section */}
            {!isImageBlending && (
              <InputPrompt
                openSections={openSections}
                toggleSection={toggleSection}
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                negativeInputPrompt={negativeInputPrompt}
                selectedProject={selectedProject}
                isInpenting={isInpenting}
              />
            )}

            {/* Number of Images section */}
            {!isImageBlending && (
              <div
                className={`border-y ${
                  isInpenting ? "hidden" : ""
                } px-2 py-2 bg-transparent overflow-hidden ${
                  openSections.includes("imageCount")
                    ? "border-gray-500"
                    : "border-gray-600"
                } transition-all duration-300`}
              >
                <label
                  htmlFor="numImages"
                  className="flex text-sm mt-1 font-medium dark:text-gray-200 text-gray-800 mx-1 cursor-pointer"
                >
                  <FaImages className="mt-1 dark:text-gray-100 text-indigo-600" />
                  <span
                    onClick={() => toggleSection("imageCount")}
                    className="ml-2 dark:hover:text-neutral-400 hover:text-indigo-600"
                  >
                    Image Count
                  </span>
                  <span className="ml-auto text-xs">
                    <input
                      type="text"
                      value={numImages}
                      min="1"
                      max="1000"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (!isNaN(value) &&
                            parseInt(value) >= 0 &&
                            parseInt(value) <= 1000)
                        ) {
                          setNumImages(value === "" ? "" : parseInt(value));
                        }
                      }}
                      className="w-16 text-center font-bold cursor-pointer border-neutral-500 bg-transparent p-1 mt-1 border text-xs font-roboto transition-all dark:hover:border-gray-300 hover:border-gray-600 rounded focus:outline-none focus:border-blue-300"
                    />
                  </span>
                </label>
                {openSections.includes("imageCount") && (
                  <input
                    id="numImages"
                    type="range"
                    value={numImages}
                    onChange={(e) => setNumImages(parseInt(e.target.value))}
                    min="1"
                    max="1000"
                    className="w-full my-6 h-[2px] cursor-pointer bg-indigo-600"
                  />
                )}
              </div>
            )}

            {/* Advanced Settings section */}
            {!isImageBlending && (
              <div
                className={`border-none px-3 ${
                  isInpenting ? "hidden" : ""
                } py-2 text-sm bg-transparent overflow-hidden ${
                  openSections.includes("advancedSettings")
                    ? "border-gray-500"
                    : "dark:border-gray-600 border-inido-400"
                } transition-all duration-300`}
              >
                <label
                  htmlFor="advancedSettings"
                  className="cursor-pointer items-center flex"
                  onClick={() => toggleSection("advancedSettings")}
                >
                  {openSections.includes("advancedSettings") ? (
                    <EyeSlash />
                  ) : (
                    <Eye className={``} />
                  )}
                  <span className="ml-2 hover:text-neutral-400">
                    Advanced Settings
                  </span>
                </label>
                {openSections.includes("advancedSettings") && (
                  <>
                    <div className="mt-1 space-y-4 grid grid-cols-2">
                      <div>
                        <label
                          htmlFor="seed"
                          className="block ml-1 text-xs mt-2 font-medium dark:text-gray-300 text-gray-700"
                        >
                          Seed:
                        </label>
                        <div className="relative flex items-center">
                          <FaSeedling className="absolute left-2 top-2" />
                          <input
                            id="seed"
                            type="text"
                            value={seed}
                            onChange={(e) => handleIntegerInput(e, setSeed)}
                            placeholder=""
                            className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="promptStrength"
                          className="block text-xs ml-1 -mt-2 font-medium dark:text-gray-300 text-gray-700"
                        >
                          Prompt Strength:
                        </label>
                        <div className="relative flex items-center">
                          <Strength
                            className="absolute left-1 top-2 h-4"
                            aria-hidden="true"
                          />
                          <input
                            id="promptStrength"
                            type="text"
                            value={promptStrength}
                            onChange={(e) =>
                              handleIntegerInput(e, setPromptStrength)
                            }
                            placeholder=""
                            className="w-28 pl-8 cursor-pointer font-bold border border-transparent bg-transparent p-1 mt-1 text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="generationsStep"
                          className="block ml-1 text-xs mt-0 font-medium dark:text-gray-300 text-gray-700"
                        >
                          Generations Step:
                        </label>
                        <div className="relative flex items-center">
                          <Step
                            className="absolute left-1 top-2 h-4"
                            aria-hidden="true"
                          />
                          <input
                            id="generationsStep"
                            type="text"
                            value={generationsStep}
                            onChange={(e) =>
                              handleIntegerInput(e, setGenerationsStep)
                            }
                            placeholder=""
                            className="w-28 pl-8 cursor-pointer font-bold border border-transparent bg-transparent p-1 mt-1 text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="promptStrength"
                          className="block text-xs ml-1 font-medium dark:text-gray-300 text-gray-700"
                        >
                          Variant:
                        </label>
                        <div className="relative flex items-center">
                          <TbVariable
                            className="absolute left-1 top-2 h-4"
                            aria-hidden="true"
                          />
                          <input
                            type="text"
                            value={"fp16"}
                            placeholder=""
                            className="w-28 pl-8 cursor-pointer font-bold border border-transparent bg-transparent p-1 mt-1 text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <div>
                          <label
                            htmlFor="modelSelection"
                            className="block text-xs mt-2 font-medium dark:text-gray-300 text-gray-700"
                          >
                            Models Selection
                          </label>
                          <GiArtificialHive
                            className="top-6 h-[17px] left-2 absolute"
                            aria-hidden="true"
                          />
                          <select
                            id="modelSelection"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full pl-8 px-2 font-bold text-xs py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300"
                          >
                            <option value="" disabled>
                              Select a model...
                            </option>
                            {trained_model.map((item, index) => (
                              <option value="{index}">{item}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="checkpointSelection"
                            className="block text-xs mt-2 font-medium dark:text-gray-300 text-gray-700"
                          >
                            Select Checkpoint
                          </label>
                          <TbPointerCheck
                            className="mt-2 h-[17px] left-2 absolute"
                            aria-hidden="true"
                          />
                          <select
                            id="checkpointSelection"
                            value={selectedCheckpoint}
                            onChange={handleCheckpointChange}
                            className="w-full pl-8 px-2 text-xs py-1 my-1 font-bold dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300"
                          >
                            <option value="" disabled>
                              Select a checkpoint...
                            </option>
                            {checkpoints.map((checkpoint) => (
                              <option key={checkpoint.id} value={checkpoint.id}>
                                {checkpoint.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Checkpoint Selection - Only for Inpainting project "LPC Color" */}
            {isInpenting && selectedProject === "LPC Color" && (
              <div
                className={`border-y px-2 py-2 bg-transparent shadow-md overflow-hidden ${
                  openSections.includes("modelSelection")
                    ? "border-gray-500"
                    : "border-gray-600"
                } transition-all duration-300`}
              >
                <label
                  htmlFor="modelSelectionDropdown"
                  className="cursor-pointer flex px-1 py-2 items-center text-sm dark:hover:text-neutral-400 hover:text-gray-800"
                  onClick={() => toggleSection("modelSelection")}
                >
                  <GiArtificialHive
                    className={`h-4 w-4 mr-2 dark:text-white text-indigo-500`}
                  />
                  Model Selection
                </label>
                {openSections.includes("modelSelection") && (
                  <select
                    id="modelSelectionDropdown"
                    value={composerCheckpoint}
                    onChange={(e) => setComposerCheckpoint(e.target.value)}
                    className="w-full px-2 text-xs py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300"
                    required
                  >
                    {composerCheckpoints.map((checkpoint, index) => (
                      <option key={index} value={checkpoint}>
                        {checkpoint}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {isImageBlending && (
              <div
                className={`border-y px-2 py-2 bg-transparent shadow-md overflow-hidden ${
                  openSections.includes("type")
                    ? "border-gray-500"
                    : "border-gray-600"
                } transition-all duration-300`}
              >
                <label
                  htmlFor="typeDropdown"
                  className="cursor-pointer flex px-1 py-2 items-center text-sm dark:hover:text-neutral-400 hover:text-gray-800"
                  onClick={() => toggleSection("type")}
                >
                  <TbBoxMultiple
                    className={`h-4 w-4 mr-2 dark:text-white text-indigo-500`}
                  />
                  Generation Type
                </label>
                {openSections.includes("type") && (
                  <select
                    id="typeDropdown"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-2 text-xs py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300"
                    required
                  >
                    <option value="single">Single Illumination</option>
                    <option value="multiple">Multiple Illumination</option>
                  </select>
                )}
              </div>
            )}
            <div
              className={`border-y px-2 py-2 bg-transparent shadow-md overflow-hidden ${
                openSections.includes("upscale")
                  ? "border-gray-500"
                  : "border-gray-600"
              } transition-all duration-300`}
            >
              <label
                htmlFor="upscaleDropdown"
                className="cursor-pointer flex px-1 py-2 items-center text-sm dark:hover:text-neutral-400 hover:text-gray-800"
                onClick={() => toggleSection("upscale")}
              >
                {/* <LuImageUpscale
                  className={`h-4 w-4 mr-2 dark:text-white text-indigo-500`}
                /> */}
                <IoMdResize
                  className={`h-4 w-4 mr-2 dark:text-white text-indigo-500`}
                />
                Upscaling Type
              </label>
              {openSections.includes("upscale") && (
                <select
                  id="upscaleDropdown"
                  value={upscale}
                  onChange={(e) => setUpscale(e.target.value)}
                  className="w-full px-2 text-xs py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300"
                  required
                >
                  <option value="INTER_LANCZOS4">INTER_LANCZOS4</option>
                  <option value="ES-RGAN">REAL-ESRGAN</option>
                  <option value="BICUBIC">BI-CUBIC</option>
                </select>
              )}
            </div>
          </div>

          {/* Generate button */}
          {!isImageBlending && (
            <div className="px-2 pt-3 border-t border-neutral-500">
              <button
                type="submit"
                disabled={loading}
                className="w-full border-neutral-500 bg-gradient-to-r from-[#4F46E5] to-[rgb(225,20,229)] text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center hover:bg-blue-600 transition duration-200 relative"
              >
                <span className="flex gap-2 items-center">
                  <FaBraille className="h-4" />
                  Generate Images
                </span>
                <span className="absolute right-4 bg-[rgb(141,39,143)] text-white ml-2 px-2 py-1 text-xs rounded-md font-light">
                  {credit}
                </span>
              </button>
            </div>
          )}
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
