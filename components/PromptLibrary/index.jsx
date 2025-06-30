// import React, { useState } from 'react';

// const PromptLibraryPage = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');

//   // Sample prompts categorized into LS3 BV,  and IOL Lens
//   const prompts = {
//     'LS3 BV': [
//       "single spot,contact lens,cuvette,multiple air bubbles",
//       "phase contrast,contact lens,cuvette,bottle cap edge",
//       "single spot,contact lens,cuvette,dosing bubble",
//       "single spot,contact lens,cuvette,ionization bubbles",
//       "phase contrast,contact lens,cuvette,schlieren with crease",
//       "single spot,contact lens,cuvette,ehacm on lens edge",
//       "single spot,contact lens,cuvette,clipped edge on lens edge",
//       "phase contrast,contact lens,cuvette,edge tear on lens edge",
//       "phase contrast,contact lens,cuvette,edge gap on lens edge",
//       "single spot,contact lens,cuvette,starburst on center of lens",
//       "single spot,contact lens,cuvette,mold contamination",
//       "single spot,contact lens,cuvette,material foam near lens edge",
//       "single spot,contact lens,cuvette,water schlieren on center of lens",
//       "single spot,contact lens,cuvette,multiple air bubbles,bottle cap edge",
//       "single spot,contact lens,cuvette,dosing bubble,bottle cap edge",
//       "single spot,contact lens,cuvette,material foam near lens edge,ionization bubbles",
//       "single spot,contact lens,cuvette,mold contamination,material foam near lens edge",
//       "single spot,contact lens,cuvette,multiple air bubbles,ehacm on lens edge",
//       "phase contrast,contact lens,cuvette,schlieren with crease,ehacm on lens edge",
//       "single spot,contact lens,cuvette,mold contamination,bottle cap edge",
//       "single spot,contact lens,cuvette,mold contamination,ehacm on lens edge",
//       "single spot,contact lens,cuvette,edge gap on lens edge",
//       "single spot,contact lens,cuvette,multiple ehacm on lens edge",
//       "single spot,contact lens,cuvette,schlieren with crease,roadmap",
//       "single spot,contact lens,cuvette,multiple water schlieren on center of lens",
//       "phase contrast,contact lens,cuvette,edge tear on lens edge,bottle cap edge",
//       "single spot,contact lens,cuvette,mold contamination,ionization bubbles",
//       "single spot,contact lens,cuvette,starburst on center of lens,air bubbles"



//     ],
//     'LS3 LPC': [
//       "contact lens,shell,crumpled center,folded center",
//       "contact lens,shell,bright lens edge",
//       "contact lens,shell,folded lens edge,type c",
//       "contact lens,shell,folded lens edge,type b",
//       "contact lens,shell,half folded,folded lens",
//       "contact lens,shell,big saline bubble",
//       "contact lens,shell,multiple lens",
//       "contact lens,shell,more multiple lens",
//       "contact lens,shell,multiple lens,big saline bubble",
//       "contact lens,shell,multiple lens,half folded,folded lens",
//       "contact lens,shell,more multiple lens,big saline bubble",
//       "contact lens,shell,more multiple lens,half folded,folded lens",
//       "contact lens,shell,bright lens edge,big saline bubble",
//       "contact lens,shell,folded centre,crumpled centre,big saline bubble",
//       "contact lens,shell,folded centre,crumpled centre,bright lens edge",
//       "contact lens,shell,folded lens edge,type b,big saline bubble",
//       "contact lens,shell,folded lens edge,type b,bright lens edge",
//       "contact lens,shell,folded lens edge,type c,big saline bubble",
//       "contact lens,shell,folded lens,half folded,folded lens,big saline bubble",

//       "contact lens,shell,big saline bubble",
//       "contact lens,shell,bright lens edge",
//       "contact lens,shell,crumpled center,folded center",
//       "contact lens,shell,folded lens edge,type c",
//       "contact lens,shell,folded lens edge,type b",
//       "contact lens,shell,half folded,folded lens",
//       "contact lens,shell,folded lens edge,type c,big saline bubble",

