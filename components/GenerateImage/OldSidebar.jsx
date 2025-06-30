// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import RandomIcon from '../Icons/RandomIcon';
// const Sidebar = ({
//   inputPrompt, setInputPrompt,
//   numImages, setNumImages,
//   handleGenerate,
//   negativeInputPrompt, setNegativeInputPrompt,
//   selectedProject, setSelectedProject,
//   seed, setSeed,
//   promptStrength, setPromptStrength,
//   generationsStep, setGenerationsStep,
//   selectedModel, setSelectedModel,
//   profile,
//   uploadedImage, setUploadedImage,
//   handleGeneratePrompt,
//   myImage, setMyImage,
// }) => {
//   const [totalCredit, setTotalCredit] = useState(profile.credit);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [openSections, setOpenSections] = useState([
//     'prompt',
//     'imageCount',
//     'project',
//   ]);
//   const [project_list, setProjectlist] = useState({ "LS3 BV": true, "LS3 LPC": true, "IOL Lens": false })
//   const trained_model = ["LensAI-v1-512"]
//   // Allowed special characters
//   const allowedChars = /^[a-zA-Z0-9,.(){}[\]@!$ ]*$/;
//   const BACKEND_URL = process.env.BACKEND_URL
//   // Function to count the number of commas in a sentence
//   const countCommas = (sentence) => {
//     try {
//       return sentence.split(',').length - 1;
//     } catch (error) {
//       console.error('Error counting commas:', error);
//       return 0;
//     }
//   };


//   // Fetch Projects 
//   const fetchModel = async () => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/fetch-model/`);
//       if (!response.ok) {
//         console.error('Failed to fetch images');
//         return;
//       }
//       const data = await response.json();
//       console.log(data.models)
//     } catch (error) {
//       console.error('Error fetching project:', error);
//     } finally {

//     }
//   };
//   const fetchProject = async () => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/fetch-project/`);
//       if (!response.ok) {
//         console.error('Failed to fetch images');
//         return;
//       }
//       const data = await response.json();
//       console.log(data.project)
//       setProjectlist(data.project)
//     } catch (error) {
//       console.error('Error fetching project:', error);
//     } finally {

//     }
//   };


//   // Calculate credit based on input prompt and number of images
//   const numberOfCommas = countCommas(inputPrompt);
//   const number_of_prompt = inputPrompt === '' || inputPrompt === undefined ? 0 : numberOfCommas + 1;
//   const credit = (number_of_prompt * numImages) / 4;
  
//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!inputPrompt.toLowerCase().includes(selectedProject.toLowerCase())) {
//       setErrorMessage(
//         `Select the correct project. Your project doesn't match with your prompt. Your selected project is "${selectedProject}".`
//       );
//     }

//     else if (credit > totalCredit) {
//       setErrorMessage(
//         `Insufficient credits. You have ${totalCredit}, but ${credit} are required.`
//       );
//     } else {
//       setErrorMessage('');
//       setTotalCredit((prevCredit) => prevCredit - credit); // Deduct credits
//       handleGenerate();
//     }
//   };

//   // Close error message
//   const closeErrorMessage = () => {
//     setErrorMessage('');
//   };

//   // Update totalCredit when profile.credit changes
//   useEffect(() => {
//     setTotalCredit(profile.credit);
//   }, [profile.credit]);

//   // Function to toggle section visibility
//   const toggleSection = (section) => {
//     if (openSections.includes(section)) {
//       setOpenSections(openSections.filter((sec) => sec !== section));
//     } else {
//       setOpenSections([...openSections, section]);
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setMyImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle integer input validation
//   // const handleIntegerInput = (e, setter) => {
//   //   const value = e.target.value;
//   //   if (/^\d*$/.test(value)) {
//   //     setter(value);
//   //   }
//   // };
//   const handleIntegerInput = (e, setter) => {
//     const value = e.target.value;

//     // Use regex to match valid integer or float numbers
//     if (/^\d*\.?\d*$/.test(value)) {
//       setter(value);
//     }
//   };
//   // Handle input change with special character validation
//   const handleInputChange = (setter) => (e) => {
//     const value = e.target.value;
//     if (allowedChars.test(value)) {
//       setter(value);
//     }
//   };

