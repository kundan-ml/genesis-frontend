'use client';
import { useState } from 'react';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';  // Ensure framer-motion is installed

export default function UploadTestImages({ images, setImages, label, username, mode, modelname }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unique_id, set_unique_id] = useState("none");
  const BACKEND_URL = process.env.BACKEND_URL
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDelete = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();

    // Add images to the form data
    images.forEach((image, index) => {
      formData.append('images', image.file);
    });

    // Add additional fields (e.g., username, mode, modelname)
    formData.append('username', username);
    formData.append('mode', mode);
    formData.append('modelname', modelname);
    formData.append('unique_id', unique_id);

    try {
      const response = await fetch(`${BACKEND_URL}/train/${mode}_images/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle success (e.g., notify user or clear images)
        alert(`${mode} Images uploaded successfully!`);
        const data = await response.json();
        setImages([]); // Optionally clear images after submission
        console.log(data.unique_id)
        set_unique_id(data.unique_id);
      } else {
        console.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Error during image upload:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4">
      <label className="block text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6">
        {label}
      </label>
      <div className="relative group w-full flex justify-center items-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg cursor-pointer transition-transform duration-300 ease-in-out"
        >
          <FaCloudUploadAlt className="mr-2 text-4xl" />
          <span className="text-xl">Upload Images</span>
        </motion.div>
      </div>

      <div className="mt-8 flex h-[60vh] gradient-border scrollbar-dark overflow-auto scrollbar-dark flex-wrap gap-0 border justify-center">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="relative group m-2 gradient-border overflow-hidden shadow-lg bg-gray-700 hover:shadow-xl transition-all duration-500"
          >
            <img
              src={image.url}
              alt={`Image ${index}`}
              className="h-28 w-28 object-cover transition-all duration-300"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
            >
              <motion.button
                whileHover={{ scale: 1.3, rotate: 360 }}
                className="text-white text-3xl"
                onClick={() => handleDelete(index)}
              >
                <FaTrash className="bounce" />
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || images.length === 0}
        className={`mt-6 p-3 rounded-lg text-white font-semibold ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition-all`}
      >
        {isSubmitting ? 'Uploading...' : 'Submit Images'}
      </button>
    </div>
  );
}
