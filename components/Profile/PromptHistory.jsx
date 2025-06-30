


'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/utils/auth';
import useAuthRedirect from '@/utils/useAuthRedirect';
import { FaHistory, FaExclamationTriangle, FaExpandAlt, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const PromptHistory = ({ darkTheme }) => {
    const [prompts, setPrompts] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [activeTab, setActiveTab] = useState('prompts');
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedImages, setExpandedImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [subPromptImages, setSubPromptImages] = useState({});
    const { username } = useAuth();
    const BACKEND_URL = process.env.BACKEND_URL;
    const [activeSubPrompt, setActiveSubPrompt] = useState(null); // Track the active sub-prompt
    useAuthRedirect();

    useEffect(() => {
        const fetchPrompts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/api/prompts/${username}`);
                setPrompts(response.data);
            } catch (error) {
                console.error('Error fetching prompts:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAnomalies = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`api/anomaly-history?username=${username}`);
                setAnomalies(response.data);
                // console.log(" All Anomaly Images ",response.data);
            } catch (error) {
                console.error('Error fetching anomalies:', error);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'prompts') {
            fetchPrompts();
        } else if (activeTab === 'anomalies') {
            fetchAnomalies();
        }
    }, [username, activeTab]);

    const toggleRow = (index) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const toggleImageDetails = (entryIndex, imageId) => {
        setExpandedImages(prevState => ({
            ...prevState,
            [`${entryIndex}-${imageId}`]: !prevState[`${entryIndex}-${imageId}`]
        }));
    };

    const fetchImagesForSubPrompt = async (masterPromptId, index) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/fetch-images`, {
                params: { prompt: masterPromptId }
            });
            setSubPromptImages(prevState => ({
                ...prevState,
                [index]: response.data.images
            }));
        } catch (error) {
            console.error('Error fetching sub-prompt images:', error);
        }
    };

    const buttonStyles = {
        prompts: {
            bg: 'from-indigo-500 to-purple-600',
            text: 'text-white',
            icon: 'text-indigo-500',
            line: 'bg-indigo-500'
        },
        anomalies: {
            bg: 'from-red-500 to-orange-600',
            text: 'text-white',
            icon: 'text-red-500',
            line: 'bg-red-500'
        }
    };

    const activeStyle = buttonStyles[activeTab];

    return (
        <section className={`p-10 min-h-screen dark:text-white text-gray-900 `}>
            {/* Header */}
            <div className="flex justify-center mb-10">
                <button
                    className={`py-4 px-10 mx-5 rounded-full font-bold text-lg transition-transform duration-500 hover:scale-105 shadow-xl ${activeTab === 'prompts' ? `bg-gradient-to-r ${activeStyle.bg} ${activeStyle.text}` : `dark:bg-neutral-700 dark:text-indigo-200 bg-white text-indigo-600 border-2 border-indigo-500 `}`}
                    onClick={() => setActiveTab('prompts')}
                >
                    <FaHistory className="inline-block mr-3" />
                    Prompt History
                </button>
                <button
                    className={`py-4 px-10 mx-5 rounded-full font-bold text-lg transition-transform duration-500 hover:scale-105 shadow-xl ${activeTab === 'anomalies' ? `bg-gradient-to-r ${activeStyle.bg} ${activeStyle.text}` : `dark:bg-neutral-700 dark:text-red-200 bg-white text-red-600 border-2 border-red-500 `}`}
                    onClick={() => setActiveTab('anomalies')}
                >
                    <FaExclamationTriangle className="inline-block mr-3" />
                    Anomaly History
                </button>
            </div>

            {/* Loading Spinner */}
            {loading && (
                <div className="flex justify-center items-center my-10">
                    <FaSpinner className="animate-spin text-3xl" />
                </div>
            )}

            {/* Timeline */}
            <div className="relative">
                <div className={`absolute right-0 transform -translate-x-1/2 w-1 h-full ${activeStyle.line}`}></div>

                {/* Timeline Entries */}
                <div className="w-full space-y-4">
                    {(activeTab === 'prompts' ? prompts : anomalies).map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            className="relative flex items-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={`w-10 h-10 rounded-full ${activeStyle.icon} flex items-center justify-center absolute right-0 transform -translate-x-1/2 -translate-y-1/2`}>
                                {activeTab === 'prompts' ? <FaHistory className="" /> : <FaExclamationTriangle className="" />}
                            </div>

                            <motion.div
                                className={`relative w-full mx-20 max-w-full p-6 rounded-lg shadow-lg dark:bg-neutral-800 dark:text-white bg-white text-gray-900   `}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold">
                                        {activeTab === 'prompts' ? entry.master_prompt.slice(0, 50) : new Date(entry.created_at).toLocaleString()}
                                    </h3>
                                    <span className="text-xs text-gray-400">{activeTab === 'prompts' ? new Date(entry.created_at).toLocaleString() : entry.model}</span>
                                </div>
                                <p className="text-sm mt-2">
                                    {activeTab === 'prompts' ? (
                                        <div className='flex flex-wrap gap-x-12'>
                                            <span> {entry.sub_prompts.length} Sub-Prompts</span>
                                        </div>
                                    ) : (
                                        <div className='flex flex-wrap gap-x-12'>
                                            <span> Total Images: {entry.num_images} </span>
                                            <span> Pass Images: {entry.pass_img} </span>
                                            <span> Fail Images: {entry.fail_img} </span>
                                        </div>
                                    )}
                                </p>

                                <motion.button
                                    onClick={() => {
                                        toggleRow(index);
                                        if (activeTab === 'prompts') {
                                            fetchImagesForSubPrompt(entry.id, index);
                                        }
                                    }}
                                    className={`${activeTab === 'prompts' ? ' text-indigo-600 ' : 'text-red-600'} text-sm mt-4 hover:underline`}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaExpandAlt className={`inline-block mr-2 ${activeTab === 'prompts' ? '' : 'text-red-600'} `} /> {activeTab === 'prompts' ? 'View Details' : 'View Images'}
                                </motion.button>

                                <AnimatePresence>
                                    {expandedRows[index] && (
                                        <motion.div
                                            className="mt-4"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {activeTab === 'prompts' ? (
                                                <div className="space-y-4 flex flex-col ">
                                                    {entry.sub_prompts.map((subPrompt) => (
                                                        <div key={subPrompt.id}>
                                                            <p
                                                                onClick={() => setActiveSubPrompt(activeSubPrompt === subPrompt.id ? null : subPrompt.id)}
                                                                className="cursor-pointer text-xs  hover:underline"
                                                            >
                                                                {subPrompt.prompt_text}
                                                            </p>
                                                            <AnimatePresence>
                                                                {activeSubPrompt === subPrompt.id && (
                                                                    <motion.div
                                                                        className=" flex flex-wrap "
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                    >
                                                                        {subPromptImages[index]?.filter(image => subPrompt.prompt_text === image.sub_prompt_text).map(image => (
                                                                            <div key={image.id} className="text-xs ">
                                                                                <div className="">
                                                                                    <div className=" ">
                                                                                        <AnimatePresence>
                                                                                            <img
                                                                                                src={`${BACKEND_URL}/${image.url}`}
                                                                                                alt={image.sub_prompt_text}
                                                                                                className="w-20 m-2 hover:scale-105 cursor-pointer rounded-lg"
                                                                                            />

                                                                                        </AnimatePresence>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {entry.images.map((image) => (
                                                        <div key={image.id} className=" text-xs">
                                                            <motion.button
                                                                onClick={() => toggleImageDetails(index, image.image_name)}
                                                                className="text-xs hover:text-red-600 flex justify-between w-full"  // Flex layout and justify-between for alignment
                                                                whileTap={{ scale: 0.95 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <span className='w-3/4 text-left' >
                                                                    {image.image_name}
                                                                </span>
                                                                <span className="text-red-600">
                                                                    {image.result}
                                                                </span>
                                                                {/* <span>
                                                                    ({(image.anomaly_score * 100).toFixed(2)}%)
                                                                </span> */}
                                                            </motion.button>


                                                            <AnimatePresence>
                                                                {expandedImages[`${index}-${image.image_name}`] && (
                                                                    <motion.div
                                                                        className="mt-2 text-gray-500"
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                    >
                                                                        <div className="space-y-0 py-2 gap-x-6 text-center items-center flex flex-wrap">
                                                                            <div>
                                                                                <img
                                                                                    src={`${BACKEND_URL}/${image.path}`}
                                                                                    alt="Images"
                                                                                    className="w-20 h-20 rounded-lg hover:scale-105 cursor-pointer justify-center mb-2 mx-auto object-cover"
                                                                                />
                                                                                {/* <p>Colormap Image</p> */}
                                                                            </div>
                                                                            {/* <div>

                                                                                <img
                                                                                    src={`${BACKEND_URL}/${image.overlapped_image}`}
                                                                                    alt="Overlapped"
                                                                                    className="w-20 h-20 hover:scale-105 cursor-pointer rounded-lg mx-auto mb-2 object-cover"
                                                                                />
                                                                                <p>Overlapped Image</p>
                                                                            </div>
                                                                            <div>

                                                                                <img
                                                                                    src={`${BACKEND_URL}/${image.raw_image}`}
                                                                                    alt="Raw"
                                                                                    className="w-20 h-20 hover:scale-105 cursor-pointer rounded-lg mx-auto mb-2 object-cover"
                                                                                />
                                                                                <p>Raw Image</p>
                                                                            </div> */}
                                                                        </div>
                                                                        {/* <div className="flex flex-col justify-between my-1">
                                                                        <span>Result: {image.result}</span>
                                                                        <span>Anomaly Score: {(image.anomaly_score * 100).toFixed(2)}%</span>
                                                                    </div> */}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromptHistory;
