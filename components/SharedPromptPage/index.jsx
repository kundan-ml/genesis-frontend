import { useState, useEffect } from 'react';
import { EditIcon } from '../Icons';
import { useSpring, animated } from 'react-spring';
import { FaDownload } from 'react-icons/fa';

const SharedPromptPage = ({ setSharedPopup, username }) => {
  const [sharedPrompts, setSharedPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const BACKEND_URL = process.env.BACKEND_URL;
  const [scale, setScale] = useState(1);
  const [isFitToScreen, setIsFitToScreen] = useState(false); // State for fit-to-screen mode
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const img = new Image();
    img.src = selectedImage; // Set your image source
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, []);

    const props = useSpring({
      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    });
  
    
  useEffect(() => {
    const fetchSharedPrompts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/shared-prompts/${username}`);
        const result = await response.json();

        if (result.shared_prompts) {
          setSharedPrompts(result.shared_prompts);
        } else {
          console.error('Failed to fetch shared prompts:', result.error);
        }
      } catch (error) {
        console.error('Error fetching shared prompts:', error.message || error);
      }
    };

    // Fetch shared prompts whenever username changes
    fetchSharedPrompts();

    // Event listener to handle page interactions
    const handleInteraction = () => {
      fetchSharedPrompts(); // Call fetch whenever there's a page interaction
    };

    // Listen for user interactions like click or key press
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('focus', handleInteraction);

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('focus', handleInteraction);
    };
  }, [username]); // Dependencies: username ensures it fetches when username changes

  const handleViewImages = async (subPrompt, prompt_id) => {
    setSelectedPrompt(subPrompt);
    try {
      await fetch(`${BACKEND_URL}/api/change_prompt_status/${prompt_id}/`, { method: 'GET' });
    } catch (error) {
      console.error('Error changing prompt status:', error.message || error);
    }
  };

  const closeImageModal = () => {
    setSelectedPrompt(null);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // Open the image in a new popup
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  const sortedSharedPrompts = sharedPrompts.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;
    return 0;
  });

  const downloadImage = (imageUrl, filename) => {
    fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename; // Set the file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Clean up
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Error while downloading the image:', error);
      });
  };

  const handleDelete = async (prompt_id) => {
    try {
      await fetch(`${BACKEND_URL}/api/delete_prompt/${prompt_id}/`, { method: 'GET' });
      alert("Deleted successfully");
      fetchSharedPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error.message || error);
    }
  };


  const handleWheel = (event) => {
    setScale((prevScale) => Math.max(0.1, prevScale * (event.deltaY > 0 ? 0.9 : 1.1)));
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + event.movementX * 30,
        y: prevPosition.y + event.movementY * 30,
      }));
    }
  };

  const handleDoubleClick = () => {
    setIsFitToScreen((prev) => !prev);
    if (!isFitToScreen) {
      // Fit the image to screen
      const scaleToFit = Math.min(window.innerWidth / imageDimensions.width, window.innerHeight / imageDimensions.height);
      setScale(scaleToFit);
      setPosition({ x: 0, y: 0 });
    } else {
      // Reset to original scale and position
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };
  if (!isFitToScreen && imageDimensions.width && imageDimensions.height) {
    const scaleToFit = Math.min(window.innerWidth / imageDimensions.width, window.innerHeight / imageDimensions.height);
    setScale(scaleToFit);
    setPosition({ x: 0, y: 0 });
  }
  return (
    <div className="fixed inset-0 bg-gradient-to-r dark:from-neutral-900 dark:via-black dark:to-neutral-800 bg-neutral-950 bg-opacity-90 flex items-center justify-center z-40">
      <button
        onClick={() => setSharedPopup(false)}
        className="absolute text-center items-center flex top-4 h-8 w-8 right-4 text-3xl dark:text-neutral-300 text-neutral-300 dark:hover:text-white hover:text-white dark:bg-neutral-800 p-0 rounded-full transition-all transform hover:rotate-90"
      >
        <span className="mx-auto -mt-1">&times;</span>
      </button>
      <div className="dark:bg-neutral-800 bg-neutral-200 w-full max-w-6xl p-8 rounded-2xl shadow-xl overflow-auto">
        <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">
          Shared Prompts
        </h1>

        <div className="overflow-y-scroll scrollbar-dark rounded-xl dark:bg-neutral-900 bg-white h-[65vh] shadow-lg p-6">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="dark:bg-neutral-700 bg-neutral-400 dark:text-neutral-300 text-sm">
                <th className="p-5">Sender</th>
                <th className="p-5">Prompts</th>
                <th className="p-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSharedPrompts.map((prompt, index) => (
                <tr
                  key={prompt.id}
                  className={`transition-all duration-200 ${index % 2 === 0 ? 'dark:bg-neutral-800 bg-gray-100' : 'dark:bg-neutral-700 bg-neutral-200'
                    } ${prompt.status === 'pending' ? 'border-l-4 border-yellow-400' : ''} text-sm`}
                >
                  <td className="px-5 py-3 border-t border-gray-300 dark:border-neutral-600 dark:text-white text-black font-medium">{prompt.sender}</td>
                  <td className="px-5 py-3 border-t max-w-[300px] border-gray-300 dark:border-neutral-600 dark:text-neutral-300 text-gray-700">{prompt.subject || 'No Subject'}</td>
                  <td className="pl-5 py-3 border-t border-gray-300 dark:border-neutral-600">
                    <button
                      onClick={() => handleViewImages(prompt.sub_prompt, prompt.id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all"
                    >
                      View Images
                    </button>
                    <button
                      onClick={() => handleDelete(prompt.id)}
                      className="px-4 ml-4 py-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40">
            <div className="relative bg-neutral-900 p-10  rounded-2xl shadow-2xl max-w-4xl w-full  ">
              <button
                onClick={closeImageModal}
                className="absolute text-center items-center flex top-4 h-8 w-8 right-4 text-3xl text-neutral-300 hover:text-white bg-neutral-800 p-0 rounded-full transition-all transform hover:rotate-90"
              >
                <span className="mx-auto -mt-1">&times;</span>
              </button>
              <h2 className="text-3xl font-bold mb-6 text-center text-white">
                {selectedPrompt.sub_prompt}
              </h2>
              <div className="grid grid-cols-2 max-h-[40vh] overflow-scroll scrollbar-hidden md:grid-cols-4 gap-2 h-auto overflow-y-auto overflow-x-hidden scrollbar-dark">
                {selectedPrompt?.images?.length > 0 ? (
                  selectedPrompt.images.map((image, index) => {
                    const imageUrl = `${BACKEND_URL}${image.replace(/\\/g, '/')}`;
                    return (
                      <div
                        key={index}
                        className="relative group hover:scale-105 transition-all transform cursor-pointer"
                        onClick={() => handleImageClick(imageUrl)} // Open image popup on click
                      >
                        <img
                          src={imageUrl}
                          alt={`Sub-Prompt ${selectedPrompt.id} Image ${index + 1}`}
                          className="rounded-lg shadow-lg"
                        />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-neutral-300">No images available for this prompt.</p>
                )}
              </div>
              <div className="mt-8 text-center">
                <button
                  onClick={closeImageModal}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className={`fixed inset-0 z-40 bg-black py-4 bg-opacity-75 flex items-center justify-center`}>
            <div className={`relative md:h-[96vh] sm:my-10 w-4/5 md:w-[70vw] dark:bg-neutral-900 dark:text-gray-100 bg-gray-100 text-gray-900  sm:flex xs:flex-wrap rounded-lg p-8 md:py-0`}>
              <div
                className={`absolute top-2 w-full flex dark:border-gray-700 border-gray-300  border-b-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-gray-500 hover:text-gray-700 focus:outline-none`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 cursor-pointer ml-auto mr-4 mt-2 dark:text-gray-100 text-gray-900 `}
                  fill="none"
                  viewBox="0 0 24 24"
                  // onClick={closeModal}
                  onClick={closeImagePopup}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <div className="relative h-auto sm:my-auto mx-auto p-0 bg-transparent lg:max-h-[92vh] sm:flex xs:flex-wrap">
                <button
                  // onClick={handlePrevImage}
                  className={`absolute top-1/2 left-0 transform -translate-y-1/2 dark:text-gray-100 text-gray-900  dark:hover:text-gray-300 hover:text-gray-700 focus:outline-none`}
                >
                  {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg> */}
                </button>
                <button
                  // onClick={handleNextImage}
                  className={`absolute top-1/2 right-0 transform -translate-y-1/2 dark:text-gray-100 text-gray-900  dark:hover:text-gray-300 hover:text-gray-700 focus:outline-none`}
                >
                  {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg> */}
                </button>
                <div className="mx-6 md:w-[86vh] md:h-[86vh] overflow-hidden mt-10 border shadow-lg px-auto dark:bg-black bg-white rounded-lg">
                  {/* <img
                src={selectedImage}
                alt="Selected Image"
                className="w-full rounded-lg shadow-lg object-contain"
              /> */}

                  <div
                    onWheel={handleWheel}

                    style={{ overflow: 'hidden', width: '100%', height: '100%' }}
                  >
                    <div
                      onClick={() => downloadImage(selectedImage, 'downloaded-image.jpg')}
                      className={`relative group text-gray-100  bg-black rounded-full  z-40 ml-auto right-2 cursor-pointer w-8 h-8 flex top-2`}>
                      <FaDownload
                        className='mx-auto my-auto'
                      />
                      {/* <Tooltip text="Edit" /> */}
                    </div>

                    <animated.img
                      onDoubleClick={handleDoubleClick}
                      onMouseMove={handleMouseMove}
                      className="object-center mx-auto  h-auto my-auto rounded mb-4"
                      src={`${selectedImage}`}
                      alt="Selected"
                    style={props}
                    />

                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => downloadImage(selectedImage, 'downloaded-image.jpg')}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-700 hover:to-green-500 text-white font-bold rounded-lg"
                    >
                      Download Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedPromptPage;
