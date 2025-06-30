import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaMicrochip, FaMemory, FaHdd, FaDatabase } from 'react-icons/fa';
import DetailPopup from './DetailPopup'; // Import the detail popup component
import { GiProcessor } from 'react-icons/gi';
import { BsCpuFill, BsGpuCard } from 'react-icons/bs';

const SystemUsagePopup = ({ onClose }) => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const [usedMemory, setUsedMemory] = useState(0);
  const [diskUsage, setDiskUsage] = useState(0);
  const [totalDisk, setTotalDisk] = useState(0);
  const [usedDisk, setUsedDisk] = useState(0);
  const [gpuData, setGpuData] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const BACKEND_URL = process.env.BACKEND_URL;

  useEffect(() => {
    const fetchSystemUsage = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/train/system-usage/`);
        const data = response.data;
        setCpuUsage(data.cpu_usage);
        setMemoryUsage(data.memory_usage);
        setTotalMemory(data.total_memory_gb);
        setUsedMemory(data.used_memory_gb);
        setDiskUsage(data.disk_usage);
        setTotalDisk(data.total_disk_gb);
        setUsedDisk(data.used_disk_gb);
        setGpuData(data.gpu_data || []);
      } catch (error) {
        console.error('Error fetching system usage:', error);
      }
    };

    fetchSystemUsage();
    const interval = setInterval(fetchSystemUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDetailClick = (type) => {
    setSelectedDetail(type);
    setShowDetail(true);
  };

  const closePopup = () => {
    setShowDetail(false);
    setSelectedDetail(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-40 p-6 backdrop-blur-lg">
      <div className="dark:bg-neutral-800  bg-gray-300 rounded-lg shadow-xl relative dark:text-white text-black p-6 w-full max-w-4xl">
      <div
          className={`absolute top-2 w-full flex dark:border-gray-700 border-gray-300  border-b-[2px] h-10 right-2 md:top-0 sm:right-0 lg:top-0 lg:right-0 2xl:top-0 text-gray-500 hover:text-gray-700 focus:outline-none`}
        >
      <button
        onClick={onClose}
        className="absolute text-center items-center flex top-1 h-8 w-8 right-4 text-3xl dark:text-neutral-300 text-neutral-300 dark:hover:text-white hover:text-white dark:bg-neutral-800 p-0 rounded-full transition-all transform hover:rotate-90"
      >
        <span className="mx-auto -mt-1">&times;</span>
      </button>
        </div>
        <h2 className="text-4xl font-extrabold text-center mb-2 mt-6 tracking-wide drop-shadow-md">
          System Usage
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 text-center ">
          <UsageCircle
            icon={<BsCpuFill />}
            label="CPU"
            value={cpuUsage}
            colorStart="#ff7e5f"
            colorEnd="#feb47b"
            onClick={() => handleDetailClick('cpu')}
          />
          <UsageCircle
            icon={<FaMemory />}
            label="Memory"
            value={memoryUsage}
            colorStart="#6a11cb"
            colorEnd="#2575fc"
            subText={`${usedMemory} GB / ${totalMemory} GB`}
            onClick={() => handleDetailClick('memory')}
          />
          <UsageCircle
            icon={<FaHdd />}
            label="Disk"
            value={diskUsage}
            colorStart="#00c6ff"
            colorEnd="#0072ff"
            subText={`${usedDisk} GB / ${totalDisk} GB`}
            onClick={() => handleDetailClick('disk')}
          />
          {gpuData.length > 0 &&
            gpuData.map((gpu, index) => (
              <UsageCircle
                key={index}
                icon={<BsGpuCard />}
                label={gpu.name}
                value={gpu.load}
                colorStart="#f953c6"
                colorEnd="#b91d73"
                subText={`Used: ${gpu.memory_used} MB / Free: ${gpu.memory_free} MB`}
                onClick={() => handleDetailClick(`gpu-${index}`)}
              />
            ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-full transition-transform duration-300 transform hover:scale-105 shadow-md"
        >
          Close
        </button>
      </div>

      {showDetail && (
        <DetailPopup
          type={selectedDetail}
          onClose={closePopup}
          usageData={{
            cpuUsage,
            memoryUsage,
            totalMemory,
            usedMemory,
            diskUsage,
            totalDisk,
            usedDisk,
            gpuData,
          }}
        />
      )}
    </div>
  );
};

// Reusable Circle Component
const UsageCircle = ({
  icon,
  label,
  value,
  colorStart,
  colorEnd,
  subText = '',
  onClick,
}) => (
  <div
    className="flex flex-col items-center justify-center dark:text-white text-gray-800 cursor-pointer transition-transform duration-300 hover:scale-105 dark:bg-neutral-900 bg-white p-4 rounded-lg shadow-lg"
    onClick={onClick}
  >

    <div className="mb-2 text-3xl transition-transform duration-300 transform hover:rotate-12">
      {icon}
    </div>
    <span className="text-lg font-bold mb-2">{label}</span>
    <div className="w-16 h-16">
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathColor: `url(#gradient-${label})`,
          textColor: 'gray',
          trailColor: '#4a5568',
          textSize: '14px',
        })}
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
      </svg>
    </div>
    {subText && <div className="text-xs mt-2 dark:text-gray-300 text-gray-700">{subText}</div>}
  </div>
);

export default SystemUsagePopup;