//   return (
//     <aside
//       id="logo-sidebar"
//       className=" fixed top-0 mt-4 left-0 z-40 min-w-64 max-w-96 w-1/4  h-screen pt-10 transition-transform -translate-x-full sidebar-bg border-r border-gray-200 sm:translate-x-0 shadow-lg pb-0 "
//       aria-label="Sidebar"
//     >

//       {/* Error message */}
//       {errorMessage && (
//         <div className="absolute bottom-0 left-0 z-50 flex items-center justify-center px-10 bg-black bg-opacity-50 w-full h-full">
//           <div className="bg-red-600 p-6 rounded-md shadow-md text-white relative">
//             <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 "></div>
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Error</h3>
//               <button
//                 onClick={closeErrorMessage}
//                 className="text-white hover:text-gray-800 focus:outline-none"
//               >
//                 <svg
//                   className="h-5 w-5"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 1a9 9 0 100 18 9 9 0 000-18zM5.707 5.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className=" flex flex-col" >

//               <p className="text-sm">{errorMessage}</p>
//               <br />
//               {/* <Link href="profile" className=" bg-blue-800 transition-all rounded-sm hover:bg-gradient-to-r from-[#4F46E5] mx-auto text-center  to-[rgb(225,20,229)] text-white px-6 py-1  "> Buy Credit </Link> */}
//             </div>
//           </div>
//         </div>
//       )}



//       <div className="h-full px-4 py-2  scrollbar overflow-y-auto ">
//         <form onSubmit={handleSubmit} className="space-y-4 relative">
//           {/* Project Dropdown */}
//           <div className="px-4 pt-3 mt-2 -mx-4  border-t space-y-4 max-h-[82vh] pb-8 -mb-4 overflow-y-scroll scrollbar " >
//             <div
//               className={`border px-2 py-1 bg-white shadow-md rounded-md overflow-hidden ${openSections.includes('project') ? 'border-blue-300' : 'border-gray-300'
//                 } transition-all duration-300`}
//             >
//               <label
//                 htmlFor="ProjectDropdown"
//                 className="cursor-pointer text-sm "
//                 onClick={() => toggleSection('project')}
//               >
//                 Project
//               </label>
//               {openSections.includes('project') && (
//                 <select
//                   id="ProjectDropdown"
//                   value={selectedProject}
//                   onChange={(e) => setSelectedProject(e.target.value)}
//                   className="w-full px-2  py-1 my-1 border text-xs font-roboto transition-all border-gray-300 bg-gray-50 rounded focus:outline-none focus:border-blue-300"
//                   required
//                 >
//                   <option value="" disabled>Select a project...</option>
//                   {Object.entries(project_list).map(([key, value]) => (
//                     <option key={key} value={key} disabled={value === false}>
//                       {key}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//             {/* <div className=" border-y border-gray-300 py-4 -mx-4 px-4 " > */}

//             {/* Prompt section */}
//             <div
//               className={`border px-2 py-1 bg-white shadow-md rounded-md overflow-hidden ${openSections.includes('prompt') ? 'border-blue-300' : 'border-gray-300'
//                 } transition-all duration-300`}
//             >
//               <label
//                 htmlFor="promptInput"
//                 className="cursor-pointer text-sm "
//                 onClick={() => toggleSection('prompt')}
//               >
//                 Prompt
//               </label>
//               <span className=' absolute right-6 mt-2 cursor-pointer' onClick={handleGeneratePrompt} > <RandomIcon/> </span>
//               {openSections.includes('prompt') && (
//                 <textarea
//                   id="promptInput"
//                   type="text"
//                   value={inputPrompt}
//                   onChange={handleInputChange(setInputPrompt)}
//                   placeholder="Enter your prompt..."
//                   className="w-full scrollbar text-justify h-auto p-2 mt-1 border min-h-20 text-xs font-roboto transition-all border-gray-300 bg-gray-50 rounded focus:outline-none focus:border-blue-300"
//                   required
//                   spellCheck="false"
//                 />
//               )}
//             </div>

