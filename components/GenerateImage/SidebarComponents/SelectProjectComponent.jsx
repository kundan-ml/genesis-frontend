import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineCloudUpload, AiOutlineProject } from 'react-icons/ai';
import { FaSeedling, FaBraille, FaImages } from "react-icons/fa";
import { MdExpandLess, MdExpandMore, MdGrain } from "react-icons/md";
import { Step, Eye, EyeSlash, Strength } from '../../Icons';
import { TbVariable } from "react-icons/tb";
import axios from "axios";
import { GiArtificialHive, GiFountainPen } from "react-icons/gi";
import { TbPointerCheck } from "react-icons/tb";
import { LuImageOff, LuImage } from "react-icons/lu";


const SelectProjectComponent = ({
    openSections,
    setOpenSections,
}) => {

    
    return (
        <div className={`border-y px-2 py-1 bg-transparent shadow-md overflow-hidden ${openSections.includes('project') ? 'border-gray-500' : 'border-gray-600'
            } transition-all duration-300`}
        >
            <label
                htmlFor="ProjectDropdown"
                className="cursor-pointer flex px-2 py-2 items-center text-sm dark:hover:text-neutral-400 hover:text-gray-800 "
                onClick={() => toggleSection('project')}
            >
                <AiOutlineProject className={`h-4 w-4 mr-2 dark:text-white text-indigo-500 `} />
                Project
            </label>
            {openSections.includes('project') && (
                <select
                    id="ProjectDropdown"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-2 text-xs  py-1 my-1 dark:border-[#1a1a1a] border-gray-100 rounded-sm font-roboto transition-all dark:hover:border-neutral-600 hover:border-gray-400 bg-transparent  focus:outline-none dark:focus:bg-neutral-700 focus:bg-gray-300"
                    required
                >
                    <option value="" disabled >Select a project...</option>
                    {Object.entries(project_list).map(([key, value]) => (
                        <option key={key} value={key} disabled={value === false} >
                            {key} {value === false && '(Locked)'}
                        </option>
                    ))}
                </select>
            )}
        </div>

    )
}

export default SelectProjectComponent