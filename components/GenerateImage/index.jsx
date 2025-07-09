import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/utils/auth';
import Modal from '../Model';
import Sidebar from './SideBar';
import BottomForm from './BottomForm';
import { FaEdit } from 'react-icons/fa';
import EmptySkeleton from './EmptySkeleton';
import CustomAlert from '../common/CustomAlert';
import { FaShare } from "react-icons/fa";
import UserPopup from './UserPopup';
import axios from "axios";
import BoundingBoxDraw from './Inpenting/BoundingBoxex';
import ImageBlending from './ImageBlending';

const GenerateImages = ({ prompt, profile, remainingCredits, setRemainingCredits, darkTheme ,isInpenting, setIsInpenting, }) => {
  const [selectedProject, setSelectedProject] = useState("LS3 BV");
  const [inputPrompt, setInputPrompt] = useState('');
  const [negetiveInputPrompt, setNegetiveInputPrompt] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [myImage, setMyImage] = useState(null);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10001));
  const [promptStrength, setPromptStrength] = useState('7.5');
  const [generationsStep, setGenerationsStep] = useState('25');
  const [selectedModel, setSelectedModel] = useState('LensAI-v1.5-512');
  const [imageGroups, setImageGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null); // State for the current group
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer visibility
  const [images, setImages] = useState([]);
  const [imageId, setImageId] = useState(0)
  const [userPopup, setUserPopUp] = useState(true)
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [subPromptId, SetSubPromptId] = useState(111)
  const [isPopupOpen, setPopupOpen] = useState(); false
  const [checkpoints, setCheckpoints] = useState([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState("");
  const [users, setUsers] = useState([]);
  const { username, logout } = useAuth();
  const BACKEND_URL = process.env.BACKEND_URL;

  const [inpenting_uniqe_code, set_inpenting_uniqe_code] = useState('')

  const [ upscale, setUpscale ] = useState("INTER_LANCZOS4")
  const [isImageBlending, setIsImageBlending] = useState(false);
  const [uploadedImage2, setUploadedImage2] = useState(null);
  const [image2, setImage2] = useState(null);
  const [ type, setType ] = useState("single")
  const [isDefault, setIsDefault] = useState()
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);


  
  // New state variables for PDF handling
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPdf, setIsPdf] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [originalImage2DataURL, setOriginalImage2DataURL] = useState(null);
  const [processedImage2File, setProcessedImage2File] = useState(null);
  const [isColorImage2, setIsColorImage2] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [roi1, setRoi1] = useState(null);
  const [roi2, setRoi2] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/users/`)  // Replace with your actual endpoint
      .then((response) => response.json())
      .then((data) => setUsers(data))  // Assuming the response is an array of users
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() =>{
    setRoi2(null)
  },[uploadedImage2] )

    useEffect(() =>{
    setRoi1(null);
  },[uploadedImage] )
  const [fav, setFav] = useState(false)
  useEffect(() => {
    if (prompt) {
      setInputPrompt(prompt.prompt);
      fetchImages(prompt.id);
    }
  }, [prompt]);


  const fetchImages = async (promptId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/fetch-images-${isInpenting}/?prompt=${promptId}`);
      if (!response.ok) {
        console.error('Failed to fetch images ');
        return;
      }
      const data = await response.json();
      groupImagesBySubPrompt(data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
      setUploadedImage(false)
    }
  };

  const groupImagesBySubPrompt = (images) => {
    const groupedImages = images.reduce((groups, image) => {
      const key = image.sub_prompt_id;
      if (!groups[key]) {
        groups[key] = {
          sub_prompt_id: image.sub_prompt_id,
          sub_prompt_text: image.sub_prompt_text,
          created_at: image.created_at,
          seed: image.seed,
          images: [],
        };
      }
      groups[key].images.push({
        id: image.id,
        url: image.url,
      });
      return groups;
    }, {});

    const groupsArray = Object.values(groupedImages);
    setImageGroups(groupsArray);
  };


  // const reUsePrompt = (prompt) => {
  //   // Set the prompt and call handleGenerate with the updated prompt
  //   setInputPrompt(prompt);
  //   handleGenerate(null, 1, prompt);  // Pass the prompt directly to handleGenerate
  // };

  const reUsePrompt = (prompt) => {
    // Check if prompt contains LS3 LPC, LS3 BV, or IOL Lens and set the selected project
    let selectedProject = '';
    if (prompt.includes('ls3 lpc')) {
      selectedProject = 'LS3 LPC';
      prompt = prompt.replace('ls3 lpc,', '').trim(); // Remove LS3 LPC from prompt
    } else if (prompt.includes('ls3 bv')) {
      selectedProject = 'LS3 BV';
      prompt = prompt.replace('ls3 bv,', '').trim(); // Remove LS3 BV from prompt
    } else if (prompt.includes('iol')) {
      selectedProject = 'IOL Lens';
      prompt = prompt.replace('iol,', '').trim(); // Remove IOL Lens from prompt
    }

    // Set the selected project based on the extracted term
    setSelectedProject(selectedProject);

    // Set the prompt and call handleGenerate with the updated prompt
    setInputPrompt(prompt);
    handleGenerate(null, 1, prompt, selectedProject);  // Pass the modified prompt directly to handleGenerate
  };


  const handleGenerate = async (e = null, numImagesOverride = numImages, promptOverride = inputPrompt, project = selectedProject) => {
    if (e) {
      e.preventDefault();  // Only prevent default if an event is passed
    }

    if (!Number.isInteger(numImagesOverride) || numImagesOverride < 1) {
      // alert('Number of images must be 1 or more.');
      setErrorMessage(
        `Number of images must be 1 or more.`
      );
      setShowAlert(true)
      return;
    }
    const formData = new FormData();

    if (Array.isArray(uploadedImage) && uploadedImage.length > 0) {
      uploadedImage.forEach((image) => {
        formData.append('images', image);  // Ensure 'images' field matches with Django view
      });
    }

    formData.append('model', selectedModel);
    formData.append('username', username);
    formData.append('inputPrompt', promptOverride);  // Use the prompt passed from reUsePrompt
    formData.append('numImages', numImagesOverride);
    formData.append('negetiveInputPrompt', negetiveInputPrompt);
    formData.append('selectedProject', project);
    formData.append('seed', seed);
    formData.append('promptStrength', promptStrength);
    formData.append('generationsStep', generationsStep);
    formData.append('selectedCheckpoint', selectedCheckpoint);
    formData.append('inpenting_uniqe_code',inpenting_uniqe_code);
    formData.append('upscale', upscale);

    setLoading(true);
    setDrawerOpen(false);
    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-images-${isInpenting}/`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        console.error('Failed to generate images');
        return;
      }

      setImages([]);
      setUploadedImage(null)
      const data = await response.json();
      // console.log(data);
      groupImagesBySubPrompt(data.images);
      setRemainingCredits(data.profile_data.credit);  // Update remaining credits
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setInputPrompt('');
      setLoading(false);
      setUploadedImage(false)
    }
  };


  const openModal = (group, index) => {
    setCurrentGroup(group);
    setImageId(index)
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentGroup(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Show image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const editSubPrompt = (subPromptText) => {
    setInputPrompt(subPromptText);
    const number = Math.floor(Math.random() * 1001); // Generates a number between 0 and 100,000
    setNumImages(1)
    setSeed(number);
    setModalOpen(false)
    // handleGenerate();
  };


  const useImage = (images) => {
    // setMyImage(image);
    setMyImage(`${BACKEND_URL}/${images}`);
    const number = Math.floor(Math.random() * 1001); // Generates a number between 0 and 100,000
    setSeed(number);
    setModalOpen(false)
  };



  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    // Start polling only when loading is true
    if (loading) {
      interval = setInterval(() => {
        fetch(`${BACKEND_URL}/api/progress/${username}/`)
          .then(response => response.json())
          .then(data => {
            // console.log(data)
            setProgress(data.progress_percentage);
            setImages(data.images);

            // Stop polling if progress reaches 100%
            if (data.progress_percentage >= 101) {
              clearInterval(interval);
            }
          })
          .catch(error => {
            console.error('Error fetching progress:', error);
          });
      }, 1000); // Poll every second
    }

    // Clean up the interval on unmount or when loading changes to false
    return () => clearInterval(interval);
  }, [username, loading]); // Include 'loading' in the dependency array

  const sharesubprompt = (subprompt_id) => {
    SetSubPromptId(subprompt_id);  // Set the selected subprompt_id
    setPopupOpen(true);             // Open the popup
  };


  // Allert Model 

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (loading) {
  //       event.preventDefault();
  //       event.returnValue = "Processing is in progress. Are you sure you want to leave?";
  //     }
  //   };

  //   const handleVisibilityChange = () => {
  //     if (loading && document.visibilityState === "hidden") {
  //       alert("Processing is in progress. Please don't switch tabs or close this page.");
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [loading]);




  
// Handle PDF file
const loadPdf = async (file) => {
  setIsPdfLoading(true);
  try {
    // Dynamically import PDF.js to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    
    // Get PDF.js version to construct worker URL
    const version = pdfjsLib.version;
    // CORRECTED WORKER URL - uses pdf.worker.min.js instead of pdf.min.mjs
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    setPdfDoc(pdf);
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    await renderPdfPage(pdf, 1);
    setIsPdf(true);
  } catch (error) {
    console.error("Error loading PDF:", error);
    setErrorMessage("Failed to load PDF file");
    setShowAlert(true);
  } finally {
    setIsPdfLoading(false);
  }
};

  // Render specific PDF page
  const renderPdfPage = async (pdf, pageNumber) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png");
      setUploadedImage2(dataURL);
      setOriginalImage2DataURL(dataURL);
      
      // Create file from canvas
      canvas.toBlob(blob => {
        const file = new File([blob], `page-${pageNumber}.png`, { type: "image/png" });
        setImage2File(file);
        setProcessedImage2File(file);
      });
      
      // Check if color image
      const isColor = await checkIfColorImage(dataURL);
      setIsColorImage2(isColor);
      setSelectedChannel("rgb");
      setRoi2(null);
      
    } catch (error) {
      console.error("Error rendering PDF page:", error);
      setErrorMessage("Failed to render PDF page");
      setShowAlert(true);
    }
  };

    // Handle page change
  const handlePageChange = async (pageNumber) => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    setIsDefault(null)
    await renderPdfPage(pdfDoc, pageNumber);
  };


    // Check if image is color by sampling pixels
    const checkIfColorImage = (dataURL) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          const step = Math.max(1, Math.floor(data.length / 4 / 100)); // Sample 100 pixels
          for (let i = 0; i < data.length; i += 4 * step) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (
              Math.abs(r - g) > 5 ||
              Math.abs(r - b) > 5 ||
              Math.abs(g - b) > 5
            ) {
              resolve(true); // Color image
              return;
            }
          }
          resolve(false); // Grayscale image
        };
        img.src = dataURL;
      });
    };
  
    // Convert color image to grayscale based on selected channel
    const convertToGrayscale = (dataURL, channel) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            let value;
  
            if (channel === "red") {
              value = data[i];
              data[i + 1] = value; // G
              data[i + 2] = value; // B
            } else if (channel === "green") {
              value = data[i + 1];
              data[i] = value; // R
              data[i + 2] = value; // B
            } else if (channel === "blue") {
              value = data[i + 2];
              data[i] = value; // R
              data[i + 1] = value; // G
            } else if (channel === "rgb") {
              // Do nothing, keep the color channels as is
              continue; // Skip to the next pixel
            } else {
              // Fallback for grayscale or other cases
              value = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average to grayscale
              data[i] = value; // R
              data[i + 1] = value; // G
              data[i + 2] = value; // B
            }
          }
  
          ctx.putImageData(imageData, 0, 0);
          const grayscaleDataURL = canvas.toDataURL("image/png");
          canvas.toBlob((blob) => {
            const file = new File([blob], "grayscale_image.png", {
              type: "image/png",
            });
            resolve({ dataURL: grayscaleDataURL, file });
          }, "image/png");
        };
        img.src = dataURL;
      });
    };
  


  const [image, setImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);

  return (
    <div className={`min-h-screen dark:bg-neutral-800 bg-neutral-200 flex flex-col sm:flex-row`}>
      {/* Sidebar Section */}
      <Sidebar
        inputPrompt={inputPrompt}
        setInputPrompt={setInputPrompt}
        numImages={numImages}
        setNumImages={setNumImages}
        handleGenerate={handleGenerate}
        handleFileChange={handleFileChange}
        imagePreview={imagePreview}
        negetiveInputPrompt={negetiveInputPrompt}
        setNegetiveInputPrompt={setNegetiveInputPrompt}
        seed={seed}
        setSeed={setSeed}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        promptStrength={promptStrength}
        setPromptStrength={setPromptStrength}
        generationsStep={generationsStep}
        setGenerationsStep={setGenerationsStep}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        profile={profile}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        myImage={myImage}
        setMyImage={setMyImage}
        darkTheme={darkTheme}
        setErrorMessage={setErrorMessage}
        setShowAlert={setShowAlert}
        checkpoints={checkpoints}
        setCheckpoints={setCheckpoints}
        selectedCheckpoint={selectedCheckpoint}
        setSelectedCheckpoint={setSelectedCheckpoint}
        setImage={setImage}
        setMaskImage={setMaskImage}
        isInpenting={isInpenting}
        setIsInpenting={setIsInpenting}
        setImageGroups={setImageGroups}
        isImageBlending={isImageBlending}
        setIsImageBlending={setIsImageBlending}
        uploadedImage2={uploadedImage2}
        setUploadedImage2={setUploadedImage2}
        image2={image2} 
        setImage2={setImage2}
        setType={setType}
        upscale={upscale} 
        setIsDefault={setIsDefault}
        setUpscale={setUpscale}
        isPdfLoading={isPdfLoading}
        isPdf={isPdf}
        loadPdf={loadPdf}
        totalPages={totalPages}
        currentPage={currentPage}
        setPdfDoc={setPdfDoc}
        setIsPdf={setIsPdf}
        loading={loading}
      />

      {/* Main Content Section */}
      <main className="flex-1 py-24 px-0 sm:px-6 lg:px-8 ">
      {isImageBlending && (
        <ImageBlending 
        setErrorMessage={setErrorMessage}
        setShowAlert={setShowAlert}
        profile={profile}
        uploadedImage1={uploadedImage}
        setUploadedImage1={setUploadedImage}
        uploadedImage2={uploadedImage2} 
        setUploadedImage2={setUploadedImage2}
        image1File={image}
        setImage1File={setImage}
        image2File={image2}
        setImage2File={setImage2}
        type={type} 
        isDefault={isDefault} 
        setIsDefault={setIsDefault}
        isPdfLoading={isPdfLoading}
        isPdf={isPdf}
        loadPdf={loadPdf}
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        originalImage2DataURL={originalImage2DataURL}
        setOriginalImage2DataURL={setOriginalImage2DataURL}
        processedImage2File={processedImage2File} 
        setProcessedImage2File={setProcessedImage2File}
        checkIfColorImage={checkIfColorImage}
        convertToGrayscale={convertToGrayscale}  
        isColorImage2={isColorImage2}
        setIsColorImage2={setIsColorImage2}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
        roi1={roi1}
        roi2={roi2}
        setRoi1={setRoi1}
        setRoi2={setRoi2}
        
        />
      )

      }
        {uploadedImage && isInpenting  && (
        <BoundingBoxDraw
          image={image}
          setImage={setImage}
          maskImage={maskImage}
          setMaskImage={setMaskImage}
          uploadedImage={uploadedImage}
          inputPrompt={inputPrompt}
          set_inpenting_uniqe_code={set_inpenting_uniqe_code}
        />

        )}
        {loading ? (

          <div>
            <EmptySkeleton
              numImages={numImages}
              inputPrompt={inputPrompt}
              progress={progress}
              generating={"animate-pulse"}
              images={images}
              seed={seed}
              selectedModel={selectedModel}
              load={true}
              selectedProject={selectedProject}
            />
          </div>

        ) : inputPrompt ? (
          <>
            <EmptySkeleton
              numImages={numImages}
              inputPrompt={inputPrompt}
              progress={progress}
              images={images}
              seed={seed}
              selectedModel={selectedModel}
              darkTheme={darkTheme}
              load={false}
              selectedProject={selectedProject}
            />
          </>
        ) :

          (
            <section className="w-full max-w-10xl mb-0 border-none h-auto py-0 sm:px-0">
              {imageGroups.map((group) => (
                <div key={group.sub_prompt_id} className="mb-8 mx-0 sm:ml-[7vw]  py-4 sm:py-0  border-none rounded-2xl hover:scale-102">
                  <div className="flex items-center justify-between" >
                    <div className={` cursor-pointer text-2xl flex text-transparent bg-clip-text bg-gradient-to-r dark:{ from-[white] to-[#E114E5]} from-blue-500 to-[#E114E5]  font-bold mb-4`}>
                      {group.sub_prompt_text}
                      {/* {group.sub_prompt_id} */}
                      <FaShare className="ml-2 mt-2 text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => sharesubprompt(group.sub_prompt_id)} />
                      {/* {fav ? (
                    <FaStar className="ml-2 mt-2 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => setFav(false)} />
                  ):
                  (
                    <CiStar className="ml-2 mt-2 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => setFav(true)} />
                  )} */}
                    </div>
                    <FaEdit className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => editSubPrompt(group.sub_prompt_text)} />
                  </div>
                  <p className="text-gray-400 text-xs font-bold mb-8">
                    Created at: {new Date(group.created_at).toLocaleString()}
                  </p>
                  <div className=" cursor-pointer grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {group.images.slice(0).map((image, index) => (
                      <div
                        onClick={() => openModal(group, index)}
                        key={image.id} className=" relative bg-[#1a1a1a] border group gradient-border overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                        <img className="w-full min-w-20 min-h-20 object-cover" src={`${BACKEND_URL}${image.url}`} alt={`Generated from prompt: ${group.sub_prompt_text}`} />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                          {/* Overlay content */}
                          {/* <span className="text-white" >Click Here</span> */}
                        </div>
                      </div>
                    ))}
                    {/* Add a creative hover effect or animation */}
                  </div>
                </div>
              ))}
            </section>
          )}
        {userPopup && (
          <UserPopup />
        )

        }

        {modalOpen && currentGroup && (
          <>
            <Modal
              closeModal={closeModal}
              group={currentGroup}
              reUsePrompt={reUsePrompt}
              editSubPrompt={editSubPrompt}
              useImage={useImage}
              seed={currentGroup.seed}
              imageId={imageId}
              setImageId={setImageId}
              selectedModel={selectedModel}
              darkTheme={darkTheme}
              setIsInpenting={setIsInpenting}
              setUploadedImage={setUploadedImage}
              setImage={setImage}
              setMaskImage={setMaskImage}
              setInputPrompt={setInputPrompt}
              setImageGroups={setImageGroups}
              setNumImages={setNumImages}
              isInpenting={isInpenting}
            >
              {currentGroup.images.map((image) => (
                <div key={image.id} className="relative group overflow-scroll sm:overflow-auto  rounded-lg shadow-lg transform transition duration-500 hover:scale-110" image={image}>
                  <img className="sm:w-full sm:h-40 object-cover" src={`${BACKEND_URL}${image.url}`} alt="Generated Image" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  </div>
                </div>
              ))}
            </Modal>
          </>
        )}


      </main>

      {/* Toggle Button for Drawer (Mobile) */}
      <button
        className="fixed w-full right-0 bottom-0 sm:hidden bg-gray-500 bg-opacity-50 text-white p-0 rounded-tl-lg focus:outline-none"
        onClick={() => setDrawerOpen((prevState) => !prevState)} // Toggle drawerOpen state
      >
        {/* Arrow icon based on drawer state */}
        {drawerOpen ? (
          <svg className="w-6 h-6 transform rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 mx-auto h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>

      {/* Bottom Drawer Section (Mobile) */}
      <div className={`fixed bottom-0 left-0 right-0 bg-transparent shadow-md sm:hidden transform transition duration-300 ${drawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <button
          className="sm:hidden bg-gray-500 w-full bg-opacity-50 text-white p- rounded-tl-lg focus:outline-none"
          onClick={() => setDrawerOpen((prevState) => !prevState)} // Toggle drawerOpen state
        >
          {/* Arrow icon based on drawer state */}
          {drawerOpen ? (
            <svg className="w-6 h-6 mx-auto  transform " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 transform rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
        <BottomForm
          inputPrompt={inputPrompt}
          setInputPrompt={setInputPrompt}
          numImages={numImages}
          setNumImages={setNumImages}
          handleGenerate={handleGenerate}
          handleFileChange={handleFileChange}
          imagePreview={imagePreview}
          negetiveInputPrompt={negetiveInputPrompt}
          setNegetiveInputPrompt={setNegetiveInputPrompt}
          seed={seed}
          setSeed={setSeed}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          promptStrength={promptStrength}
          setPromptStrength={setPromptStrength}
          generationsStep={generationsStep}
          setGenerationsStep={setGenerationsStep}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          profile={profile}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          myImage={myImage}
          setMyImage={setMyImage}
          darkTheme={darkTheme}
          setErrorMessage={setErrorMessage}
          setShowAlert={setShowAlert}
          checkpoints={checkpoints}
          setCheckpoints={setCheckpoints}
          selectedCheckpoint={selectedCheckpoint}
          setSelectedCheckpoint={setSelectedCheckpoint}
          setImage={setImage}
          setMaskImage={setMaskImage}
          isInpenting={isInpenting}
          setIsInpenting={setIsInpenting} s
        />
      </div>
      {showAlert && (
        <CustomAlert
          message={errorMessage}
          onClose={() => setShowAlert(false)}
        />
      )}



      <UserPopup
        users={users}
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        subPromptId={subPromptId}
        username={username}
      />


    </div>
  );
};

export default GenerateImages;
