'use client';
import { useState, useRef } from "react";
import axios from "axios";

export default function ImageMasking() {
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
      setMaskImage(null);
    }
  };

  // Handle click event to get coordinates
  const handleCanvasClick = async (e) => {
    if (!image || !imageRef.current) return;

    console.log(image);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("x", x);
    formData.append("y", y);

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/generate-mask/", formData, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "image/png" });
      setMaskImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating mask:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-100 drop-shadow-lg">🔍 AI Bubble Segmentation</h1>

      <label className="relative cursor-pointer bg-white/10 backdrop-blur-lg px-6 py-3 rounded-lg text-gray-300 hover:bg-white/20 transition-all duration-300 shadow-md">
        Upload Image
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </label>

      {previewURL && (
        <div className="relative mt-6 p-4 bg-white/10 rounded-lg shadow-lg backdrop-blur-md">
          <img
            ref={imageRef}
            src={previewURL}
            alt="Uploaded"
            className="w-96 h-auto rounded-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={handleCanvasClick}
          />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {maskImage && (
            <img
              src={maskImage}
              alt="Mask"
              className="absolute top-0 left-0 w-full h-full opacity-50 mix-blend-overlay rounded-lg transition-opacity"
            />
          )}
        </div>
      )}
    </div>
  );
}

