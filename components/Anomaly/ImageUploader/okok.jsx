// components/ImageUploader.js

import { useState } from 'react';

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [colorMatrix, setColorMatrix] = useState('');
  const [overlapedImg, setOverlapedImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/anomaly/detect/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setColorMatrix(data.color_matrix);
        setOverlapedImg(data.overlaped_img);
      } else {
        console.error('Error uploading image');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Anomaly Detection</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="border border-gray-300 rounded-lg p-2 w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          {isLoading ? 'Processing...' : 'Upload and Detect Anomalies'}
        </button>
      </form>
      {colorMatrix && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Color Matrix</h2>
          <img src={`http://localhost:8000/${colorMatrix}`} alt="Color Matrix" className="max-w-full h-auto rounded-lg shadow-md" />
        </div>
      )}
      {overlapedImg && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Overlapped Image</h2>
          <img src={`http://localhost:8000/${overlapedImg}`} alt="Overlapped Image" className="max-w-full h-auto rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}