//       "contact lens,shell,two multiple lens",

//       "contact lens,shell,more multiple lens"

//     ],
//     'IOL Lens': [
//       "monofocal,fov,bright field,lens,haptics,fracture,high resolution",
//       "monofocal,fov,dark field bit-1,lens,haptics,fracture,high resolution",
//       "monofocal,fov,dark field bit-2,lens,haptics,fracture,high resolution",
//       "monofocal,fov,dark field bit-3,lens,haptics,fracture,high resolution",
//       "monofocal,fov,dark field,lens,haptics,fracture,high resolution",

//       "monofocal,fov,bright field,lens,broken haptic,high resolution",
//       "monofocal,fov,dark field bit-1,lens,broken haptic,high resolution",
//       "monofocal,fov,dark field bit-2,lens,broken haptic,high resolution",
//       "monofocal,fov,dark field bit-3,lens,broken haptic,high resolution",
//       "monofocal,fov,dark field,lens,broken haptic,high resolution",

//       "multifocal,toric,fov,bright field,lens,haptics,bubble,high resolution",
//       "multifocal,toric,fov,dark field bit-1,lens,haptics,bubble,high resolution",
//       "multifocal,toric,fov,dark field bit-2,lens,haptics,bubble,high resolution",
//       "multifocal,toric,fov,dark field bit-3,lens,haptics,bubble,high resolution",
//       "multifocal,toric,fov,dark field,lens,haptics,bubble,high resolution",
//       "multifocal,toric,single spot,lens,bubble,high resolution",

//       "multifocal,toric,fov,bright field,lens,haptics,tool mark,high resolution",
//       "multifocal,toric,fov,dark field bit-1,lens,haptics,tool mark,high resolution",
//       "multifocal,toric,fov,dark field bit-2,lens,haptics,tool mark,high resolution",
//       "multifocal,toric,fov,dark field bit-3,lens,haptics,tool mark,high resolution",
//       "multifocal,toric,fov,dark field,lens,haptics,tool mark,high resolution",

//       "monofocal,fov,bright field,lens,haptic tip and gusset damage,high resolution",
//       "monofocal,fov,dark field bit-1,lens,haptic tip and gusset damage,high resolution",
//       "monofocal,fov,dark field bit-2,lens,haptic tip and gusset damage,high resolution",
//       "monofocal,fov,dark field bit-3,lens,haptic tip and gusset damage,high resolution",
//       "monofocal,fov,dark field,lens,haptic tip and gusset damage,high resolution",


//       "monofocal,fov,bright field,lens,haptics,optic edge damage,high resolution",
//       "monofocal,fov,dark field bit-1,lens,haptics,optic edge damage,high resolution",
//       "monofocal,fov,dark field bit-2,lens,haptics,optic edge damage,high resolution",
//       "monofocal,fov,dark field bit-3,lens,haptics,optic edge damage,high resolution",
//       "monofocal,fov,dark field,lens,haptics,optic edge damage,high resolution",
//       "monofocal,single spot,lens,optic edge damage,high resolution",


//       "toric,fov,dark field,lens,haptics,orange peel,high resolution",
//       "toric,single spot,lens,orange peel,high resolution",

//       "multifocal,toric,fov,bright field,lens,haptics,flash,high resolution",
//       "multifocal,toric,fov,dark field bit-1,lens,haptics,flash,high resolution",
//       "multifocal,toric,fov,dark field bit-2,lens,haptics,flash,high resolution",
//       "multifocal,toric,fov,dark field bit-3,lens,haptics,flash,high resolution",
//       "multifocal,toric,fov,dark field,lens,haptics,flash,high resolution",
//       "multifocal,toric,single spot,lens,flash,high resolution",


