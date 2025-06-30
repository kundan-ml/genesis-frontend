import { useState, useEffect } from 'react';
import FullScreenModal from './FullscreenModel';
import Terminal from '@/components/Terminal';

const TrainingStatus = ({ username, setShowTraining }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [logs, setLogs] = useState([]);

  // Function to fetch logs from the server
  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/training-logs?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []); // Store the logs in state
      } else {
        console.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchLogs(); // Fetch logs when username is available
    }
  }, [username]); // Fetch logs whenever username changes

  const closeModal = () => {
    setShowTraining(false);
  };

  return (
    <FullScreenModal isOpen={isModalOpen} onClose={closeModal} title="Training Terminal">
      {/* Pass the fetched logs to the Terminal component */}
      <Terminal logs={logs} onClose={closeModal} />
    </FullScreenModal>
  );
};

export default TrainingStatus;
