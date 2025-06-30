// components/IframeComponent.jsx

import React from 'react';

const Iframe = ({ src }) => {
  return (
    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
      <iframe
        src={src}
        className="absolute top-0 left-0 w-full h-full"
        style={{ border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default Iframe;