//       "multifocal,toric,fov,bright field,lens,haptic damage,high resolution",
//       "multifocal,toric,fov,dark field bit-1,lens,haptic damage,high resolution",
//       "multifocal,toric,fov,dark field bit-2,lens,haptic damage,high resolution",
//       "multifocal,toric,fov,dark field bit-3,lens,haptic damage,high resolution",
//       "multifocal,toric,fov,dark field,lens,haptic damage,high resolution",


//       "toric,fov,bright field,lens,narrow haptic,high resolution",
//       "toric,fov,dark field bit-1,lens,narrow haptic,high resolution",
//       "toric,fov,dark field bit-2,lens,narrow haptic,high resolution",
//       "toric,fov,dark field bit-3,lens,narrow haptic,high resolution",
//       "toric,fov,dark field,lens,narrow haptic,high resolution",


//       "multifocal,toric,fov,bright field,lens,haptics,optic surface damage,high resolution",
//       "multifocal,toric,fov,dark field bit-1,lens,haptics,optic surface damage,high resolution",
//       "multifocal,toric,fov,dark field bit-2,lens,haptics,optic surface damage,high resolution",
//       "multifocal,toric,fov,dark field bit-3,lens,haptics,optic surface damage,high resolution",
//       "multifocal,toric,fov,dark field,lens,haptics,optic surface damage,high resolution",
//       "multifocal,toric,single spot,lens,optic surface damage,high resolution",


//       "multifocal,fov,dark field bit-1,lens,haptics,haze,high resolution",
//       "multifocal,fov,dark field bit-2,lens,haptics,haze,high resolution",
//       "multifocal,fov,dark field bit-3,lens,haptics,haze,high resolution",


//       "multifocal,toric,fov,bright field,lens,haptics,strings,fibres,high resolution",
//       "multifocal,toric,fov,dark field bit-1,lens,haptics,strings,fibres,high resolution",
//       "multifocal,toric,fov,dark field bit-2,lens,haptics,strings,fibres,high resolution",
//       "multifocal,toric,fov,dark field bit-3,lens,haptics,strings,fibres,high resolution",
//       "multifocal,toric,fov,dark field,lens,haptics,strings,fibres,high resolution",
//       "multifocal,toric,single spot,lens,strings,fibres,high resolution",

//       "multifocal,fov,bright field,lens,haptics,water underfill,high resolution",
//       "multifocal,fov,dark field bit-1,lens,haptics,water underfill,high resolution",
//       "multifocal,fov,dark field bit-2,lens,haptics,water underfill,high resolution",
//       "multifocal,fov,dark field bit-3,lens,haptics,water underfill,high resolution",
//       "multifocal,fov,dark field,lens,haptics,water underfill,high resolution",


//       "multifocal,fov,bright field,lens,haptics,particulate,high resolution",
//       "multifocal,fov,dark field bit-1,lens,haptics,particulate,high resolution",
//       "multifocal,fov,dark field bit-2,lens,haptics,particulate,high resolution",
//       "multifocal,fov,dark field bit-3,lens,haptics,particulate,high resolution",
//       "multifocal,fov,dark field,lens,haptics,particulate,high resolution",
//       "multifocal,single spot,lens,particulate,high resolution",


//       "monofocal,fov,single spot,lens,scratch,high resolution"

//     ],
//   };

//   // Filter prompts based on search query or selected category
//   const filteredPrompts = Object.keys(prompts).reduce((acc, category) => {
//     if (selectedCategory && selectedCategory !== category) return acc;

//     const categoryPrompts = prompts[category].filter(prompt =>
//       prompt.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     if (categoryPrompts.length > 0) {
//       acc[category] = categoryPrompts;
//     }

//     return acc;
//   }, {});

