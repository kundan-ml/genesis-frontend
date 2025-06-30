import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Tick from '@/components/Icons/Tick';
import { AiOutlineCloudUpload, AiOutlineProject, AiOutlineSetting } from 'react-icons/ai';
import { useAuth } from '@/utils/auth';
import UploadImages from '../UploadImages/UploadImages';
import { FaBraille, FaDrawPolygon } from "react-icons/fa";
import { MdDatasetLinked, MdGrain, MdOutlineDatasetLinked } from "react-icons/md";
import axios from 'axios';
import { RiAiGenerate } from "react-icons/ri";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { ImDatabase } from "react-icons/im";
import { FaSeedling } from "react-icons/fa";
import { MdBatchPrediction } from "react-icons/md";
import { FaImages } from "react-icons/fa6";
import { BsPatchCheck } from 'react-icons/bs';
import { GiArtificialHive, GiBackboneShell } from 'react-icons/gi';
import { MdDeleteForever } from "react-icons/md";
const Sidebar = ({
  modelname,
  setModelname,
  openTestingModal,
  openTrainingModal,
  unique_id,
  setIsTrainingStart,
  train_upload,
  test_upload,
  setIsTraining,
  setErrorMessage,
  errorMessage,
  setShowAlert,
  setAllModels,
  allModels,
  selectedDatastes,
  setSelectedDatasets,
  setDatasetsName,
  datasetName,
  allDatasets,
  setAllDatasets,
  setShowTraining,
  selectedProject,
  setSelectedProject,
  newProject,
  setNewProject,
  project_list,
  setProjectlist,
  drawRoi, 
  setDrawRoi
}) => {
  const darkTheme = true;

  const { username, logout } = useAuth();
  const [openSections, setOpenSections] = useState([
    'prompt',
    'imageCount',
    'project',
    'model',
    'advancedSettings',
    'modelname',
    'dataset',
  ]);

  const [selectedImages, setSelectedImages] = useState([]);
  const trained_model = ["LensAI-v1-512"];
  const allowedChars = /^[a-zA-Z0-9,.(){}[\]@!$+=_/?\- ]*$/
  const BACKEND_URL = process.env.BACKEND_URL;
  // const [selectedProject, setSelectedProject] = useState("LS3 BV");
  const [seed, setSeed] = useState(Math.floor(Math.random() * 100001));
  const [batchSize, setBatchSize] = useState(8);
  const [imageSize, setImageSize] = useState(512);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const backbone = ["wideresnet101"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [formattedString, setFormattedString] = useState("");

  useEffect(() => {
    // Fetch data from Django API
    axios.get(`${BACKEND_URL}/train/projects/${username}`) // Replace with your API URL
      .then(response => {
        const projects = response.data.reduce((acc, project) => {
          acc[project.project] = project.status;
          return acc;
        }, {});
        setProjectlist(projects);
        console.log(" THe Project List is  ", projects);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/train/fetch-models/`);
        if (!response.ok) {
          console.error('Failed to fetch models');
          return;
        }
        const data = await response.json();
        setAllModels(data.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, []);



  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (Notification.permission === 'granted') {
      subscribeUserToPush();
    }
  }, []);

  const subscribeUserToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
      });

      // Send the subscription to your server
      await fetch('/api/save-subscription', {
        method: 'POST',
        body: JSON.stringify({ subscription, username }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubscription(subscription);
      console.log('User is subscribed:', subscription);
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
    }
  };

  // Add another useEffect to log when allModels is updated
  useEffect(() => {
  }, [allModels]);


  const toggleSection = (section) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter((sec) => sec !== section));
    } else {
      setOpenSections([...openSections, section]);
    }
  };

  const closeErrorMessage = () => {
    setErrorMessage('');
  };

  const handleSubmit = async () => {

    if (((train_upload !== true) && (selectedDatastes === 'new')) || (selectedDatastes === '')) {

      setErrorMessage("First Upload datasets or select previous Datasets then train the model");
      setShowAlert(true); // Show the custom alert
      return;
    }
    else {


      setIsTrainingStart(true);
      const formData = new FormData();
      // Add additional fields (e.g., username, mode, modelname)
      formData.append('username', username);
      formData.append('modelname', modelname);
      formData.append('unique_id', unique_id);
      formData.append('batchsize', batchSize);
      formData.append('imagesize', imageSize);
      formData.append('seed', seed);
      formData.append('project', selectedProject);
      formData.append('newproject', newProject);

      if (selectedProject === 'new') {
        formData.append('project', newProject);
      }
      if (selectedDatastes === 'new') {
        formData.append('datasets', datasetName);
      }
      else {
        formData.append('datasets', selectedDatastes);
      }

      setShowTraining(true)
      try {
        const response = await fetch(`${BACKEND_URL}/train/anomaly/`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Handle success (e.g., notify user or clear images)
          alert(`${mode} Images uploaded successfully!`);
          const data = await response.json();
          await fetch('/api/notify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              payload: { title: 'Model Training Complete', message: 'Your model has been successfully trained.' }
            }),
          });


        } else {
          console.error('Failed to upload images');
        }
      } catch (error) {
        console.error('Error during image upload:', error);
      } finally {

        setErrorMessage("Model Sucessfully Trained ...")
        setShowAlert(true)
      }
    }
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const fileArray = Array.from(files);

      // Store File objects for further processing
      setUploadedImage(fileArray);

      // Create an array of promises for reading file data
      const imagePromises = fileArray.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result); // Resolve with data URL
          };
          reader.readAsDataURL(file);
        });
      });
      setNumImages(imagePromises.length)
      // Resolve all promises and update state with data URLs
      Promise.all(imagePromises).then((images) => {
        console.log('Images read:', images); // Log image data URLs for debugging
        setSelectedImages(images); // Update state with data URLs for display
      });
    }
  };


  const handleIntegerInput = (e, setter) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (allowedChars.test(value)) {
      setter(value);
    }
  };

  const handleDelete = async (key) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the project "${key}"?`);

    if (isConfirmed) {
      // Send POST request to Django backend to delete the project
      try {
        const response = await fetch(`${BACKEND_URL}/train/delete_project/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectName: key, username: username }), // Send project name as part of the request body
        });

        if (response.ok) {
          // After successful deletion from backend, update the frontend list
          // setProjectList((prevList) => {
          //   const updatedList = { ...prevList };
          //   delete updatedList[projectKey];
          //   return updatedList;
          // });
          window.location.reload(); // Reloads the page to reflect changes
        } else {
          console.error("Error deleting project");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };


  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility state

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const dropdown = document.getElementById("custom-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);


  return (
    <aside
      id="logo-sidebar"
      className={` fixed top-0 mt-4 left-0 z-30 min-w-64 max-w-96 w-1/4  dark:bg-[#1a1a1a] bg-white  h-screen pt-10 transition-transform -translate-x-full sidebar-bg border-r dark:border-gray-400 border-gray-600 sm:translate-x-0 shadow-lg pb-0 `}
      aria-label="Sidebar"
    >

      {/* {errorMessage && (
        <div className="absolute bottom-0 left-0 z-50 flex items-center justify-center px-10 bg-black bg-opacity-50 w-full h-full">
          <div className="bg-red-600 p-6 rounded-md shadow-md text-white relative">
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 "></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Error</h3>
              <button
                onClick={closeErrorMessage}
                className="text-white hover:text-gray-800 focus:outline-none"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a9 9 0 100 18 9 9 0 000-18zM5.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className=" flex flex-col" >
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )} */}

      <div className={`h-full px-0 py-2  scrollbar overflow-y-auto dark:text-white text-gray-700  `}>
        <div className=" flex text-sm mx-0 px-1  pb-2 border-gray-600 " >
          {/* <Link href={'/app'} className={`mx-auto gap-2 flex items-center w-[49%] ${darkTheme ? "text-white px-4 bg-neutral-600" : " text-white bg-indigo-500  "} py-2 rounded-sm `} >
              <FaBraille className='' />
                Gen AI
              </Link>
              <Link href={'/anomaly'} className={`mx-auto gap-2 flex items-center w-[49%] px-4 ${darkTheme ? "bg-neutral-700" : " bg-indigo-300 text-white "} py-2 rounded-sm `} >
              <MdGrain className='' />
                Anomaly  
              </Link> */}

          <Link
            href={'/app'}
            className={`mx-auto gap-2 flex items-center w-[49%] dark:text-white px-4 dark:bg-neutral-700 text-white bg-indigo-300   py-2 rounded-sm`}
          >
            <FaBraille className='' />
            Synthesizer
          </Link>

          {/* Anomaly Dropdown */}
          <div className="relative mx-auto w-[49%]">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`gap-2 flex cursor-pointer border border-gray-500 items-center w-full px-4 dark:bg-neutral-600  bg-indigo-500 text-white  py-2 rounded-sm`}
            >
              <MdGrain className='' />
              Anomaly Training
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full dark:bg-neutral-800 bg-indigo-300 shadow-lg  mt-1 rounded-sm">
                <Link href={'/anomaly'}>
                  <div className={`px-4 py-2 dark:hover:bg-neutral-500 hover:bg-indigo-500 dark:bg-neutral-700 dark:text-white text-black `}>
                    Detection
                  </div>
                </Link>
                {/* <Link href={'/anomaly/training'}>
                  <div className={`px-4 py-2 hover:bg-neutral-500 ${darkTheme ? "bg-neutral-700 text-white" : "text-black"}`}>
                    Training
                  </div>
                </Link> */}
              </div>
            )}
          </div>
        </div>
        <form
          // onSubmit={handleSubmit} 
          className="space-y-4 relative">
          <div className=" pt-3 mt-2   border-t border-gray-600 space-y-4 max-h-[77vh] pb-4 -mb-4 overflow-y-scroll scrollbar-hidden ">
            <div className={`
            
            border-y px-2 py-1 bg-transparent shadow-md overflow-hidden ${openSections.includes('project') ? 'border-gray-500' : 'border-gray-600'
              } transition-all duration-300`}
            >
              <label
                htmlFor="ProjectDropdown"
                className="cursor-pointer flex px-2 py-2 items-center text-sm hover:text-neutral-400 "
                onClick={() => toggleSection('project')}
              >
                <AiOutlineProject className={`h-4 w-4 mr-2 dark:text-white text-indigo-500 `} />
                Project
              </label>

              {openSections.includes('project') && (

                <>
                  {/* <select
                  id="ProjectDropdown"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-2  py-1 my-1 border-[#1a1a1a] text-xs font-roboto transition-all hover:border-neutral-600 bg-transparent rounded focus:outline-none  dark:focus:bg-neutral-700 "
                  required
                  >
                  <option value="" className='' disabled >Select a Project </option>
                  <option value="new" className='' >Add new project</option>
                  {Object.entries(project_list).map(([key, value]) => (
                    <option key={key} value={key} disabled={value === false}>
                      {key} {value === false && '(Locked)'}
                    </option>
                  ))}
                </select> */}

                  <div id="custom-dropdown" className="relative w-full">
                    {/* Dropdown Header */}
                    <div
                      onClick={() => setIsOpen((prev) => !prev)} // Toggle dropdown visibility
                      className="w-full px-3 py-1 my-1 text-xs border border-gray-300 bg-white  rounded cursor-pointer dark:bg-neutral-800 dark:border-neutral-600"
                    >
                      {selectedProject === "new" ? "Add New Project" : selectedProject || "Select a Project"}
                    </div>


                    {/* Dropdown Options */}
                    {isOpen && (
                      <div className=" px-0 w-full mt-1 text-xs bg-white border border-gray-300 rounded shadow-lg z-50 dark:bg-neutral-800 dark:border-neutral-600">
                        {/* Default Option */}
                        {/* <div
            onClick={() => {
              setSelectedProject("");
              setIsOpen(false);
            }}
            className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
          >
            Select a Project
          </div> */}


                        {/* Add New Project */}
                        <div
                          onClick={() => {
                            setSelectedProject("new");
                            setIsOpen(false);
                          }}
                          className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                        >
                          Add New Project
                        </div>

                        {/* Project List */}
                        {Object.entries(project_list).map(([key, value]) => (
                          <div
                            key={key}
                            className={`flex items-center justify-between px-3 py-1 ${value === false
                              ? "cursor-not-allowed text-gray-400"
                              : "cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                              }`}
                            onClick={() => {
                              if (value !== false) {
                                setSelectedProject(key);
                                setIsOpen(false);
                              }
                            }}
                          >
                            <span>{key}</span>
                            {value !== false && (
                              <MdDeleteForever
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent parent click event
                                  handleDelete(key);
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* {selectedProject && selectedProject !== "new" && (
                  <div className="mt-0 flex w-full ">
                    <div
                      onClick={() => handleDelete(selectedProject)}
                      disabled={project_list[selectedProject] === false} // Disable delete if project is locked
                      className={`text-red-600 ml-auto ${project_list[selectedProject] === false ?  'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className='text-sm ' > Delete Project</span>
                      <MdDeleteForever className="inline-block ml-2 mr-2" />
                    </div>
                  </div>
                )} */}
                </>
              )}


              {selectedProject === 'new' && (
                <div
                  className={`border  px-2 mt-1 mx-0 py-0 mb-1 dark:bg-neutral-800 bg-gray-200 shadow-md rounded-md overflow-hidden ${openSections.includes('model') ? 'border-gray-500' : 'border-gray-600'
                    } transition-all duration-300`}
                >

                  <input
                    id="modelInput"
                    type="text"
                    value={newProject}
                    onChange={handleInputChange(setNewProject)}
                    placeholder="Enter your Project Name..."
                    className="w-full scrollbar  p-1 mt-2 border-none min-h-4 my-2 text-xs font-roboto transition-all bordernone bg-transparent rounded focus:outline-none focus:border-none"
                    required
                    spellCheck="false"
                  />
                </div>
              )}
            </div>

            {/* Prompt section */}
            <label
              htmlFor="ProjectDropdown"
              className="cursor-pointer flex px-4 py-0 items-center text-sm hover:text-neutral-400 "
              onClick={() => toggleSection('dataset')}
            >
              <MdDatasetLinked className={`h-4 w-4 mr-2 dark:text-white text-indigo-500 `} />
              Upload Datasets
            </label>
            {openSections.includes('dataset') && (
              <>

                <div
                  className={`border px-2 flex mx-2 py-2 dark:bg-neutral-800 bg-gray-200 shadow-md rounded-md overflow-hidden ${openSections.includes('trainingimg') ? 'border-gray-500' : 'border-gray-600'
                    } transition-all duration-300`}
                >



                  {/* <label
                htmlFor="trainingimgInput"
                className="cursor-pointer text-sm px-1 "
                onClick={openTrainingModal}
                
                >
                Upload Datasets
                </label>
                {train_upload && (
                  <span className='right-0 ml-auto my-auto ' >
                  <Tick />
                  </span>
                  )} */}
                  <select
                    id="ProjectDropdown"
                    value={selectedDatastes}
                    onChange={(e) => setSelectedDatasets(e.target.value)}
                    className="w-full px-2 border-none  py-1 my-1  dark:border-[#1a1a1a] text-xs font-roboto transition-all hover:border-none bg-transparent  rounded focus:outline-none dark:focus:bg-neutral-700"
                    required
                  >
                    <option value="" disabled>Select a Datasets...</option>
                    <option value='new'>
                      Upload New Datasets
                    </option>
                    {train_upload && (
                      <span className='right-0 ml-auto my-auto ' >
                        <Tick />
                      </span>
                    )}
                    {Object.entries(allDatasets).map(([key, value]) => (
                      <option value={value}>
                        {value}
                      </option>
                      // <option value='datases2'>
                      //   Datastes two
                      // </option>
                    ))}
                  </select>
                </div>
                {selectedDatastes === 'new' ? (

                  <div
                    className={`border bg-gray-200 px-2 mx-2 py-1 dark:bg-neutral-800 shadow-md rounded-md overflow-hidden ${openSections.includes('model') ? 'border-gray-500' : 'border-gray-600'
                      } transition-all duration-300`}
                  >

                    <label
                      htmlFor="modelInput"
                      className="cursor-pointer text-sm px-1 flex "
                      onClick={() => toggleSection('model')}
                    >
                      <MdOutlineDatasetLinked className='m-1 ml-0 ' size={14} />
                      <span className='ml-2  hover:text-neutral-400 ' >
                        Datasets Name
                      </span>
                    </label>
                    {openSections.includes('model') && (
                      <input
                        id="modelInput"
                        type="text"
                        value={datasetName}
                        onChange={handleInputChange(setDatasetsName)}
                        placeholder="Enter your Dataset Name..."
                        className="w-full scrollbar h-auto p-1 mt-1 border-none min-h-8 my-2 text-xs font-roboto transition-all bordernone bg-transparent rounded focus:outline-none focus:border-none"
                        required
                        spellCheck="false"
                      />
                    )}
                  </div>

                ) :
                  (

                    <div
                      className={`border bg-gray-200 px-2 mx-2 py-1 dark:bg-neutral-800 shadow-md rounded-md overflow-hidden ${openSections.includes('model') ? 'border-gray-500' : 'border-gray-600'
                        } transition-all duration-300 cursor-pointer text-sm px-1 flex `}

                        onClick={() => setDrawRoi(!drawRoi)}
                    >
                      <FaDrawPolygon className='m-1 ml-0 ' size={14} />
                      <span className='ml-2  hover:text-neutral-400 ' >
                        Draw ROI 
                      </span>
                    </div>
                  )
                }
              </>
            )}

            <div
              className={`border-y px-3  py-2 text-sm  bg-transparent  h-auto ${openSections.includes('advancedSettings') ? 'border-gray-500' : 'border-gray-600'
                } transition-all duration-300`}
            >
              <label
                htmlFor="advancedSettings"
                className="cursor-pointer flex "
                onClick={() => toggleSection('advancedSettings')}
              >
                <MdOutlineSettingsSuggest className='m-1' />
                <span className='ml-2  hover:text-neutral-400 ' >
                  Advanced Settings
                </span>
              </label>
              {openSections.includes('advancedSettings') && (
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
                        <FaSeedling 
                        className="absolute left-2 top-2"
                        // title="SEED - ensure reproducibility in training.(ANY POSITIVE INTERGER)"
                         />
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
                    <div 
                    className="tooltip-container-right"
                    data-title="Number of images processed per iteration. Higher batch sizes speed up training but require more GPU memory. Range-(2,4,8,16)"
                    >
                      <label
                        htmlFor="promptStrength"
                        className="block text-xs ml-1 -mt-2 font-medium dark:text-gray-300"
                      >
                        Batch Size:
                      </label>
                      <div className="relative flex items-center">
                        <MdBatchPrediction className="absolute left-2 top-2" />
                        <input
                          id="promptStrength"
                          type="text"
                          value={batchSize}
                          onChange={(e) => handleIntegerInput(e, setBatchSize)}
                          placeholder="Enter your Batch Size"
                          className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                        />
                      </div>
                    </div>
                    <div
                    className="tooltip-container"
                    data-title="Input Image Resolution (min-256 max-1024)"
                    >
                      <label
                        htmlFor="generationsStep"
                        className="block ml-1 text-xs mt-0 font-medium dark:text-gray-300"
                      >
                        Image Size:
                      </label>
                      <div className="relative flex items-center">
                        <FaImages className="absolute left-2 top-2" />
                        <input
                          id="generationsStep"
                          type="text"
                          value={imageSize}
                          onChange={(e) => handleIntegerInput(e, setImageSize)}
                          placeholder="Enter image_size"
                          className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                        />
                      </div>
                    </div>
                    <div
                    className="tooltip-container-right"
                      data-title="The size of image patches processed by the model (MIN-3  MAX -8)"
                    >
                      
                      <label
                        htmlFor="generationsStep"
                        className="block ml-1 text-xs mt-0 font-medium dark:text-gray-300"
                      >
                        Patch Size:
                      </label>
                      <div className="relative flex items-center">
                        <BsPatchCheck className="absolute left-2 top-2" />
                        <input
                          id="generationsStep"
                          type="text"
                          value={3}
                          // value={imageSize}
                          // onChange={(e) => handleIntegerInput(e, setImageSize)}
                          placeholder="Enter image_size"
                          className="w-28 pl-8 cursor-pointer font-bold border-transparent bg-transparent p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-500 rounded focus:outline-none focus:border-natural-700"
                        />
                      </div>
                    </div>

                  </div>
                  <div>

                  </div>
                  <div className="relative">



                    <div >
                      <label
                        htmlFor="modelSelection"
                        className="block text-xs mt-2 font-medium dark:text-gray-300 text-gray-700"
                      >
                        Backbone
                      </label>
                      <GiBackboneShell className=" top-6 h-[17px] left-2 absolute " aria-hidden="true" />
                      <select
                        id="modelSelection"
                        // value={selectedModel}
                        // onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full pl-8 px-2 font-bold text-xs py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent  focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300 "
                      >
                        <option value="" disabled>Select a backbone...</option>
                        {/* <option value="Stable-Diffusion-v1.5-512">Stable-Diffusion-v1.5-512</option> */}
                        {backbone.map((item, index) => (
                          <option value="{index}">{item}</option>
                        ))}

                      </select>
                    </div>

                    {/* <div>
                      <label
                        htmlFor="checkpointSelection"
                        className="block text-xs mt-2 font-medium dark:text-gray-300 text-gray-700"
                      >
                        Select Checkpoint
                      </label>
                      <TbPointerCheck className=" mt-2 h-[17px] left-2 absolute " aria-hidden="true" />
                      <select
                        id="checkpointSelection"
                        value={selectedCheckpoint}
                        onChange={handleCheckpointChange}
                        className="w-full pl-8 px-2 text-xs py-1 my-1 font-bold dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent  focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300 "
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
                    </div> */}
                  </div>

                </>
              )}
            </div>


            <div
              className={`border px-2 bg-gray-200 mx-2 py-1 dark:bg-neutral-800 shadow-md rounded-md overflow-hidden ${openSections.includes('model') ? 'border-gray-500' : 'border-gray-600'
                } transition-all duration-300`}
            >
              <label
                htmlFor="modelInput"
                className="cursor-pointer flex text-sm px-1 "
                onClick={() => toggleSection('modelname')}
              >
                <RiAiGenerate className='mt-1' />
                <span>
                  <span className='ml-2  hover:text-neutral-400 ' >
                    Model Name
                  </span>
                </span>
              </label>
              {openSections.includes('modelname') && (
                <input
                  id="modelsInput"
                  type="text"
                  value={modelname}
                  onChange={handleInputChange(setModelname)}
                  placeholder="Enter your Model Name..."
                  className="w-full scrollbar h-auto p-1 mt-1 border-none min-h-8 my-2 text-xs font-roboto transition-all bordernone bg-transparent rounded focus:outline-none focus:border-none"
                  required
                  spellCheck="false"
                  readOnly
                />
              )}
            </div>

          </div>


          {/* Generate button */}
          <div className="px-2 pt-3   border-t border-neutral-500 " >

            <button
              onClick={handleSubmit}
              type="button"
              className="w-full border-neutral-500   bg-gradient-to-r from-[#4F46E5]  to-[rgb(225,20,229)] text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center hover:bg-blue-600 transition duration-200 "
            >
              <span>Start Training</span>

            </button>

          </div>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
