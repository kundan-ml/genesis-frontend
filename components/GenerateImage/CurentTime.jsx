// components/CurrentTime.js

import { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the timer on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
      {/* <h2 className="text-xl font-bold mb-2">Current Time and Date</h2> */}
      <div className="">
        {currentTime.toLocaleString('en-US', {
          //   weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          // second: 'numeric',
          hour12: true,
        })}
      </div>
    </div>
  );
};

export default CurrentTime;
