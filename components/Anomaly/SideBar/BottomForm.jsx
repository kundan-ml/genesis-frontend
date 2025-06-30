import React, { useEffect, useState } from 'react';
import { AiOutlineCloudUpload, AiOutlineProject, AiOutlineSetting } from 'react-icons/ai';
import { FaRegImage } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { IoIosCheckmarkCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import Link from 'next/link';
import Trash from '@/components/Icons/Trash';
import { FaBraille } from "react-icons/fa";
import { MdGrain } from "react-icons/md";
import { GrVirtualMachine } from "react-icons/gr";
import { MdOutlineDataThresholding } from "react-icons/md";
import axios from 'axios';


const AnomalyBottom = ({
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
  }) => {
    const [Credit, setCredit] = useState(0);
    const [openSections, setOpenSections] = useState([
      'uploadImage',
      'selectProject',
      
  
    ]);
  
    const [project_list, setProjectlist] = useState({});
    const BACKEND_URL = process.env.BACKEND_URL
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [trained_model, set_trained_model] = useState()
    const [trainedModels, setTrainedModels] = useState({});
    const [selectedProject, setSelectedProject] = useState('');
    const toggleSection = (section) => {
      setOpenSections((prev) =>
        prev.includes(section)
          ? prev.filter((sec) => sec !== section)
          : [...prev, section]
      );
    };
  
  
  
    // const fetchProject = async () => {
    //   try {
    //     const response = await fetch(
    //       `${BACKEND_URL}/anomaly/fetch-model/${username}`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ selected_project: selectedProject }), // Send selected project in body
    //       }
    //     );
  
    //     if (!response.ok) {
    //       console.error("Failed to fetch models");
    //       return;
    //     }
  
    //     const data = await response.json();
  
    //     // Debug log
    //     console.log("Fetched Data:", data);
  
    //     set_trained_model(data);
  
    //     if (Array.isArray(data)) {
    //       // Process models as needed
    //       const filteredData = data.filter(
    //         (item) => item.project === selectedProject
    //       );
    //       const modelsObject = filteredData.reduce((acc, item) => {
    //         const modelName = item.modelname?.trim();
    //         if (modelName) {
    //           acc[modelName] = item.can_access;
    //         }
    //         return acc;
    //       }, {});
  
    //       setTrainedModels(modelsObject); // Update state with the processed models
  
    //       const firstModelKey = Object.keys(modelsObject.unique_id)[0];
    //       if (firstModelKey) {
    //         setSelectedModel(firstModelKey);
    //         console.log("Selected model:", firstModelKey);
    //         // setSelectedModel('');
    //       }
    //       else {
    //         setSelectedModel(null)
    //       }
    //     } else {
    //       console.error("Unexpected data format:", data);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching project:", error);
    //     setSelectedModel(null)
    //   }
    // };
    // useEffect(() => {
    //   // Trigger fetch when `username` or `selectedProject` changes
    //   if (username && selectedProject) {
    //     fetchProject();
    //   }
    // }, [username, selectedProject]);
  
  
  
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/anomaly/fetch-model/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selected_project: selectedProject }), // Send selected project in body
          }
        );
    
        if (!response.ok) {
          console.error("Failed to fetch models");
          setSelectedModel(null); // Reset selected model in case of error
          return;
        }
    
        const data = await response.json();
        const accessibleData = data.filter((item) => item.can_access);
        // Debug log
        // console.log("Fetched Data:", data);
    
        set_trained_model(accessibleData);
    
        if (Array.isArray(accessibleData)) {
          // Process models as needed
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
    
          setTrainedModels(modelsObject); // Update state with the processed models
    
          if (filteredData.length > 0) {
            // Set the first unique_id from filtered data
            const firstUniqueId = filteredData[0].unique_id;
            setSelectedModel(firstUniqueId); // Set the first unique_id as selected
            console.log("Selected model unique_id:", firstUniqueId);
          } else {
            setSelectedModel(null); // Reset if no filtered data
          }
        } else {
          console.error("Unexpected data format:", data);
          setSelectedModel(null); // Reset in case of unexpected data format
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setSelectedModel(null); // Reset in case of fetch error
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
          const response = await axios.get(`${BACKEND_URL}/train/projects/${username}`); // Replace with your API URL
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
          console.error('Error fetching projects:', error);
        }
      };
  
      fetchProjects();
      fetchProject();
    }, []); // Dependency array is empty to ensure this runs only on mount
  
    const handleImageUpload = (e) => {
      e.preventDefault(); // Prevent form submission on file upload
      const files = Array.from(e.target.files);
  
      // Calculate the total number of images including the newly uploaded ones
      const totalImages = uploadedImage.length + files.length;
  
      if (totalImages > 100) {
        alert('You can only upload a maximum of 100 images.');
        return; // Prevent adding more images if the limit is exceeded
      }
  
      if (files.length > 0) {
        // Identify duplicates and collect their names
        const duplicateFiles = files.filter((file) =>
          uploadedImage.some(
            (uploadedFile) =>
              uploadedFile.name === file.name && uploadedFile.lastModified === file.lastModified
          )
        );
  
        // Alert with duplicate image names
        if (duplicateFiles.length > 0) {
          const duplicateNames = duplicateFiles.map((file) => file.name).join(', ');
          alert(`The following images are already present and will not be added: ${duplicateNames}`);
        }
  
        // Add only unique files
        const newFiles = files.filter(
          (file) =>
            !uploadedImage.some(
              (uploadedFile) =>
                uploadedFile.name === file.name && uploadedFile.lastModified === file.lastModified
            )
        );
  
        if (newFiles.length > 0) {
          setUploadedImage((prev) => [...prev, ...newFiles]);
          setCredit((prev) => prev + newFiles.length * 0.5);
        }
      }
    };
  
  
    const handleClear = () => {
      setCredit(0)
      setUploadedImage([])
    }
  
  
    const handleRemoveImage = (index) => {
      setUploadedImage((prev) => prev.filter((_, i) => i !== index));
      setCredit((prev) => prev - 0.5);
    };
  
    // Detect current theme
  

  return (
    <div className="py-2 px-0 z-40 sm:px-6 lg:px-8 dark:bg-[#1a1a1a] bg-white ">
  <div className="h-full px-0 py-2 overflow-y-auto scrollbar-dark">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent form submission
            handleSubmit();
          }}
          className="space-y-8"
        >
          <div className="space-y-4 -mb-4 max-h-[75vh] overflow-auto scrollbar-hidden ">

            <div className=" flex text-sm mx-0 px-1 border-b pb-4 border-gray-600 " >

              <Link
                href={'/app'}
                className={`mx-auto gap-2 flex items-center w-[49%] dark:text-white px-4 dark:bg-neutral-700  text-white bg-indigo-300  py-2 rounded-sm`}
              >
                <FaBraille className='' />
                Gen AI
              </Link>

              {/* Anomaly Dropdown */}
              <div className="relative mx-auto w-[49%]">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`gap-2 flex cursor-pointer border border-gray-500 items-center w-full px-4 dark:bg-neutral-600  bg-indigo-500 text-white  py-2 rounded-sm`}
                >
                  <MdGrain className='' />
                  Anomaly Detection
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full dark:bg-neutral-800 bg-indigo-300  shadow-lg  mt-1 ">
                    <Link href={'/anomaly/training'}>
                      <div className={`px-4 py-2 dark:hover:bg-neutral-500 hover:bg-indigo-500  dark:bg-neutral-700 dark:text-white text-black `}>
                        Training
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`relative border-y px-4 py-2 text-sm   transition-transform duration-300 ease-in-out ${openSections.includes('selectProject') ? ('dark:border-gray-500 border-gray-500') : ('dark:border-gray-600 border-gray-400')
                } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600 `}
            >
              <div
                className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500 "
                onClick={() => toggleSection('selectProject')}
              >
                <div className="flex items-center">
                  <AiOutlineProject className={`h-4 w-4 dark:text-white text-indigo-500  `} />
                  <span className="ml-3 font-semibold ">Select Project</span>
                </div>
                <div className="dark:text-gray-500 text-indigo-500">
                  {openSections.includes('selectProject') ? <MdExpandLess size={12} /> : <MdExpandMore size={12} />}
                </div>
              </div>
              {openSections.includes('selectProject') && (
                <select
                  id="ProjectDropdown"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-2 -mx-2  py-1 mt-2 dark:border-[#1a1a1a] border-gray-200 text-xs font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-700 bg-transparent rounded focus:outline-none dark:focus:bg-neutral-700 focus:bg-white"
                  required
                >
                  <option value="" disabled>Select a project...</option>
                  {Object.entries(project_list).map(([key, value]) => (
                    <option key={key} value={key} disabled={value === false}>
                      {key} {value === false && '(Locked)'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Upload Image section */}
            <div
              className={`relative border-y px-4 py-2 text-sm   transition-transform duration-300 ease-in-out ${openSections.includes('selectProject') ? ('dark:border-gray-500 border-gray-500') : ('dark:border-gray-600 border-gray-400')
                } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600 `}
            >
              <div
                className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500 "
                onClick={() => toggleSection('uploadImage')}
              >
                <div className="flex items-center">
                  <FaRegImage className={`h-4 w-4 dark:text-white text-indigo-500 `} />
                  <span className="ml-3 font-semibold ">Upload Image</span>
                </div>
                <div className="text-gray-500">
                  {openSections.includes('uploadImage') ? <MdExpandLess size={12} /> : <MdExpandMore size={12} />}
                </div>
              </div>
              {openSections.includes('uploadImage') && (
                <div className="mt-4">
                  {uploadedImage.length === 0 ? (
                    <label
                      htmlFor="uploadImageInput"
                      className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700  hover:bg-gray-300 transition duration-300 dark:border-gray-600 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900 `}
                    >
                      <AiOutlineCloudUpload className={`h-12 w-12 dark:text-gray-500 text-indigo-600 `} />
                      <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">Click to upload images</span>
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
                        onClick={() => document.getElementById('uploadImageInput').click()}
                        className={`  text-white p-2 rounded-sm flex items-center  transition duration-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 bg-indigo-500 hover:bg-indigo-600`}
                      >
                        <AiOutlineCloudUpload className="h-4 w-4" />
                        <span className="ml-2 text-xs font-light ">Add More Images</span>
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
                        onClick={() => handleClear()}
                        className={` text-white p-2 rounded-sm flex items-center  transition duration-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 bg-indigo-500 hover:bg-indigo-600`}
                      >
                        {/* <AiOutlineCloudUpload className="h-6 w-6" /> */}
                        <Trash className="h-4 w-4" />
                        <span className="ml-2 text-xs font-light">Clear</span>
                      </button>
                    </div>
                  )}
                  <div className="mt-2 grid grid-cols-4 gap-2 max-h-80 overflow-y-auto scrollbar-dark">
                    {uploadedImage.map((image, index) => (
                      <div key={index} className="relative  group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Uploaded ${index}`}
                          className={`w-20 h-20 object-cover rounded-md border shadow-md transition-transform duration-300 group-hover:scale-105 dark:border-gray-600 border-indigo-300 `}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className={`absolute top-2 right-2 p-1 rounded-full dark:bg-gray-800 dark:text-gray-400 dark:hover:text-red-500 bg-gray-200 text-gray-600 hover:text-red-600 `}
                        >
                          <IoMdRemoveCircleOutline size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Settings section */}
            <div
              className={`relative border-y px-4 py-4 text-sm    transition-transform duration-300 ease-in-out ${openSections.includes('selectProject') ? ('dark:border-gray-500 border-gray-500') : ('dark:border-gray-600 border-gray-400')
                } transform-gpu hover:scale-100 dark:hover:border-gray-600 hover:border-gray-600 `}
            >
              <div
                className="flex items-center justify-between cursor-pointer dark:hover:text-neutral-500 hover:text-indigo-500"
                onClick={() => toggleSection('advancedSettings')}
              >
                <div className="flex items-center">
                  <AiOutlineSetting className={`h-4 w-4  dark:text-white text-indigo-500 `} />
                  <span className="ml-3 font-semibold text-normal">Advanced Settings</span>
                </div>
                <div className="dark:text-gray-500 text-indigo-500">
                  {openSections.includes('advancedSettings') ? <MdExpandLess size={12} /> : <MdExpandMore size={12} />}
                </div>
              </div>
              {openSections.includes('advancedSettings') && (
                <div className="mt-2 space-y-2">
                  <div className="flex flex-col">
                    <label htmlFor="selectModel" className="text-sm font-medium">Select Model</label>
                    {selectedProject === "" ? (
                      <></>
                    ) : (
                      <select
                        id="selectModel"
                        value={selectedModel || ""} // Ensure selectedModel is initialized as an empty string
                        onChange={(e) => {
                          console.log("Selected value:", e.target.value); // Log to debug the value
                          setSelectedModel(e.target.value);
                        }}
                        className="w-full px-2 py-1 mt-2 text-sm border rounded-sm focus:outline-none transition-all dark:border-neutral-800 dark:hover:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300 dark:focus:border-gray-600 border-gray-300 bg-white text-gray-900 focus:border-gray-500"
                      >
                        <option value="" disabled>Select a model...</option>
                        {trained_model.map((model, index) => (
                          <option key={index} value={model.unique_id}  >
                            {model.modelname} 
                            {/* {model.can_access === false && '(Locked)'} */}
                          </option>
                        ))}
                      </select>
                    )}

                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="threshold_value" className="text-sm font-medium">Threshold Value</label>
                    <MdOutlineDataThresholding className="absolute left-6 bottom-6 h-4 text-indigo-500 dark:text-gray-100 " />
                    <input
                      type="text"
                      name=""

                      value={threshold}
                      // onChange={setthreshold}
                      onChange={(e) => setthreshold(e.target.value)}
                      className={`w-full pl-8 px-2 py-1 mt-2 text-sm border rounded-sm focus:outline-none transition-all dark:border-neutral-800 dark:hover:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300 dark:focus:border-gray-600 border-gray-300 bg-white text-gray-900 focus:border-gray-500 `} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-2 pt-3    border-t dark:border-neutral-500 text-indigo-500 " >

            <button
              type="submit"
              className="w-full border-neutral-500   bg-gradient-to-r from-[#4F46E5]  to-[rgb(225,20,229)] text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center hover:bg-blue-600 transition duration-200 "
            >
              <span>Detect Anomaly </span>
              <span className="absolute right-4 bg-[rgb(141,39,143)] text-white ml-2 px-2 py-1 text-xs rounded-md  font-light">
                {Credit}
              </span>
            </button>

          </div>
        </form>
      </div>

    </div>
  )
}

export default AnomalyBottom