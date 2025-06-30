

// Tooltip.js
import React from 'react';

const Tooltip = ({ text }) => {
  return (
    <div className="absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-xs rounded-md">
      {text}
    </div>
  );
};

export default Tooltip;
