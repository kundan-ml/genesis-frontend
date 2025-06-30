'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/utils/auth';
import useAuthRedirect from '@/utils/useAuthRedirect';
import { FaHistory, FaExclamationTriangle } from 'react-icons/fa';

const PromptHOstoryTwo = ({ darkTheme }) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [prompts, setPrompts] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [activeTab, setActiveTab] = useState('prompts');
    const { username } = useAuth();
    const BACKEND_URL = process.env.BACKEND_URL;
    useAuthRedirect();

    const toggleRow = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/prompts/${username}`);
                setPrompts(response.data);
            } catch (error) {
                console.error('Error fetching prompts:', error);
            }
        };

        const fetchAnomalies = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/anomaly/history/${username}`);
                setAnomalies(response.data);
            } catch (error) {
                console.error('Error fetching anomalies:', error);
            }
        };

        if (activeTab === 'prompts') {
            fetchPrompts();
        } else if (activeTab === 'anomalies') {
            fetchAnomalies();
        }
    }, [username, activeTab]);

    const getFirstFiveWords = (text) => {
        return text.split(' ').slice(0, 5).join(' ') + '...';
    };

    return (
        <section className={`p-10 min-h-screen ${darkTheme ? 'bg-neutral-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className="flex justify-center mb-8">
                <button
                    className={`py-3 px-8 mx-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl ${activeTab === 'prompts' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : `${darkTheme ? 'bg-neutral-700 text-indigo-200' : 'bg-white text-indigo-600 border-2 border-indigo-500'}`}`}
                    onClick={() => setActiveTab('prompts')}
                >
                    <FaHistory className="inline-block mr-2" />
                    Prompt History
                </button>
                <button
                    className={`py-3 px-8 mx-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl ${activeTab === 'anomalies' ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white' : `${darkTheme ? 'bg-neutral-700 text-red-200' : 'bg-white text-red-600 border-2 border-red-500'}`}`}
                    onClick={() => setActiveTab('anomalies')}
                >
                    <FaExclamationTriangle className="inline-block mr-2" />
                    Anomaly History
                </button>
            </div>

            {activeTab === 'prompts' && (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${darkTheme ? 'bg-neutral-800 text-gray-300' : 'bg-gray-50 text-gray-900'} p-8 rounded-xl shadow-xl`}>
                    {prompts.map((prompt, index) => (
                        <div
                            key={prompt.unique_id}
                            className={`p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl ${darkTheme ? 'bg-neutral-800' : 'bg-white'} `}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold truncate">{getFirstFiveWords(prompt.master_prompt)}</h3>
                                <button
                                    onClick={() => toggleRow(index)}
                                    className={`transition-all transform hover:scale-110 text-lg ${darkTheme ? 'text-indigo-400' : 'text-indigo-600'}`}
                                >
                                    {expandedRows[index] ? '-' : '+'}
                                </button>
                            </div>
                            <p className="text-sm mb-2">{new Date(prompt.created_at).toLocaleString()}</p>
                            {expandedRows[index] && (
                                <div className={`mt-4 space-y-4 ${darkTheme ? 'bg-neutral-900 p-4 rounded-lg' : 'bg-gray-100 p-4 rounded-lg'}`}>
                                    {prompt.sub_prompts.map((subPrompt) => (
                                        <div key={subPrompt.id} className="text-xs">
                                            <p className={`font-semibold ${darkTheme ? 'text-indigo-300' : 'text-indigo-600'}`}>{subPrompt.prompt_text}</p>
                                            {subPrompt.generations?.map((generation, i) => (
                                                <div key={i} className="mt-2">
                                                    <p className={`text-sm ${darkTheme ? 'text-indigo-200' : 'text-indigo-500'}`}>{generation.num_images} images</p>
                                                    <div className="flex space-x-2 mt-2">
                                                        {generation.images.map((image, j) => (
                                                            <img
                                                                key={j}
                                                                src={image.image_path}
                                                                alt={`Image ${j}`}
                                                                className="w-24 h-24 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'anomalies' && (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${darkTheme ? 'bg-neutral-800 text-gray-300' : 'bg-gray-50 text-gray-900'} p-8 rounded-xl shadow-xl`}>
                    {anomalies.map((anomaly, index) => (
                        <div
                            key={anomaly.unique_id}
                            className={`p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl ${darkTheme ? 'bg-neutral-800' : 'bg-white'} `}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold truncate">{anomaly.image_name}</h3>
                            </div>
                            <p className="text-sm mb-2">{new Date(anomaly.created_at).toLocaleString()}</p>
                            <p className={`text-lg font-bold ${darkTheme ? 'text-red-400' : 'text-red-600'}`}>{(anomaly.anomaly_score * 100).toFixed(2)} %</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default PromptHOstoryTwo;







// 'use client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '@/utils/auth';
// import useAuthRedirect from '@/utils/useAuthRedirect';
// import { FaHistory, FaExclamationTriangle, FaExpandAlt, FaSpinner } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';

// const PromptHistory = ({ darkTheme }) => {
//     const [prompts, setPrompts] = useState([]);
//     const [anomalies, setAnomalies] = useState([]);
//     const [activeTab, setActiveTab] = useState('prompts');
//     const [expandedRows, setExpandedRows] = useState({});
//     const [expandedImages, setExpandedImages] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [subPromptImages, setSubPromptImages] = useState({});
//     const { username } = useAuth();
//     const BACKEND_URL = process.env.BACKEND_URL;
//     useAuthRedirect();

//     useEffect(() => {
//         const fetchPrompts = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${BACKEND_URL}/api/prompts/${username}`);
//                 setPrompts(response.data);
//             } catch (error) {
//                 console.error('Error fetching prompts:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchAnomalies = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`${BACKEND_URL}/anomaly/history/${username}`);
//                 setAnomalies(response.data);
//             } catch (error) {
//                 console.error('Error fetching anomalies:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (activeTab === 'prompts') {
//             fetchPrompts();
//         } else if (activeTab === 'anomalies') {
//             fetchAnomalies();
//         }
//     }, [username, activeTab]);

//     const toggleRow = (index) => {
//         setExpandedRows(prevState => ({
//             ...prevState,
//             [index]: !prevState[index]
//         }));
//     };

//     const toggleImageDetails = (entryIndex, imageId) => {
//         setExpandedImages(prevState => ({
//             ...prevState,
//             [`${entryIndex}-${imageId}`]: !prevState[`${entryIndex}-${imageId}`]
//         }));
//     };

//     const fetchImagesForSubPrompt = async (masterPromptId, index) => {
//         try {
//             const response = await axios.get(`${BACKEND_URL}/api/fetch-images`, {
//                 params: { prompt: masterPromptId }
//             });
//             setSubPromptImages(prevState => ({
//                 ...prevState,
//                 [index]: response.data.images
//             }));
//         } catch (error) {
//             console.error('Error fetching sub-prompt images:', error);
//         }
//     };

//     const buttonStyles = {
//         prompts: {
//             bg: 'from-indigo-500 to-purple-600',
//             text: 'text-white',
//             icon: 'text-indigo-500',
//             line: 'bg-indigo-500'
//         },
//         anomalies: {
//             bg: 'from-red-500 to-orange-600',
//             text: 'text-white',
//             icon: 'text-red-500',
//             line: 'bg-red-500'
//         }
//     };

//     const activeStyle = buttonStyles[activeTab];

//     return (
//         <section className={`p-10 min-h-screen ${darkTheme ? 'text-white' : 'text-gray-900'}`}>
//             {/* Header */}
//             <div className="flex justify-center mb-10">
//                 <button
//                     className={`py-4 px-10 mx-5 rounded-full font-bold text-lg transition-transform duration-500 hover:scale-105 shadow-xl ${activeTab === 'prompts' ? `bg-gradient-to-r ${activeStyle.bg} ${activeStyle.text}` : `${darkTheme ? 'bg-neutral-700 text-indigo-200' : 'bg-white text-indigo-600 border-2 border-indigo-500'}`}`}
//                     onClick={() => setActiveTab('prompts')}
//                 >
//                     <FaHistory className="inline-block mr-3" />
//                     Prompt History
//                 </button>
//                 <button
//                     className={`py-4 px-10 mx-5 rounded-full font-bold text-lg transition-transform duration-500 hover:scale-105 shadow-xl ${activeTab === 'anomalies' ? `bg-gradient-to-r ${activeStyle.bg} ${activeStyle.text}` : `${darkTheme ? 'bg-neutral-700 text-red-200' : 'bg-white text-red-600 border-2 border-red-500'}`}`}
//                     onClick={() => setActiveTab('anomalies')}
//                 >
//                     <FaExclamationTriangle className="inline-block mr-3" />
//                     Anomaly History
//                 </button>
//             </div>

//             {/* Loading Spinner */}
//             {loading && (
//                 <div className="flex justify-center items-center my-10">
//                     <FaSpinner className="animate-spin text-3xl" />
//                 </div>
//             )}

//             {/* Timeline */}
//             <div className="relative">
//                 <div className={`absolute right-0 transform -translate-x-1/2 w-1 h-full ${activeStyle.line}`}></div>

//                 {/* Timeline Entries */}
//                 <div className="w-full space-y-4">
//                     {(activeTab === 'prompts' ? prompts : anomalies).map((entry, index) => (
//                         <motion.div
//                             key={entry.id}
//                             className="relative flex items-center"
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             <div className={`w-10 h-10 rounded-full ${activeStyle.icon} flex items-center justify-center absolute right-0 transform -translate-x-1/2 -translate-y-1/2`}>
//                                 {activeTab === 'prompts' ? <FaHistory className="" /> : <FaExclamationTriangle className="" />}
//                             </div>

//                             <motion.div
//                                 className={`relative w-full mx-20 max-w-full p-6 rounded-lg shadow-lg ${darkTheme ? 'bg-neutral-800 text-white' : 'bg-white text-gray-900'} mx-0`}
//                                 whileHover={{ scale: 1.02 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <div className="flex justify-between items-center">
//                                     <h3 className="text-xl font-semibold">
//                                         {activeTab === 'prompts' ? entry.master_prompt.slice(0, 50) : new Date(entry.created_at).toLocaleString()}
//                                     </h3>
//                                     <span className="text-xs text-gray-400">{activeTab === 'prompts' ? new Date(entry.created_at).toLocaleString() : entry.model}</span>
//                                 </div>
//                                 <p className="text-sm mt-2">
//                                     {activeTab === 'prompts' ? (
//                                         <div className='flex flex-wrap gap-x-12'>
//                                             <span> {entry.sub_prompts.length} Sub-Prompts</span>
//                                         </div>
//                                     ) : (
//                                         <div className='flex flex-wrap gap-x-12'>
//                                             <span> Total Images: {entry.num_images} </span>
//                                             <span> Pass Images: {entry.pass_img} </span>
//                                             <span> Fail Images: {entry.fail_img} </span>
//                                         </div>
//                                     )}
//                                 </p>

//                                 <motion.button
//                                     onClick={() => {
//                                         toggleRow(index);
//                                         if (activeTab === 'prompts') {
//                                             fetchImagesForSubPrompt(entry.id, index);
//                                         }
//                                     }}
//                                     className={`${activeTab === 'prompts' ? ' text-indigo-600 ' : 'text-red-600'} text-sm mt-4 hover:underline`}
//                                     whileTap={{ scale: 0.95 }}
//                                     transition={{ duration: 0.2 }}
//                                 >
//                                     <FaExpandAlt className={`inline-block mr-2 ${activeTab === 'prompts' ? '' : 'text-red-600'} `} /> {activeTab === 'prompts' ? 'View Details' : 'View Images'}
//                                 </motion.button>

//                                 <AnimatePresence>
//                                     {expandedRows[index] && (
//                                         <motion.div
//                                             className="mt-4"
//                                             initial={{ height: 0, opacity: 0 }}
//                                             animate={{ height: 'auto', opacity: 1 }}
//                                             exit={{ height: 0, opacity: 0 }}
//                                             transition={{ duration: 0.3 }}
//                                         >
//                                             {activeTab === 'prompts' ? (
//                                                 <div className="space-y-2">
//                                                     {subPromptImages[index]?.map((image) => (
//                                                         <div key={image.id} className="text-xs">
//                                                             <p
//                                                             onClick={() => toggleImageDetails(index, image.id)}
//                                                             >{image.sub_prompt_text}</p>
//                                                             <div className="mt-2">
//                                                                 <p>{image.num_images} images</p>
//                                                                 <div className="flex space-x-2 mt-2">
//                                                                 </div>
//                                                                 <AnimatePresence>
//                                                                     {expandedImages[`${index}-${image.id}`] && (
//                                                                         <motion.div
//                                                                             className="mt-4"
//                                                                             initial={{ height: 0, opacity: 0 }}
//                                                                             animate={{ height: 'auto', opacity: 1 }}
//                                                                             exit={{ height: 0, opacity: 0 }}
//                                                                             transition={{ duration: 0.3 }}
//                                                                         >
//                                                                             <img
//                                                                         src={image.image_url}
//                                                                         alt={image.sub_prompt_text}
//                                                                         className="w-24 h-24 rounded-lg"
                                                                        
//                                                                     />
//                                                                             {/* Additional image details can go here */}
//                                                                             <p>Additional details about the image</p>
//                                                                         </motion.div>
//                                                                     )}
//                                                                 </AnimatePresence>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             ) : (
//                                                 <div className="space-y-4">
//                                                 {entry.images.map((image) => (
//                                                     <div key={image.id} className=" text-xs">
//                                                         <motion.button
//                                                             onClick={() => toggleImageDetails(index, image.id)}
//                                                             className="text-xs hover:text-red-600 flex justify-between w-full"  // Flex layout and justify-between for alignment
//                                                             whileTap={{ scale: 0.95 }}
//                                                             transition={{ duration: 0.2 }}
//                                                         >
//                                                             <span className='w-3/4 text-left' >
//                                                                 {image.image_name}
//                                                             </span>
//                                                             <span className="text-red-600">
//                                                                 {image.result} 
//                                                             </span>
//                                                             <span>
//                                                             ({(image.anomaly_score*100).toFixed(2)}%)
//                                                             </span>
//                                                         </motion.button>


//                                                         <AnimatePresence>
//                                                             {expandedImages[`${index}-${image.id}`] && (
//                                                                 <motion.div
//                                                                     className="mt-2 text-gray-500"
//                                                                     initial={{ height: 0, opacity: 0 }}
//                                                                     animate={{ height: 'auto', opacity: 1 }}
//                                                                     exit={{ height: 0, opacity: 0 }}
//                                                                     transition={{ duration: 0.3 }}
//                                                                 >
//                                                                     <div className="space-y-0 py-2 gap-x-6 text-center items-center flex flex-wrap">
//                                                                         <div>
//                                                                             <img
//                                                                                 src={`${BACKEND_URL}/${image.colormap_image}`}
//                                                                                 alt="Colormap"
//                                                                                 className="w-20 h-20 rounded-lg hover:scale-105 cursor-pointer justify-center mb-2 mx-auto object-cover"
//                                                                             />
//                                                                             <p>Colormap Image</p>
//                                                                         </div>
//                                                                         <div>

//                                                                             <img
//                                                                                 src={`${BACKEND_URL}/${image.overlapped_image}`}
//                                                                                 alt="Overlapped"
//                                                                                 className="w-20 h-20 hover:scale-105 cursor-pointer rounded-lg mx-auto mb-2 object-cover"
//                                                                             />
//                                                                             <p>Overlapped Image</p>
//                                                                         </div>
//                                                                         <div>

//                                                                             <img
//                                                                                 src={`${BACKEND_URL}/${image.raw_image}`}
//                                                                                 alt="Raw"
//                                                                                 className="w-20 h-20 hover:scale-105 cursor-pointer rounded-lg mx-auto mb-2 object-cover"
//                                                                             />
//                                                                             <p>Raw Image</p>
//                                                                         </div>
//                                                                     </div>
//                                                                     {/* <div className="flex flex-col justify-between my-1">
//                                                                         <span>Result: {image.result}</span>
//                                                                         <span>Anomaly Score: {(image.anomaly_score * 100).toFixed(2)}%</span>
//                                                                     </div> */}
//                                                                 </motion.div>
//                                                             )}
//                                                         </AnimatePresence>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             )}
//                                         </motion.div>
//                                     )}
//                                 </AnimatePresence>
//                             </motion.div>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default PromptHistory;
