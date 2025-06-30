import React, { useState, useEffect, useRef } from 'react';
import CurrentTime from './CurentTime';
import ImageModal from '../Model/ImageModal';
import LoaderLite from '../Loader/LoaderOne/LoaderLite';


const EmptySkeleton = ({
  numImages,
  inputPrompt,
  progress,
  images,
  generating,
  seed,
  selectedModel,
  load,
  selectedProject,
}) => {
  const darkTheme = true;
  const BACKEND_URL = process.env.BACKEND_URL;
  const [openPrompt, setOpenPrompt] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageLoadStatus, setImageLoadStatus] = useState({});
  const [generationStatus, setGenerationStatus] = useState('understanding');
  const timerRef = useRef(null);

  // Parse prompts from inputPrompt
  let prompts = [];
  if (inputPrompt && typeof inputPrompt === 'string') {
    const sanitizedInputPrompt = inputPrompt.replace(/^"|"$/g, '').trim();
    prompts = sanitizedInputPrompt.split(/"\s*"/).map((prompt) =>
      prompt.replace(/"$/, '').trim()
    );
  } else {
    console.error('inputPrompt is undefined or not a string');
  }

  // Handle image generation status with time limits
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (generating) {
      setGenerationStatus('understanding');
      
      // Set timeout for Understanding phase (1 second)
      timerRef.current = setTimeout(() => {
        setGenerationStatus('thinking');
        
        // Set timeout for Thinking phase (3 seconds max)
        timerRef.current = setTimeout(() => {
          setGenerationStatus('generating');
        }, 3000);
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [generating]);

  // Monitor image load status
  useEffect(() => {
    const hasLoadedImage = Object.keys(imageLoadStatus).some(key => imageLoadStatus[key]);
    if (hasLoadedImage && generating) {
      setGenerationStatus('generating');
    }
  }, [imageLoadStatus, generating]);

  // Rest of component remains the same...
  // (handleImageClick, closeModal, reloadImage, etc.)

  // Handle image click to open modal
  const handleImageClick = (imageUrl, prompt_text) => {
    setCurrentImageUrl(imageUrl);
    setOpenPrompt(prompt_text);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentImageUrl('');
  };

  // Reload image in case of load failure
  const reloadImage = (prompt, index) => {
    const imageUrl = `${BACKEND_URL}/${images[prompt][index].url}?t=${new Date().getTime()}`;
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setImageLoadStatus((prevState) => ({
        ...prevState,
        [`${prompt}-${index}`]: true,
      }));
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${imageUrl}`);
      setTimeout(() => reloadImage(prompt, index), 10000); // Retry loading
    };
  };

  // Monitor changes to images and reload them
  useEffect(() => {
    if (images) {
      Object.keys(images).forEach((prompt) => {
        const promptImages = Array.isArray(images[prompt])
          ? images[prompt]
          : Object.values(images[prompt]);
        promptImages.forEach((image, index) => {
          if (image?.url) {
            reloadImage(prompt, index);
          }
        });
      });
    }
  }, [images]);

  return (
    <section className="w-full max-w-10xl mb-0 border-none h-auto py-0 sm:px-0">
      {prompts.map((prompt, promptIndex) => (
        <div
          key={promptIndex}
          className="mb-8 mx-0 sm:ml-[7vw] py-4 sm:py-0 border-none rounded-2xl hover:scale-102"
        >
          <div className="mx-0">
            <div className="flex items-center justify-between">
              <div
                className={`cursor-pointer text-2xl text-transparent bg-clip-text bg-gradient-to-r dark:from-[white] dark:to-[#E114E5] from-blue-500 to-[#E114E5]  font-bold mb-4`}
              >
                {prompt.trim()} 
              </div>
            </div>
            <div className="dark:text-gray-400 text-indigo-600 text-xs font-bold mb-8">
              <CurrentTime />
            </div>
            <div className="cursor-pointer grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: Math.min(numImages) }, (_, i) => (
                <div
                  key={i}
                  className={`relative dark:bg-[#1a1a1a] bg-neutral-100 border group gradient-border overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105`}
                >
                  <div className="w-full min-w-56 min-h-44 object-cover">
                    {images[prompt] && images[prompt][i] && images[prompt][i].url ? (
                      imageLoadStatus[`${prompt}-${i}`] ? (
                        <img
                          src={`${BACKEND_URL}/${images[prompt][i].url}`}
                          alt={`Generated image ${i + 1}`}
                          className="w-full min-w-20 min-h-20 object-cover"
                          onClick={() =>
                            handleImageClick(
                              `${BACKEND_URL}/${images[prompt][i].url}`,
                              `${prompt.trim()}`
                            )
                          }
                        />
                      ) : (
                        <div className="absolute inset-0 dark:bg-black bg-white bg-opacity-50 flex items-center justify-center">
                          <LoaderLite status="loading" />
                        </div>
                      )
                    ) : (
                      load && (
                        <div className="absolute inset-0 dark:bg-black bg-white bg-opacity-50 flex items-center justify-center">
                          <LoaderLite status={generationStatus} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <ImageModal
        isOpen={modalOpen}
        imageUrl={currentImageUrl}
        onClose={closeModal}
        prompt={openPrompt}
        seed={seed}
        selectedModel={selectedModel}
      />
    </section>
  );
};

export default EmptySkeleton;