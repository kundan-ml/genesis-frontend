'use client';
import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaCopy, FaSignOutAlt, FaSearch, FaDownload } from 'react-icons/fa';
import { useAuth } from '@/utils/auth';

const Terminal = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gpuUsage, setGpuUsage] = useState([]);
  const [ramUsage, setRamUsage] = useState(0);
  const terminalRef = useRef(null);
  const { username, logout } = useAuth();
  const BACKEND_URL = process.env.BACKEND_URL;

  useEffect(() => {
    const fetchLogsAndUsage = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/train/run/${username}`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
          setGpuUsage(data.gpu_usage || []);
          setRamUsage(data.ram_usage || 0);
        }
      } catch (error) {
        console.error('Error fetching logs or usage:', error);
      }
    };

    if (isFetching) {
      const intervalId = setInterval(fetchLogsAndUsage, 1000); // Fetch logs and usage every second
      return () => clearInterval(intervalId);
    }
  }, [isFetching]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLogs = logs.filter(log =>
    log.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStopTraining = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/train/stop/${username}`, {
        method: 'POST',
      });

      if (response.ok) {
        console.log('Training stopped successfully');
      } else {
        console.error('Error stopping training');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderGraphBar = (percentage) => {
    const getColor = (percentage) => {
      if (percentage < 50) return 'from-green-500 to-green-700';
      if (percentage < 75) return 'from-yellow-400 to-yellow-600';
      return 'from-red-500 to-red-700';
    };

    return (
      <div className="relative w-full h-6 dark:bg-gray-700 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getColor(percentage)} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center dark:text-white text-gray-900 font-bold text-xs">
            {percentage}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black bg-black bg-opacity-70 ">
      <div className="relative w-11/12 max-w-3xl dark:bg-neutral-900 bg-neutral-200 border-2 border-indigo-600 rounded-lg shadow-xl overflow-hidden">
        {/* Terminal Header */}
        <div className="relative p-4 bg-gradient-to-r dark:from-black dark:via-gray-900 dark:to-indigo-800 from-white via-gray-200 to-indigo-600 dark:text-white text-black flex justify-between items-center shadow-xl backdrop-blur-lg">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <span className="text-lg font-bold text-green-300">{username ? `${username}@linux:~$` : 'loading...'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFetching(!isFetching)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs transition-transform duration-300 transform hover:scale-105 ${isFetching ? 'bg-pink-500 text-white' : 'bg-teal-500 text-white'}`}
            >
              {isFetching ? <FaPause /> : <FaPlay />}
              <span>{isFetching ? 'Pause' : 'Resume'}</span>
            </button>
            {/* <button
              onClick={onClose}
              className="dark:text-white hover:rotate-45 text-black text-2xl hover:text-indigo-300 transition-transform duration-300 transform "
            >
              &times;
            </button> */}
            <button
              onClick={onClose}
              className="text-center items-center flex top-1 h-8 w-8 right-2 text-3xl dark:text-neutral-300 text-neutral-300 dark:hover:text-white hover:text-white p-0 rounded-full transition-all transform hover:rotate-90"
            >
              <span className="mx-auto -mt-1">&times;</span>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="relative p-4 h-72 overflow-y-scroll scrollbar-dark dark:bg-black bg-white dark:text-white text-gray-800 shadow-inner rounded-lg border-2 dark:border-gray-800 transition-all duration-300 backdrop-blur-sm"
        >
          <div className="flex items-center mb-4 dark:bg-neutral-800 bg-gray-200 p-2 rounded-lg backdrop-blur-md">
            <FaSearch className="text-neutral-300 mr-2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 px-3 py-1 border rounded-md focus:outline-none dark:bg-neutral-800 bg-gray-300 dark:text-white text-black border-neutral-600 placeholder-neutral-400"
            />
          </div>

          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <div key={index} className="mb-1 text-sm dark:text-neutral-400 text-gray-700 dark:hover:bg-neutral-700 hover:bg-gray-300 transition-colors duration-300 p-2 rounded-lg">
                {log}
              </div>
            ))
          ) : (
            <p className="text-neutral-500 italic">Waiting for logs...</p>
          )}
        </div>

        {/* Footer with GPU and RAM Usage */}
        <div className="bg-gradient-to-r dark:from-black dark:via-gray-900 dark:to-indigo-800 from-white via-gray-200 to-indigo-600 p-4 flex flex-col items-center space-y-4 border-t border-indigo-600 backdrop-blur-lg">
          {/* RAM Usage Section */}
          <div className="w-full flex flex-col items-center space-y-2">
            <div className="dark:text-neutral-200  text-gray-800 text-lg">RAM Usage: {ramUsage}%</div>
            <div className="w-full max-w-md">{renderGraphBar(ramUsage)}</div>
          </div>

          {/* GPU Usage Section */}
          {gpuUsage.length > 0 ? (
            gpuUsage.map((gpu, index) => (
              <div
                key={index}
                className="w-full max-w-md p-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:scale-105 transition-transform duration-300 backdrop-blur-lg"
              >
                <div className="text-l font-semibold text-teal-300">{gpu.name} (GPU {gpu.id})</div>
                <div className="text-sm text-neutral-400 text-center">Memory Used: {gpu.memory_used} MB / {gpu.memory_total} MB</div>
                <div className="w-full mt-2 text-center">
                  {renderGraphBar(((gpu.memory_used / gpu.memory_total) * 100).toFixed(2))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500">No GPU data available.</p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 w-full mt-4 justify-center">
            {/* <button
              onClick={() => navigator.clipboard.writeText(filteredLogs.join('\n'))}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs transition-transform duration-300 transform hover:scale-105 bg-neutral-700 hover:bg-neutral-600 text-white"
            >
              <FaCopy />
              <span>Copy Logs</span>
            </button> */}
            <button
              onClick={() => {
                const blob = new Blob([filteredLogs.join('\n')], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'training_logs.txt';
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs transition-transform duration-300 transform hover:scale-105 bg-neutral-700 hover:bg-neutral-600 text-white"
            >
              <FaDownload />
              <span>Download Logs</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs transition-transform duration-300 transform hover:scale-105 bg-red-600 hover:bg-red-500 text-white"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
            {/* <button
                onClick={handleStopTraining}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs transition-transform duration-300 transform hover:scale-105 bg-orange-500 hover:bg-orange-400 text-white"
              >
                <FaPause />
                <span>Stop Training</span>
              </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
