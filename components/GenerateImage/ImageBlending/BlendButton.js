import React from "react";
import { SiCoronarenderer } from "react-icons/si";

const BlendButton = ({
  handleBlendImages,
  isBlending,
  uploadedImage1,
  uploadedImage2,
  roi1,
  roi2,
  isColorImage2,
  selectedChannel,
}) => {
  return (
    <button
      onClick={handleBlendImages}
      disabled={
        !uploadedImage1 ||
        !uploadedImage2 ||
        !roi1 ||
        !roi2 ||
        isBlending ||
        (isColorImage2 && !selectedChannel)
      }
      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-200 disabled:opacity-50"
    >
      {isBlending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Rendering...
        </>
      ) : (
        <>
          <SiCoronarenderer className="h-4 w-4 mx-2" />
          Render Images
        </>
      )}
    </button>
  );
};

export default BlendButton;