'use client'
import Link from 'next/link';
import React from 'react';
import { useTheme } from "next-themes";
import { useState, useEffect } from 'react';

const Hero = () => {

    const { theme } = useTheme(); // Get current theme
    const [imagePath, setImagePath] = useState("/images/screen.png");


      useEffect(() => {
        if (theme === "dark") {
          setImagePath("/images/screen.png");
        } else {
          setImagePath("/images/screen-light.png");
        }
      }, [theme]); // Add theme as a dependency

    return (
        <section className="max-w-screen-xl mx-auto px-4 dark:bg-neutral-800 py-20 gap-12 dark:text-gray-300 bg-neutral-200 text-gray-700 md:px-8">
            <div className="space-y-5 max-w-4xl mx-auto text-center">
                <h1 className="text-sm dark:text-indigo-400 text-indigo-600 font-medium">
                    A highly trained Generative AI Model
                </h1>
                <h2 className="text-4xl dark:text-gray-100 text-gray-800 font-extrabold mx-auto md:text-5xl">
                    Generate Images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">Genie Genesis</span>
                </h2>
                <p className="max-w-2xl mx-auto">
                    Genie Genesis is a cutting-edge generative AI model designed to create stunning images using advanced machine learning techniques. Our model leverages state-of-the-art algorithms to generate high-quality visuals, making it a versatile tool for various applications.
                </p>
                <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
                    <Link href="app" className="block py-2 px-4 text-white font-medium bg-gradient-to-r from-[#4F46E5] to-[#E114E5] duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg hover:shadow-none">
                        Let's get started
                    </Link>
                    <Link href="contact" className="block py-2 px-4 dark:text-gray-300 dark:hover:text-gray-200 text-gray-900 hover:text-gray-700 font-medium duration-150 dark:active:bg-gray-700 active:bg-gray-400 border rounded-lg">
                        Contact Us
                    </Link>
                </div>
            </div>
            <div className="mt-14  items-center align-middle ">
                <h1 className='text-4xl font-extrabold text-center mb-8 ' >GEN-AI</h1>
                <img src={imagePath} className="w-full   dark:shadow-neutral-950 border-gray-900 dark:border-gray-100 shadow-gray-400 rounded-lg border" alt="GENIEML interface screenshot" />
            </div>
        </section>
    );
}

export default Hero;


// import React from 'react';
// import  Link from 'next/link';
// const Hero = () => {
//     return (
//         <section className="max-w-screen-xl mx-auto px-4 bg-neutral-800 py-28 gap-12 text-gray-300 md:px-8">
//             <div className="space-y-5 max-w-4xl mx-auto text-center">
//                 <h1 className="text-sm text-indigo-400 font-medium">
//                     A highly trained Generative AI Model
//                 </h1>
//                 <h2 className="text-4xl text-gray-100 font-extrabold mx-auto md:text-5xl">
//                     Generate Images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">Genie Genesis</span>
//                 </h2>
//                 <p className="max-w-2xl mx-auto">
//                     Genie Genesis is a cutting-edge generative AI model designed to create stunning images using advanced machine learning techniques. Our model leverages state-of-the-art algorithms to generate high-quality visuals, making it a versatile tool for various applications.
//                 </p>
//                 <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
//                     <Link href="app" className="block py-2 px-4 text-white font-medium bg-gradient-to-r from-[#4F46E5] to-[#E114E5] duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg hover:shadow-none">
//                         Let's get started
//                     </Link>
//                     <Link href="contact" className="block py-2 px-4 text-gray-300 hover:text-gray-200 font-medium duration-150 active:bg-gray-700 border rounded-lg">
//                         Contact Us
//                     </Link>
//                 </div>
//             </div>
//             <div className="mt-14 shadow-2xl">
//                 <img src="images/screen.png" className="w-full shadow-lg rounded-lg border" alt="GENIEML interface screenshot" />
//             </div>
//         </section>
//     );
// }


// export default Hero;