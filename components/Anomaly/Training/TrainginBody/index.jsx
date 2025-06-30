'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import UploadImages from './UploadImages/UploadImages';
import { useAuth } from '@/utils/auth';
import TrainingStatus from './training-status/page';
import CustomAlert from '@/components/common/CustomAlert';
import BlogScreen from '@/components/GenerateImage/BlogScreen';
import ThreeDBackground from '@/components/common/Background';
import AIBackground from '@/components/common/Background';
import DatasetDetails from './Datasetdetails';
import TrainingBottimForm from './Sidebar/TrainingBottimForm';

export default function TrainingBody({ showTraining, setShowTraining }) {
  const [className, setClassName] = useState('Class 1');
  const [trainingImages, setTrainingImages] = useState([]);
  const [testingImages, setTestingImages] = useState([]);
  const [modelname, setModelname] = useState();
  const { username, logout } = useAuth();
  const [isTrainingModalOpen, setTrainingModalOpen] = useState(false);
  const [isTestingModalOpen, setTestingModalOpen] = useState(false);
  const [unique_id, set_unique_id] = useState("");
  const [isTrainingStart, setIsTrainingStart] = useState(false)
  const [train_upload, set_train_upload] = useState(false)
  const [test_upload, set_test_upload] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [allModels, setAllModels] = useState([]);
  const [isTraining, setIsTraining] = useState(false)
  const [parameters, setParameters] = useState({
    seed: '',
    batchSize: '',
    imageSize: '',
    epochs: '',
    checkpointName: ''
  });
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer visibility
  const [project_list, setProjectlist] = useState({});
  const [allDatasets, setAllDatasets] = useState([])
  const [datasetName, setDatasetsName] = useState('')
  const [drawRoi, setDrawRoi] = useState(false)
  const [selectedDatastes, setSelectedDatasets] = useState('')

  const [newProject, setNewProject] = useState("")

  const BACKEND_URL = process.env.BACKEND_URL
  useEffect(() => {
    async function fetchLockStatus() {
      const response = await fetch(`${BACKEND_URL}/train/isbusy/`);
      const data = await response.json();
      if (data.locked_by == username) {
        setIsTraining(data.is_locked);
      }
      // console.log('d',data)
      // setLockedBy(data.locked_by);
    }
    fetchLockStatus();
  }, []); // Empty dependency array means this runs once on mount





  const [selectedProject, setSelectedProject] = useState('');

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append the parameters to formData
      Object.keys(parameters).forEach((key) => {
        formData.append(key, parameters[key]);
      });

      // Append class name and its training images to formData
      formData.append('className', className);
      trainingImages.forEach((image, index) => {
        formData.append(`trainingImages[${index}]`, image.file);
      });

      // Append class name and its testing images to formData
      testingImages.forEach((image, index) => {
        formData.append(`testingImages[${index}]`, image.file);
      });

      formData.append('project', selectedProject);

      const response = await fetch(`${BACKEND_URL}/train/anomaly/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // console.log('Submission successful');
        setErrorMessage('Submission successful');
      } else {
        const data = await response.json();
        console.error('Submission failed:', data.error);
        setErrorMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setErrorMessage('Submission failed. Please try again.');
    }
    finally {
      setShowAlert(true)
    }
  };

  const openTrainingModal = () => {
    setTestingModalOpen(false);
    setTrainingModalOpen(true);
  };

  const openTestingModal = () => {
    setTrainingModalOpen(false);
    setTestingModalOpen(true);
  };

  // const fetchDatasets = async () => {
  //   try {
  //     const response = await fetch(`${BACKEND_URL}/train/fetch-datasets/`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           username: username,
  //           selectedProject: selectedProject,
  //         }),
  //       });
        
  //       if (!response.ok) {
  //         console.error('Failed to fetch datasets');
  //         setAllDatasets('')
  //         return;
  //       }
        
  //       // fetchDatasets();
  //       setSelectedDatasets('');
  //       const data = await response.json();
  //       setAllDatasets(data.datasets);
  //       // console.log("all datasets are ",data.datasets);
  //     } catch (error) {
  //       console.error('Error fetching project:', error);
  //     }
  //   };
    
  //   useEffect(() => {
  //   fetchDatasets();
  //   setSelectedDatasets('');
  // }, [username, selectedProject]); // Added selectedProject to the dependency array


  const fetchDatasets = async () => {
    try {
      const projectToSend = selectedProject === "new" ? newProject : selectedProject;
      
      const response = await fetch(`${BACKEND_URL}/train/fetch-datasets/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            selectedProject: projectToSend,
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to fetch datasets');
          setAllDatasets('');
          return;
        }
        
        setSelectedDatasets('');
        const data = await response.json();
        setAllDatasets(data.datasets);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

useEffect(() => {
    fetchDatasets();
    setSelectedDatasets('');
}, [username, selectedProject, newProject]); // Added newProject to the dependency array


  useEffect(() => {
    setSelectedDatasets('')

  }, [selectedProject]);



  useEffect(() => {
    async function generateModelName() {
      try {
        const currentDate = new Date();

        // Format date as DDMMYYYY
        const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}${currentDate.getFullYear()}`;

        // Format time as HHMM
        const formattedTime = `${String(currentDate.getHours()).padStart(2, "0")}${String(
          currentDate.getMinutes()
        ).padStart(2, "0")}`;

        // Determine the model name based on selectedProject and selectedDatastes
        let project = selectedProject === "new" ? newProject : selectedProject;
        let dataset = selectedDatastes === "new" ? datasetName : selectedDatastes;

        setModelname(`${project}_${dataset}_Anomaly_Ckpt_${formattedDate}-${formattedTime}`);
      } catch (error) {
        console.error("Error generating model name:", error);
      }
    }

    generateModelName();
  }, [selectedProject][selectedDatastes]);


  return (
    <div className="min-h-screen flex dark:bg-neutral-800 bg-neutral-200  dark:text-white text-gray-800 ">
      <Sidebar
        parameters={parameters}
        setParameters={setParameters}
        handleSubmit={handleSubmit}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        modelname={modelname}
        setModelname={setModelname}
        openTrainingModal={openTrainingModal}
        openTestingModal={openTestingModal}
        unique_id={unique_id}
        setIsTrainingStart={setIsTrainingStart}
        train_upload={train_upload}
        test_upload={test_upload}
        setIsTraining={setIsTraining}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setShowAlert={setShowAlert}
        setAllModels={setAllModels}
        allModels={allModels}
        selectedDatastes={selectedDatastes}
        setSelectedDatasets={setSelectedDatasets}
        datasetName={datasetName}
        setDatasetsName={setDatasetsName}
        allDatasets={allDatasets}
        setAllDatasets={setAllDatasets}
        setShowTraining={setShowTraining}
        setNewProject={setNewProject}
        project_list={project_list}
        setProjectlist={setProjectlist}
        drawRoi={drawRoi}
        setDrawRoi={setDrawRoi}
      />

      <main className="flex-1 py-0 mt-0 flex px-0 sm:px-6 lg:p-0 bg-gradient-to-r from-gradient-start to-gradient-end min-h-[100vh] md:ml-[250px]">
        {isTrainingModalOpen && (
          <UploadImages
            images={trainingImages}
            setImages={setTrainingImages}
            label={`Upload Training Images for ${modelname}`}
            mode='training'
            username={username}
            modelname={modelname}
            unique_id={unique_id}
            set_unique_id={set_unique_id}
            set_train_upload={set_train_upload}
            set_test_upload={set_test_upload}
            setErrorMessage={setErrorMessage}
            setShowAlert={setShowAlert}
            allModels={allModels}
            datasetName={datasetName}
            allDatasets={allDatasets}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            newProject={newProject}
            project_list={project_list}
            setDatasetsName={setDatasetsName}
            setSelectedDatasets={setSelectedDatasets}
            fetchDatasets={fetchDatasets}
          />
        )}

        {selectedDatastes === 'new' && (
          <UploadImages
            images={testingImages}
            setImages={setTestingImages}
            label={`Upload Testing Images for ${modelname}`}
            mode='testing'
            username={username}
            modelname={modelname}
            unique_id={unique_id}
            set_unique_id={set_unique_id}
            set_train_upload={set_train_upload}
            set_test_upload={set_test_upload}
            setErrorMessage={setErrorMessage}
            setShowAlert={setShowAlert}
            allModels={allModels}
            datasetName={datasetName}
            allDatasets={allDatasets}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            newProject={newProject}
            project_list={project_list}
            setDatasetsName={setDatasetsName}
            setSelectedDatasets={setSelectedDatasets}
            fetchDatasets={fetchDatasets}
          />
        )}
        {selectedDatastes && selectedDatastes !== 'new' && (
          <DatasetDetails
            username={username}
            selectedDatastes={selectedDatastes}
            selectedProject={selectedProject}
            setSelectedDatasets={setSelectedDatasets}
            drawRoi={drawRoi}
            setDrawRoi={setDrawRoi}
            fetchDatasets={fetchDatasets}
            setDatasetsName={setDatasetsName}
          />
        )}


        {showTraining && (
          <TrainingStatus
            username={username}
          />
        )}

        {showAlert && (
          <CustomAlert
            message={errorMessage}
            onClose={() => setShowAlert(false)}
          />
        )}



        {/* {!(isTraining || isTestingModalOpen || isTrainingModalOpen) &&
          (
            <AIBackground />
          )
        } */}

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

        <TrainingBottimForm
          parameters={parameters}
          setParameters={setParameters}
          handleSubmit={handleSubmit}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          modelname={modelname}
          setModelname={setModelname}
          openTrainingModal={openTrainingModal}
          openTestingModal={openTestingModal}
          unique_id={unique_id}
          setIsTrainingStart={setIsTrainingStart}
          train_upload={train_upload}
          test_upload={test_upload}
          setIsTraining={setIsTraining}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setShowAlert={setShowAlert}
          setAllModels={setAllModels}
          allModels={allModels}
          selectedDatastes={selectedDatastes}
          setSelectedDatasets={setSelectedDatasets}
          datasetName={datasetName}
          setDatasetsName={setDatasetsName}
          allDatasets={allDatasets}
          setAllDatasets={setAllDatasets}
          setShowTraining={setShowTraining}
          setNewProject={setNewProject}
          project_list={project_list}
          setProjectlist={setProjectlist}
        />
      </div>


    </div>
  );
}