//             {/* Negative prompt section */}
//             <div
//               className={`border mt-3 px-2 py-1 bg-white shadow-md rounded-md overflow-hidden ${openSections.includes('negativePrompt')
//                 ? 'border-blue-300'
//                 : 'border-gray-300'
//                 } transition-all duration-300`}
//             >
//               <label
//                 htmlFor="negativePromptInput"
//                 className="cursor-pointer text-sm "
//                 onClick={() => toggleSection('negativePrompt')}
//               >
//                 Negative Prompt
//               </label>
//               {openSections.includes('negativePrompt') && (
//                 <textarea
//                   id="negativePromptInput"
//                   type="text"
//                   value={negativeInputPrompt}
//                   // onChange={(e) => setNegativeInputPrompt(e.target.value)}
//                   placeholder="(Optional)"
//                   spellCheck="false"
//                   className="w-full p-2 mt-1 text-xs border min-h-12 border-gray-300 bg-gray-50 rounded focus:outline-none focus:border-blue-300"
//                 />
//               )}
//             </div>

//             {/* </div> */}
//             {/* Image upload section */}
//             <div
//               className={`border px-2 py-1 bg-white shadow-md rounded-md overflow-hidden ${openSections.includes('inputImages') ? 'border-blue-300' : 'border-gray-300'
//                 } transition-all duration-300`}
//             >
//               <label
//                 className="cursor-pointer text-sm "
//                 onClick={() => toggleSection('inputImages')}
//               >
//                 Upload Image
//               </label>
//               {openSections.includes('inputImages') && (
//                 <div
//                   className="mt-2 p-2 flex flex-col my-1 py-3 w-full border text-gray-500 hover:text-gray-800 border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:border-blue-300"
//                   onClick={() => document.getElementById('imageUpload').click()}
//                 >
//                   {myImage ? (
//                     <img
//                       src={myImage}
//                       alt="Uploaded"
//                       className="mx-auto -my-3 h-16  w-auto object-cover rounded-none"
//                       onClick={() => document.getElementById('imageUpload').click()}
//                     />
//                   ) : (
//                     <div
//                       className="mx-auto my-0 text-center cursor-pointer"
//                       onClick={() => document.getElementById('imageUpload').click()}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 16 16"
//                         fill="currentColor"
//                         className="h-6 w-6 mx-auto text-gray-400"
//                       >
//                         <path
//                           d="M7.25 10.25a.75.75 0 0 0 1.5 0V4.56l2.22 2.22a.75.75 0 1 0 1.06-1.06l-3.5-3.5a.75.75 0 0 0-1.06 0l-3.5 3.5a.75.75 0 0 0 1.06 1.06l2.22-2.22v5.69Z"
//                         />
//                         <path
//                           d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 12.25v-1.5a.75.75 0 0 0-1.5 0v1.5A1.25 1.25 0 0 1 11.25 13h-6.5A1.25 1.25 0 0 1 3.5 11.25v-1.5Z"
//                         />
//                       </svg>
//                       <p className="text-xs">Click to upload image</p>
//                     </div>
//                   )}
//                   <input
//                     type="file"
//                     id="imageUpload"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Number of Images section */}
//             <div
//               className={`border px-3 py-1 bg-white shadow-md rounded-md overflow-hidden ${openSections.includes('imageCount') ? 'border-blue-300' : 'border-gray-300'
//                 } transition-all duration-300`}
//             >
//               <label
//                 htmlFor="numImages"
//                 className="flex text-sm font-medium text-gray-700 cursor-pointer"

//               >
//                 <span onClick={() => toggleSection('imageCount')}>
//                   Image Count
//                 </span>
//                 <span className="ml-auto text-xs ">
//                   <input
//                     type="text"
//                     value={numImages}
//                     min="1"  // Set the minimum value
//                     max="1000"  // Set the maximum value
//                     onChange={(e) => {
//                       const value = parseInt(e.target.value);
//                       // Ensure the input value is within the desired range
//                       if (!isNaN(value) && value >= 1 && value <= 1000) {
//                         setNumImages(value);
//                       }
//                     }}
//                     className="w-16 text-center font-bold cursor-pointer border-white bg-white p-1 mt-1 border text-xs font-roboto transition-all hover:border-gray-300 rounded focus:outline-none focus:border-blue-300"
//                   />
//                 </span>
//               </label>
//               {openSections.includes('imageCount') && (
//                 <input
//                   id="numImages"
//                   type="range"
//                   value={numImages}
//                   onChange={(e) => setNumImages(parseInt(e.target.value))}
//                   min="1"
//                   max="1000"
//                   className="w-full my-4 h-[2px] bg-blue-500 text-blue-400"
//                 />
//               )}
//             </div>



