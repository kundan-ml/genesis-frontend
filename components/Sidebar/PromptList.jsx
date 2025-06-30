'use client'
import React, { useState, useEffect } from 'react';
import useAuthRedirect from '@/utils/useAuthRedirect';
import { useAuth } from '@/utils/auth';
import axios from 'axios';
import GenerateImages from '../GenerateImage';
import Link from 'next/link';
const PromptList = () => {
    const { token } = useAuthRedirect();
    const { username, logout } = useAuth();
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const BACKEND_URL = process.env.BACKEND_URL;
    useEffect(() => {
      const fetchPrompts = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/prompts/${username}`);
          setPrompts(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching prompts:', error);
        }
      };
  
      fetchPrompts();
    }, []);
  
    const handlePromptClick = (prompt) => {
      setSelectedPrompt(prompt);
    };
  
    const handleSubPromptSelect = (subPromptId) => {
      // Find the selected subprompt based on subPromptId
      const foundPrompt = prompts.find(prompt => prompt.sub_prompts.some(sub => sub.id === subPromptId));
      if (foundPrompt) {
        setSelectedPrompt(foundPrompt);
      }
    };
  
  return (
    <aside
  id="logo-sidebar"
  className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 shadow-lg"
  aria-label="Sidebar"
>
  <div className="h-full px-4 pb-4 overflow-y-auto bg-white">
    <ul className="space-y-4">
      <Link href="#">
        <li className="flex justify-center items-center py-2 text-gray-600 text-xs uppercase font-semibold mb-2 hover:bg-gray-100 transition-colors duration-300">
          New Prompts
        </li>
      </Link>
      {prompts.map((prompt, index) => (
        <li
          key={prompt.id}
          className={`group flex flex-col items-start px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-300 ${
            index === 0 ? 'border-t border-gray-200' : ''
          }`}
        >
          <button
            onClick={() => handlePromptClick(prompt)}
            className="flex items-center space-x-3 w-full text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
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
            <span className="truncate text-sm">{prompt.unique_id}</span>
          </button>
          <div className="flex w-full mt-1">
            <small className="text-xs font-light text-gray-500">
              {new Date(prompt.created_at).toLocaleString([], {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </small>
          </div>
          <select
            className="mt-2 w-full border rounded-md py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => handleSubPromptSelect(parseInt(e.target.value))}
          >
            <option value="">Select a subprompt</option>
            {prompt.sub_prompts.map((subPrompt) => (
              <option key={subPrompt.id} value={subPrompt.id}>
                {subPrompt.prompt_text}
              </option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  </div>
  <div className="p-4 sm:ml-64 mt-10 h-100 overflow-hidden transition duration-300">
        <GenerateImages prompt={selectedPrompt} />
      </div>
</aside>
  )
}

export default PromptList