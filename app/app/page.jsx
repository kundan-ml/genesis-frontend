'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import axios from 'axios';
import GenerateImages from '@/components/GenerateImage';
import useAuthRedirect from '@/utils/useAuthRedirect';
import Drawer from '@/components/Drawer';
import NavBar from '@/components/Navbar';
import TrainingStatus from '@/components/Anomaly/Training/TrainginBody/training-status/page';
import SystemUsagePopup from '@/components/SystemUsagePopup';
import UserPopup from '@/components/GenerateImage/UserPopup';
import SharedPromptPage from '@/components/SharedPromptPage';
import ServerDownPopup from '@/components/ServerDown';
// import Loading from 'react-loading';
import LoadingPage from '@/components/ServerDown/Loading';

const App = () => {
  const { loading } = useAuthRedirect();
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [profile, setProfile] = useState([]);
  const [remainingCredits, setRemainingCredits] = useState();
  const [darkTheme, setDarkTheme] = useState(true);
  const [showTraining, setShowTraining] = useState(false);
  const [showSystemUsage, setShowSystemUsage] = useState(false);
  const [sharedpopup, setSharedPopup] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(0);
  const [serverStatus, setServerStatus] = useState('loading'); // Track server status
  const [isInpenting, setIsInpenting] = useState(false);
  const { username } = useAuth();
  const BACKEND_URL = process.env.BACKEND_URL;

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
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username]);

  const handleSubPromptSelect = (subPromptId) => {
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
          setPendingMessage(response.data.pending_data);
        } else {
          console.warn('No data received for pending prompts');
        }
      } catch (error) {
        console.error('Error fetching pending prompts:', error.message || error);
      }
    };

    fetchPendingPrompt();
  }, []);

  // if (loading) {
  // return<> <LoadingPage/> </>
  // }

  // if (serverStatus == 'loading') {
  //   return<> <LoadingPage/> </>
  //   }

  // if (serverStatus === 'down') {
  //   return <> <ServerDownPopup/> </>
  // }

  return (
    <section className={`dark:bg-neutral-800 bg-neutral-200`}>
      {serverStatus === 'down' ?
        (<>
          <ServerDownPopup />
        </>) :
        (<>

          <NavBar
            profile={profile}
            remainingCredits={remainingCredits}
            darkTheme={darkTheme}
            setDarkTheme={setDarkTheme}
            setShowTraining={setShowTraining}
            setShowSystemUsage={setShowSystemUsage}
            setSharedPopup={setSharedPopup}
            pendingMessage={pendingMessage}
          />
          <Drawer
            selectedPrompt={selectedPrompt}
            setSelectedPrompt={setSelectedPrompt}
            handleSubPromptSelect={handleSubPromptSelect}
            darkTheme={darkTheme}
            isInpenting={isInpenting} 
            setIsInpenting={setIsInpenting}
          />
          <main className="p-4 sm:ml-64 -mt-8 h-auto overflow-hidden transition duration-300">
            <header className='h-0'>
              <h1 className="text-2xl font-bold text-transparent">Text to Image Generation</h1>
              <p className="mt-2 text-transparent">
                Generate images using text prompts with Stable Diffusion v1-5 for LS3 BV, LS3 LPC, and IOL lens images.
              </p>
            </header>

            <GenerateImages
              prompt={selectedPrompt}
              profile={profile}
              setRemainingCredits={setRemainingCredits}
              remainingCredits={remainingCredits}
              darkTheme={darkTheme}
              isInpenting={isInpenting} 
              setIsInpenting={setIsInpenting}
            />
            {showTraining && (
              <TrainingStatus
                username={username}
                setShowTraining={setShowTraining}
              />
            )}

            {showSystemUsage &&
              <SystemUsagePopup
                onClose={() => setShowSystemUsage(false)}
              />
            }
            {sharedpopup &&
              <SharedPromptPage
                setSharedPopup={setSharedPopup}
                username={username}
              />
            }
          </main>
        </>)
      } {/* Show only if server is down */}
    </section>
  );
};

export default App;