//             {/* Advanced Settings section */}
//             <div
//               className={`border px-2  py-2 text-sm  bg-white shadow-md rounded-md overflow-hidden ${openSections.includes('advancedSettings') ? 'border-blue-300' : 'border-gray-300'
//                 } transition-all duration-300`}
//             >
//               <label
//                 htmlFor="advancedSettings"
//                 className="cursor-pointer"
//                 onClick={() => toggleSection('advancedSettings')}
//               >
//                 Advanced Settings
//               </label>
//               {openSections.includes('advancedSettings') && (
//                 <>
//                   <div className="mt-1 space-y-4 grid grid-cols-2 ">
//                     <div  >
//                       <label
//                         htmlFor="seed"
//                         className="block ml-1 text-xs mt-2 font-medium text-gray-700"
//                       >
//                         Seed:
//                       </label>
//                       <input
//                         id="seed"
//                         type="text"
//                         value={seed}
//                         onChange={(e) => handleIntegerInput(e, setSeed)}
//                         placeholder="Enter seed value"
//                         className="w-28 cursor-pointer font-bold border-white bg-white p-1 mt-1  border text-xs font-roboto transition-all hover:border-gray-300  rounded focus:outline-none focus:border-blue-300"
//                       />
//                     </div>
//                     <div >
//                       <label
//                         htmlFor="promptStrength"
//                         className="block text-xs ml-1 -mt-2 font-medium text-gray-700"
//                       >
//                         Prompt Strength:
//                       </label>
//                       <input
//                         id="promptStrength"
//                         type="text"
//                         value={promptStrength}
//                         onChange={(e) => handleIntegerInput(e, setPromptStrength)}
//                         placeholder="Enter prompt strength"
//                         className="w-28 cursor-pointer font-bold border-white bg-white p-1 mt-1  border text-xs font-roboto transition-all hover:border-gray-300  rounded focus:outline-none focus:border-blue-300"
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="generationsStep"
//                         className="block ml-1 text-xs mt-0 font-medium text-gray-700"
//                       >
//                         Generations Step:
//                       </label>
//                       <input
//                         id="generationsStep"
//                         type="text"
//                         value={generationsStep}
//                         onChange={(e) => handleIntegerInput(e, setGenerationsStep)}
//                         placeholder="Enter generation step"
//                         className="w-28 font-bold cursor-pointer border-white bg-white p-1 mt-1  border text-xs font-roboto transition-all hover:border-gray-300  rounded focus:outline-none focus:border-blue-300"
//                       />
//                     </div>
//                   </div>
//                   <div>

//                     <div>
//                       <label
//                         htmlFor="modelSelection"
//                         className="block text-xs mt-2 font-medium text-gray-700"
//                       >
//                         Models Selection
//                       </label>
//                       <select
//                         id="modelSelection"
//                         value={selectedModel}
//                         onChange={(e) => setSelectedModel(e.target.value)}
//                         className="w-full p-1 text-xs mt-2 border  font-roboto transition-all border-gray-300 bg-gray-50 rounded focus:outline-none focus:border-blue-300"
//                       >
//                         <option value="" disabled>Select a model...</option>
//                         {/* <option value="Stable-Diffusion-v1.5-512">Stable-Diffusion-v1.5-512</option> */}
//                         {trained_model.map((item, index) => (
//                           <option value="{index}">{item}</option>
//                         ))}

//                       </select>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//           {/* Generate button */}
//           <div className="px-4 pt-3  -mx-4 border-t " >

//             <button
//               type="submit"
//               className="w-full  bg-gradient-to-r from-[#4F46E5]  to-[rgb(225,20,229)] text-white p-2 text-sm font-semibold rounded-md flex justify-center shadow-lg border items-center hover:bg-blue-600 transition duration-200 "
//             >
//               <span>Generate Images</span>
//               <span className="absolute right-4 bg-[rgb(141,39,143)] text-white ml-2 px-2 py-1 text-xs rounded-md  font-light">
//                 {credit}
//               </span>
//             </button>

//           </div>
//         </form>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;