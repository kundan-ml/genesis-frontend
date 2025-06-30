'use client'
import React, { useState } from 'react'
import { useEffect } from 'react';
import useAuthRedirect from '@/utils/useAuthRedirect';
import { useAuth } from '@/utils/auth';
import { parseCookies } from 'nookies';
import Link from 'next/link';
import TerminalIcon from '../Icons/TerminalIcon';
import { BsCpu } from 'react-icons/bs'; // CPU icon
import { BiMessageDetail } from "react-icons/bi";
import { BiAdjust } from "react-icons/bi";
import { IoNotificationsCircleOutline, IoTerminalOutline } from "react-icons/io5";
import { RiTerminalBoxLine } from 'react-icons/ri';

const NavBar = ({ profile, remainingCredits, darkTheme, setDarkTheme, setShowTraining, setShowSystemUsage, setSharedPopup, pendingMessage }) => {
  // const { token } = useAuthRedirect();
  const { username, logout } = useAuth();

  const BACKEND_URL = process.env.BACKEND_URL
  const dynamicClass = pendingMessage > 0 ? 'dark:text-gray-300 text-gray-700 ' : 'dark:text-gray-300 text-gray-700 ';

  const Tooltip = ({ text }) => (
    <span className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
      {text}
    </span>
  );

  return (
    <nav className="fixed top-0 z-40 w-full py-1 border-b dark:border-gray-400 border-gray-600 dark:bg-neutral-900 bg-white ">
      <div className="px-3 py-0 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            {/* <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm dark:text-neutral-400 rounded-lg sm:hidden dark:hover:bg-neutral-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns=""
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button> */}
            <Link href="/" className="flex ms-2 md:me-24 items-center">
              {/* <span className="self-center text-xl text-transparent bg-clip-text bg-gradient-to-r dark:from-[#4F46E5] dark:to-[#E114E5] from-white to-[#E114E5] font-extrabold italic sm:text-2xl whitespace-nowrap">
                Genie Genesis
              </span> */}
              <img
                src="/logo.png"
                className="h-10 dark:invert"
                alt="Logo"
              />

            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">



              {/* 
            <button onClick={() => setShowSystemUsage(true)} className="  px-0 mt py-0 items-center mt-1  text-gray-300 rounded-sm  cursor-pointer">
            <BiAdjust size={24} />
              </button>
              <button onClick={() => setShowSystemUsage(true)} className="  px-3 mt py-0 items-center mt-1  text-gray-300 rounded-sm  cursor-pointer">
                <IoNotificationsCircleOutline  size={24} title="System Usages" />
              </button>
               */}


              {/* <div className="notification flex items-center justify-center relative">
  <div className="bell-container">
    <div className="bell w-4 h-4 border-2 border-white rounded-t-lg bg-transparent relative top-[-3px] flex items-center justify-center">
      <span className="block w-5 h-[2.17px] bg-white absolute left-1/2 transform -translate-x-1/2 top-[100%]" />
      <span className="block w-7 h-[2.17px] bg-white absolute left-1/2 transform -translate-x-1/2 top-[calc(100%+4px)]" />
    </div>
  </div>
  <span className="absolute right-2 top-2 w-3 h-3 flex items-center justify-center text-xs text-white bg-red-500 rounded-full z-10">1</span>
</div> */}

              <button
                onClick={() => setSharedPopup(true)}
                className={`px-0 py-0 relative  mt-2 flex items-center dark:text-gray-300 text-gray-700 rounded-sm cursor-pointer ${pendingMessage > 0 ? '' : ''}`}

              >

                <BiMessageDetail
                  size={24}
                  title="Collaboration"
                  className={dynamicClass}
                  // className="dark:text-gray-300 text-gray-300 "
                />
                {pendingMessage > 0 && (
                  <span className="absolute -right-1 top-3 w-3 h-3 flex items-center justify-center text-xs text-white bg-red-500 rounded-full z-10">{pendingMessage}</span>
                )}
                {/* Displaying the number (e.g., 2 messages) */}
              </button>

              <button onClick={() => setShowSystemUsage(true)} className="  px-3 mt py-0 items-center mt-1  dark:text-gray-300 text-gray-100 rounded-sm  cursor-pointer">
                <BsCpu size={20} title="System Usages" 
                className={dynamicClass}
                />
              </button>
              <button
                className='  px-0 mt py-0 items-center mt-1  dark:text-gray-300 text-gray-100 rounded-sm  cursor-pointer'
                onClick={() => setShowTraining(true)}
              >
                {/* <TerminalIcon
                  title="Open terminal"
                />
                <Tooltip text="Open  terminal" /> */}
      <RiTerminalBoxLine size={22} title="Open Terminal" 
      className={dynamicClass}
      />
              </button>
              <Link href="/profile" className="mx-4">
                <div className="flex items-center py-1 gap-4">
                  <img
                    className="w-6 h-6 -my-4 rounded-full"
                    src={profile.photo ? `${profile.photo}` : '/images/profile.png'}
                    alt=""
                  />
                  <div className="sm:block hidden text-xs dark:text-neutral-200 text-gray-800 ">
                    <div>{profile.name ? profile.name : "Loading ..."}</div>
                    <div className="text-xs dark:text-neutral-400 text-gray-400">
                      Credit ~ {profile?.remainingCredits ?? parseFloat(profile.credit).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Link>
              <button
                onClick={logout}
                className="dark:text-white text-black dark:bg-neutral-600 bg-gray-400 hover:bg-neutral-500 font-bold focus:ring-4 focus:ring-neutral-600 rounded-md text-xs px-4 py-1 ms-2"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


// 'use client'
// import React from 'react'
// import useAuthRedirect from '@/utils/useAuthRedirect';
// import { useAuth } from '@/utils/auth';
// import { parseCookies } from 'nookies';
// import Link from 'next/link';
// const NavBar = (profile, remainingCredits, darkTheme, setDarkTheme) => {
//   const { token } = useAuthRedirect();
//   const { username, logout } = useAuth();



//   return (
//     <nav className="fixed top-0  z-50 w-full py-1  border-b border-neutral-200 bg-neutral-500  " >
//       <div className="px-3 py-0 lg:px-5 lg:pl-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center justify-start rtl:justify-end">
//             <button
//               data-drawer-target="logo-sidebar"
//               data-drawer-toggle="logo-sidebar"
//               aria-controls="logo-sidebar"
//               type="button"
//               className="inline-flex items-center p-2 text-sm text-neutral-500 rounded-lg sm:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200"
//             >
//               <span className="sr-only">Open sidebar</span>
//               <svg
//                 className="w-6 h-6"
//                 aria-hidden="true"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns=""
//               >
//                 <path
//                   clipRule="evenodd"
//                   fillRule="evenodd"
//                   d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//                 ></path>
//               </svg>


//             </button>
//             <Link href="/" className="flex ms-2 md:me-24 items-center">

//               <span className="self-center text-xl text-white font-semibold sm:text-2xl whitespace-nowrap">
//                 Genie Genesis
//               </span>
//             </Link>
//           </div>
//           <div className="  flex items-center">
//             <div className="flex items-center ms-3 relative">
//               <Link href="/profile" className='mx-4' >
//                 <div className=" flex items-center gap-4">
//                   <img
//                     className="w-6 h-6 -my-4 rounded-full"
//                     src={profile.profile.photo ? `${profile.profile.photo}` : '/images/profile.png'}
//                     alt=""
//                   />

//                   {/* https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png */}
//                   <div className=" sm:block hidden text-sm text-neutral-100 dark:text-white">
//                   <div>{profile.profile.name ? profile.profile.name : "Loading ..."}</div>
//                     <div className="text-sm text-neutral-500 dark:text-neutral-400">
//                       <div className="text-sm text-neutral-100 dark:text-neutral-400">

//                         Credit ~ {profile?.remainingCredits ?? parseFloat(profile.profile.credit).toFixed(2)}

//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//               <button
//                 onClick={logout}
//                 className="text-white bg-neutral-700 hover:bg-neutral-800 font-bold focus:ring-4 focus:ring-neutral-200 rounded-lg text-xs px-4 py-2  ms-2"
//               >
//                 Log out
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>

//   )
// }

// export default NavBar


// 'use client'
// import React from 'react';
// import useAuthRedirect from '@/utils/useAuthRedirect';
// import { useAuth } from '@/utils/auth';
// import Link from 'next/link';
// import { MdLogout } from 'react-icons/md';

// const NavBar = ({ profile = {}, remainingCredits, darkTheme, setDarkTheme }) => {
//   const { token } = useAuthRedirect();
//   const { username, logout } = useAuth();

//   // Provide default values for profile and profile properties
//   const profilePhoto = profile.profile?.photo || '/images/profile.png';
//   const profileName = profile.profile?.name || "Loading ...";
//   const profileCredit = profile.remainingCredits ?? parseFloat(profile.profile?.credit ?? 0).toFixed(2);

//   return (
//     <nav className={`fixed top-0 z-50 w-full py-1 border-b border-neutral-700 ${darkTheme ? 'bg-neutral-900' : 'bg-neutral-500'}`}>
//       <div className="px-2 py-0 flex items-center justify-between">
//         <div className="flex items-center">
//           <button
//             data-drawer-target="logo-sidebar"
//             data-drawer-toggle="logo-sidebar"
//             aria-controls="logo-sidebar"
//             type="button"
//             className="inline-flex items-center p-1 text-white rounded-lg sm:hidden hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600"
//           >
//             <span className="sr-only">Open sidebar</span>
//             <svg
//               className="w-5 h-5"
//               aria-hidden="true"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 clipRule="evenodd"
//                 fillRule="evenodd"
//                 d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//               ></path>
//             </svg>
//           </button>
//           <Link href="/" className="flex items-center ms-1 md:me-8">
//             <span className="text-lg text-white font-semibold whitespace-nowrap">
//               Genie Genesis
//             </span>
//           </Link>
//         </div>
//         <div className="flex items-center">
//           <Link href="/profile" className='flex items-center mx-2 group'>
//             <div className="relative w-8 h-8 flex items-center justify-center">
//               <img
//                 className="w-full h-full object-cover rounded-full border-2 border-neutral-800 shadow-sm group-hover:border-neutral-600"
//                 src={profilePhoto}
//                 alt="Profile"
//               />
//             </div>
//             <div className="hidden sm:block text-xs text-white ms-2">
//               <div className="font-medium">{profileName}</div>
//               <div className="text-xs text-neutral-400">
//                 Credit ~ {profileCredit}
//               </div>
//             </div>
//           </Link>
//           <button
//             onClick={logout}
//             className="text-white bg-red-700 hover:bg-red-800 font-bold rounded-lg text-xs px-2 py-1 ms-2 flex items-center gap-1"
//           >
//             <MdLogout className="text-lg" />
//             Log out
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
