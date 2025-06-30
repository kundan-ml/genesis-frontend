'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import axios from 'axios';
import GenerateImages from '@/components/GenerateImage';
import useAuthRedirect from '@/utils/useAuthRedirect';
import Drawer from '@/components/Drawer';
import NavBar from '@/components/Navbar';
import Anomaly from '@/components/Anomaly/ImageUploader';
import AnomalyHistory from '@/components/Anomaly/AnomalyHistory';
import TrainingStatus from '@/components/Anomaly/Training/TrainginBody/training-status/page';
import SystemUsagePopup from '@/components/SystemUsagePopup';
import SharedPromptPage from '@/components/SharedPromptPage';
import ServerDownPopup from '@/components/ServerDown';


const anomaly = () => {
  useAuthRedirect();
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [profile, setProfile] = useState([]);
  const { username } = useAuth();
  const [remainingCredits, setRemainingCredits] = useState();
  const [darkTheme, setDarkTheme] = useState(true);
  const [showTraining, setShowTraining] = useState(false);
  const [showSystemUsage, setShowSystemUsage] = useState(false);
  const [sharedpopup, setSharedPopup] = useState(false)
  const [ pendingMessage, setPendingMessage ] = useState(0)
  const [serverStatus, setServerStatus] = useState('loading'); // Track server status
  const BACKEND_URL = process.env.BACKEND_URL
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/server-status/`);
        if (response.data.status === 'up') {
          setServerStatus('up');
        } else {
          setServerStatus('down');
        }
      } catch (error) {
        console.error('Error checking server status:', error);
        setServerStatus('down');
      }
    };

    fetchServerStatus(); // Fetch server status when the component is mounted
  }, [BACKEND_URL]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const response = await axios.get(`/api/get-profile?username=${username}`);
        const response = await axios.get(`${BACKEND_URL}/api/get_profile/${username}`);
        setProfile(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleSubPromptSelect = (subPromptId) => {
    // Find the selected subprompt based on subPromptId
    const foundPrompt = prompts.find(prompt => prompt.sub_prompts.some(sub => sub.id === subPromptId));
    if (foundPrompt) {
      setSelectedPrompt(foundPrompt);
    }
  };



  useEffect(() => {
    const fetchPendingPrompt = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/get-pending_prompt/${username}`);
        if (response.data) {
          setPendingMessage(response.data.pending_data); // Update state with the fetched data
         
        } else {
          console.warn('No data received for pending prompts');
        }
      } catch (error) {
        console.error('Error fetching pending prompts:', error.message || error);
      }
    };
  
    fetchPendingPrompt(); // Call the async function
  }, []); // Dependencies to re-run if username changes
  return (
    <section>
            {serverStatus === 'down' ?
           ( <>
      <ServerDownPopup />
            </>):(<>
            
      
      <NavBar
        profile={profile}
        remainingCredits={remainingCredits}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
        setShowTraining={setShowTraining}
        setShowSystemUsage={setShowSystemUsage} // Pass function to show popup
        setSharedPopup={setSharedPopup}
        pendingMessage={pendingMessage}
        />
      <AnomalyHistory
        selectedPrompt={selectedPrompt}
        setSelectedPrompt={setSelectedPrompt}
        handleSubPromptSelect={handleSubPromptSelect}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
        />
      <Anomaly
        prompt={selectedPrompt}
        profile={profile}
        setRemainingCredits={setRemainingCredits}
        remainingCredits={remainingCredits}
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme}
        />
      {showTraining && (
        <TrainingStatus
        username={username}
        setShowTraining={setShowTraining}
        />
      )}

{showSystemUsage && 
    <SystemUsagePopup
    onClose={() =>
      setShowSystemUsage(false)} 
      />
    }
            { sharedpopup &&
        <SharedPromptPage 
        setSharedPopup={setSharedPopup}
        username = {username}
        />
        }
        </>) 
  } {/* Show only if server is down */}
    </section>
  );
};

export default anomaly;
