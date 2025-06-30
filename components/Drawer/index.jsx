'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import axios from 'axios';
import { IoMdArrowDropright, IoMdArrowDropleft } from 'react-icons/io';

const Drawer = ({ selectedPrompt, setSelectedPrompt, handleSubPromptSelect, darkTheme,
              isInpenting, 
              setIsInpenting,

 }) => {
  const { username } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const BACKEND_URL = process.env.BACKEND_URL;

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchPrompts(); // Fetch prompts only when opening the drawer
    }
  };

  useEffect(() => {
    // Event listener for arrow keys
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setIsOpen(true);
      } else if (event.key === 'ArrowRight' || event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchPrompts = async () => {
    try {
      // const response = await axios.get(`/api/get-prompts?username=${username}`);
      const response = await axios.get(`${BACKEND_URL}/api/prompts-${isInpenting}/${username}`);
      setPrompts(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full shadow-lg p-4 transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-30 w-80 dark:bg-neutral-900 dark:text-gray-100 bg-gray-100 text-gray-900`}
    >
      <button
        className={`absolute top-1/2 transform -translate-y-1/2 ${isOpen ? 'left-0' : 'right-80'} p-3 rounded-full transition-transform duration-300 dark:text-gray-100 text-gray-900 `}
        onClick={toggleDrawer}
      >
        {isOpen ? <IoMdArrowDropright size={24} /> : <IoMdArrowDropleft size={24} />}
      </button>
      <div className="h-full overflow-y-auto scrollbar-dark pt-12">
        <ul className="space-y-4">
          {prompts.map((prompt, index) => (
            <li
              key={prompt.id}
              className={`group flex flex-col items-start px-4 py-3 rounded-lg cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-300 transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-300 ${index === 0 ? 'border-t border-gray-200' : ''}`}
            >
              <button
                onClick={() => setSelectedPrompt(prompt)}
                className="flex items-center space-x-3 w-full text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full dark:bg-indigo-500 dark:text-white bg-indigo-300 text-indigo-500`}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </div>
                <span className="truncate text-sm">{prompt.master_prompt}</span>
              </button>
              <div className="flex w-full mt-1">
                <small className={`text-xs font-light dark:text-gray-400 text-gray-600 `}>
                  {new Date(prompt.created_at).toLocaleString([], {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </small>
                <small className={`text-xs font-light dark:text-gray-400 text-gray-600 `}>
                  {prompt.num_img}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
