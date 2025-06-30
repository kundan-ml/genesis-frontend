// import React from 'react';
// import './Loader.module.css';
// import AnomalyLoader from '@/components/Loader/LoaderOne/AnomalyLoader';

// const ImageGenerationSkeleton = ({ uploadedImage, images }) => {
//   console.log ("Images are ", images)
//   return (
//     <section className="w-full flex md:pt-12 relative">
//       <div className="relative ">
//         <div>
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-6">

//             {uploadedImage.map((image, index) => (
//               <div key={index} className="relative bg-[#1a1a1a] border group gradient-border  md:w-auto max-w-[330px] overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer">

//                 <div className="w-full min-w-80 min-h-48 object-cover">
//                   <div
//                     className="w-auto min-w-20 min-h-20 object-cover"
//                   >
//                     <div className="absolute inset-0 dark:bg-black bg-white bg-opacity-50 flex items-center justify-center">
//                       <AnomalyLoader />
//                     </div>
//                   </div>
//                 </div>

//               </div>


//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ImageGenerationSkeleton;



import React from 'react';
import './Loader.module.css';
import AnomalyLoader from '@/components/Loader/LoaderOne/AnomalyLoader';

const BACKEND_URL = process.env.BACKEND_URL
const ImageGenerationSkeleton = ({ uploadedImage, images }) => {
  console.log("Images are ", images);

  return (
    <section className="w-full flex md:pt-12 relative">
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-6">
          {uploadedImage.map((image, index) => (
            <div
              key={index}
              className="relative bg-[#1a1a1a] border group gradient-border md:w-auto max-w-[330px] overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer"
            >
              <div className="w-80 h-48 object-cover">
                <div className="w-80 h-48 object-cover ">
                  {images[index]?.url ? (
                    <img
                      src={`${BACKEND_URL}/${images[index].url.replace(/\\/g, '/')}`}
                      alt={`Generated Image ${index}`}
                      className="w-80 h-48 object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 dark:bg-black bg-white bg-opacity-50 flex items-center justify-center">
                      <AnomalyLoader />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGenerationSkeleton;

// import React from 'react';
// import './Loader.module.css';
// import AnomalyLoader from '@/components/Loader/LoaderOne/AnomalyLoader';

// const ImageGenerationSkeleton = ({ uploadedImage, images }) => {
//   console.log("Images are ", images);

//   return (
//     <section className="w-full flex md:pt-12 relative justify-center">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {uploadedImage.map((image, index) => (
//           <div
//             key={index}
//             className="relative bg-[#1a1a1a] border group gradient-border overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer"
//           >
//             {images[index]?.url ? (
//               <img
//                 src={`http://127.0.0.1:8000/${images[index].url.replace(/\\/g, '/')}`}
//                 alt={`Generated Image ${index}`}
//                 className="w-auto h-auto max-w-full max-h-full object-contain"
//               />
//             ) : (
//               <div className="w-full h-48 flex items-center justify-center bg-white bg-opacity-5 dark:bg-black">
//                 <AnomalyLoader />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default ImageGenerationSkeleton;