//   const handleClick = (category) => {
//     // If the clicked category is already selected, set it to null or ""
//     if (selectedCategory === category) {
//       setSelectedCategory('');
//     } else {
//       setSelectedCategory(category);
//     }
//   };
//   return (
//     <div className="min-h-screen mt-8 bg-gradient-to-r dark:from-gray-900 via-neutral-800 to-neutral-900 dark:text-white text-black py-10 px-5 relative overflow-hidden">
//       {/* Dynamic Animated Background */}
//       <div className="absolute top-0 left-0 w-full h-full z-[-1] opacity-50 animate-pulse"></div>

//       {/* Floating Shapes/Particles for Effect */}
//       <div className="absolute top-0 left-0 w-full h-full z-[-2] opacity-30 animate-particle"></div>

//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Page Title with Glowing Text */}
//         <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] drop-shadow-lg">
//           Prompt Library
//         </h1>

//         {/* Search Bar with Animation */}
//         <div className="flex justify-center mb-8 ">
//           <input
//             type="text"
//             className="w-1/2 px-4 rounded-lg dark:text-white text-black  dark:bg-neutral-900 bg-white focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl focus:ring-2 focus:ring-teal-500"
//             placeholder="Search prompts..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>


//   <div className="flex justify-center space-x-6 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">
//       {['LS3 BV', 'LS3 LPC', 'IOL Lens'].map((category) => (
//         <button
//           key={category}
//           className={`px-6 py-2 rounded-full dark:text-white text-black border-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r from-[#4F46E5] to-[#E114E5] focus:ring-2 focus:ring-[#E114E5] ${selectedCategory === category
//             ? 'bg-gradient-to-r from-[#4F46E5] to-[#E114E5] border-[#E114E5] shadow-sm'
//             : 'bg-transparent dark:border-white border-gray-400'
//             }`}
//           onClick={() => handleClick(category)}
//         >
//           {category}
//         </button>
//       ))}
//     </div>
    
//         {/* Display Filtered Prompts */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {Object.keys(filteredPrompts).map((category) => (
//             <div key={category} className="space-y-6 ">
//               <h2 className="text-4xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] mb-4">{category}</h2>
//               <div className="space-y-4">
//                 {filteredPrompts[category].map((prompt, index) => (
//                   <div
//                     key={index}
//                     className="p-6 dark:bg-neutral-700 dark:shadow-gray-800 shadow-gray-300 bg-gray-100 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 dark:hover:bg-neutral-600 hover:bg-white hover:shadow-xl dark:hover:shadow-teal-500 hover:shadow-ray-200"
//                   >
//                     <p className="text-lg">{prompt}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PromptLibraryPage; 




import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";

const PromptLibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Sample prompts categorized into LS3 BV, LS3 LPC, and IOL Lens
  const prompts = {
    'LS3 BV': [
      "single spot,contact lens,cuvette,multiple air bubbles",
      "phase contrast,contact lens,cuvette,bottle cap edge",
      "single spot,contact lens,cuvette,dosing bubble",
      "single spot,contact lens,cuvette,ionization bubbles",
      "phase contrast,contact lens,cuvette,schlieren with crease",
      "single spot,contact lens,cuvette,ehacm on lens edge",
      "single spot,contact lens,cuvette,clipped edge on lens edge",
      "phase contrast,contact lens,cuvette,edge tear on lens edge",
      "phase contrast,contact lens,cuvette,edge gap on lens edge",
      "single spot,contact lens,cuvette,starburst on center of lens",
      "single spot,contact lens,cuvette,mold contamination",
      "single spot,contact lens,cuvette,material foam near lens edge",
      "single spot,contact lens,cuvette,water schlieren on center of lens",
      "single spot,contact lens,cuvette,multiple air bubbles,bottle cap edge",
      "single spot,contact lens,cuvette,dosing bubble,bottle cap edge",
      "single spot,contact lens,cuvette,material foam near lens edge,ionization bubbles",
      "single spot,contact lens,cuvette,mold contamination,material foam near lens edge",
      "single spot,contact lens,cuvette,multiple air bubbles,ehacm on lens edge",
      "phase contrast,contact lens,cuvette,schlieren with crease,ehacm on lens edge",
      "single spot,contact lens,cuvette,mold contamination,bottle cap edge",
      "single spot,contact lens,cuvette,mold contamination,ehacm on lens edge",
      "single spot,contact lens,cuvette,edge gap on lens edge",
      "single spot,contact lens,cuvette,multiple ehacm on lens edge",
      "single spot,contact lens,cuvette,schlieren with crease,roadmap",
      "single spot,contact lens,cuvette,multiple water schlieren on center of lens",
      "phase contrast,contact lens,cuvette,edge tear on lens edge,bottle cap edge",
      "single spot,contact lens,cuvette,mold contamination,ionization bubbles",
      "single spot,contact lens,cuvette,starburst on center of lens,air bubbles"



    ],
    'LS3 LPC': [
      "contact lens,shell,crumpled center,folded center",
      "contact lens,shell,bright lens edge",
      "contact lens,shell,folded lens edge,type c",
      "contact lens,shell,folded lens edge,type b",
      "contact lens,shell,half folded,folded lens",
      "contact lens,shell,big saline bubble",
      "contact lens,shell,multiple lens",
      "contact lens,shell,more multiple lens",
      "contact lens,shell,multiple lens,big saline bubble",
      "contact lens,shell,multiple lens,half folded,folded lens",
      "contact lens,shell,more multiple lens,big saline bubble",
      "contact lens,shell,more multiple lens,half folded,folded lens",
      "contact lens,shell,bright lens edge,big saline bubble",
      "contact lens,shell,folded centre,crumpled centre,big saline bubble",
      "contact lens,shell,folded centre,crumpled centre,bright lens edge",
      "contact lens,shell,folded lens edge,type b,big saline bubble",
      "contact lens,shell,folded lens edge,type b,bright lens edge",
      "contact lens,shell,folded lens edge,type c,big saline bubble",
      "contact lens,shell,folded lens,half folded,folded lens,big saline bubble",

      "contact lens,shell,big saline bubble",
      "contact lens,shell,bright lens edge",
      "contact lens,shell,crumpled center,folded center",
      "contact lens,shell,folded lens edge,type c",
      "contact lens,shell,folded lens edge,type b",
      "contact lens,shell,half folded,folded lens",
      "contact lens,shell,folded lens edge,type c,big saline bubble",

      "contact lens,shell,two multiple lens",

      "contact lens,shell,more multiple lens"

    ],
    'IOL Lens': [
      "monofocal,fov,bright field,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field bit-1,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field bit-2,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field bit-3,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field,lens,haptics,fracture,high resolution",

      "monofocal,fov,bright field,lens,broken haptic,high resolution",
      "monofocal,fov,dark field bit-1,lens,broken haptic,high resolution",
      "monofocal,fov,dark field bit-2,lens,broken haptic,high resolution",
      "monofocal,fov,dark field bit-3,lens,broken haptic,high resolution",
      "monofocal,fov,dark field,lens,broken haptic,high resolution",

      "multifocal,toric,fov,bright field,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,bubble,high resolution",
      "multifocal,toric,single spot,lens,bubble,high resolution",

      "multifocal,toric,fov,bright field,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,tool mark,high resolution",

      "monofocal,fov,bright field,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field bit-1,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field bit-2,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field bit-3,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field,lens,haptic tip and gusset damage,high resolution",


      "monofocal,fov,bright field,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field bit-1,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field bit-2,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field bit-3,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field,lens,haptics,optic edge damage,high resolution",
      "monofocal,single spot,lens,optic edge damage,high resolution",


      "toric,fov,dark field,lens,haptics,orange peel,high resolution",
      "toric,single spot,lens,orange peel,high resolution",

      "multifocal,toric,fov,bright field,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,flash,high resolution",
      "multifocal,toric,single spot,lens,flash,high resolution",


      "multifocal,toric,fov,bright field,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field,lens,haptic damage,high resolution",


      "toric,fov,bright field,lens,narrow haptic,high resolution",
      "toric,fov,dark field bit-1,lens,narrow haptic,high resolution",
      "toric,fov,dark field bit-2,lens,narrow haptic,high resolution",
      "toric,fov,dark field bit-3,lens,narrow haptic,high resolution",
      "toric,fov,dark field,lens,narrow haptic,high resolution",


      "multifocal,toric,fov,bright field,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,single spot,lens,optic surface damage,high resolution",


      "multifocal,fov,dark field bit-1,lens,haptics,haze,high resolution",
      "multifocal,fov,dark field bit-2,lens,haptics,haze,high resolution",
      "multifocal,fov,dark field bit-3,lens,haptics,haze,high resolution",


      "multifocal,toric,fov,bright field,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,single spot,lens,strings,fibres,high resolution",

      "multifocal,fov,bright field,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field bit-1,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field bit-2,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field bit-3,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field,lens,haptics,water underfill,high resolution",


      "multifocal,fov,bright field,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field bit-1,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field bit-2,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field bit-3,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field,lens,haptics,particulate,high resolution",
      "multifocal,single spot,lens,particulate,high resolution",


      "monofocal,fov,single spot,lens,scratch,high resolution"

    ],
  };

  // Convert prompts into an array of objects with category labels
  const allPrompts = useMemo(
    () =>
      Object.entries(prompts).flatMap(([category, items]) =>
        items.map((item) => ({ category, text: item }))
      ),
    [prompts]
  );

  // Fuse.js setup for fuzzy searching
  const fuse = useMemo(
    () =>
      new Fuse(allPrompts, {
        keys: ["text"],
        threshold: 0.5, // Adjust sensitivity for search results
      }),
    [allPrompts]
  );

  // Filter prompts based on search and selected category
  const filteredPrompts = useMemo(() => {
    let results = allPrompts;

    if (searchQuery.trim()) {
      results = fuse.search(searchQuery).map((result) => result.item);
    }

    if (selectedCategory) {
      results = results.filter((prompt) => prompt.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory, fuse]);

  // Group filtered prompts by category
  const groupedPrompts = filteredPrompts.reduce((acc, prompt) => {
    if (!acc[prompt.category]) {
      acc[prompt.category] = [];
    }
    acc[prompt.category].push(prompt.text);
    return acc;
  }, {});

  // Handle category selection toggle
  const handleClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-r dark:from-gray-900 via-neutral-800 to-neutral-900 dark:text-white text-black py-10 px-5 relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1] opacity-50 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full z-[-2] opacity-30 animate-particle"></div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] drop-shadow-lg">
          Prompt Library
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            className="w-1/2 px-4 rounded-lg dark:text-white text-black dark:bg-neutral-900 bg-white focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl focus:ring-2 focus:ring-teal-500"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Selection */}
        <div className="flex justify-center space-x-6 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">
          {["LS3 BV", "LS3 LPC", "IOL Lens"].map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full dark:text-white text-black border-2 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r from-[#4F46E5] to-[#E114E5] focus:ring-2 focus:ring-[#E114E5] ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[#4F46E5] to-[#E114E5] border-[#E114E5] shadow-sm"
                  : "bg-transparent dark:border-white border-gray-400"
              }`}
              onClick={() => handleClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Display Filtered Prompts Grouped by Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedPrompts).map(([category, prompts]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] mb-4">
                {category}
              </h2>
              <div className="space-y-4">
                {prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-6 dark:bg-neutral-700 dark:shadow-gray-800 shadow-gray-300 bg-gray-100 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 dark:hover:bg-neutral-600 hover:bg-white hover:shadow-xl dark:hover:shadow-teal-500 hover:shadow-ray-200"
                  >
                    <p className="text-lg">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredPrompts.length === 0 && (
            <p className="text-center text-gray-500 col-span-3">
              No matching prompts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptLibraryPage;
