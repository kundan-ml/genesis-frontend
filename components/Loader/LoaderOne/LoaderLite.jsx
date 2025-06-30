import React, { useState, useEffect } from 'react';
import './loaderlite.css';

const LoaderLite = ({ status = 'understanding' }) => {
  const [dots, setDots] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusText = () => {
    switch(status) {
      case 'thinking':
        return 'Thinking' + '.'.repeat(dots);
      case 'generating':
        return 'Generating' + '.'.repeat(dots);
      case 'loading':
        return 'Loading' + '.'.repeat(dots);
      default:
        return 'Understanding' + '.'.repeat(dots);
    }
  };

  return (
    <ul className='dark:text-white text-black'>
      <li>
        <div className="">
          <div className="child"></div>
        </div>
      </li>
      <li>
        <div className="text">{getStatusText()}</div>
      </li>
    </ul>
  );
};

export default LoaderLite;