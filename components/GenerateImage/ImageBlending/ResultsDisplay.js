import React from "react";
import { AiOutlineExpand } from "react-icons/ai";

const ResultsDisplay = ({
  blendedResult,
  type,
  phase_contrast,
  bright_field,
  dark_field,
  BACKEND_URL,
  expandImage,
}) => {
  return (
    <section className="mt-6">
      <div className="flex flex-wrap justify-center">
        <div className="m-4">
          <h3 className="text-lg font-semibold dark:text-white text-center mb-2">
            Rendered Image (Single Spot)
          </h3>
          <div className="relative">
            <img
              src={`${BACKEND_URL}/${blendedResult}`}
              alt="Blended result"
              className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
            />
            <button
              onClick={() => expandImage(`${BACKEND_URL}/${blendedResult}`)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
            >
              <AiOutlineExpand size={20} />
            </button>
          </div>
        </div>

        {type === "multiple" && (
          <>
            <div className="m-4">
              <h3 className="text-lg font-semibold dark:text-white text-center mb-2">
                Phase Contrast
              </h3>
              <div className="relative">
                <img
                  src={`${BACKEND_URL}/${phase_contrast}`}
                  alt="Phase contrast"
                  className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                />
                <button
                  onClick={() => expandImage(`${BACKEND_URL}/${phase_contrast}`)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  <AiOutlineExpand size={20} />
                </button>
              </div>
            </div>

            <div className="m-4">
              <h3 className="text-lg font-semibold dark:text-white text-center mb-2">
                Bright Field
              </h3>
              <div className="relative">
                <img
                  src={`${BACKEND_URL}/${bright_field}`}
                  alt="Bright field"
                  className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                />
                <button
                  onClick={() => expandImage(`${BACKEND_URL}/${bright_field}`)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  <AiOutlineExpand size={20} />
                </button>
              </div>
            </div>

            <div className="m-4">
              <h3 className="text-lg font-semibold dark:text-white text-center mb-2">
                Dark Field
              </h3>
              <div className="relative">
                <img
                  src={`${BACKEND_URL}/${dark_field}`}
                  alt="Dark field"
                  className="max-h-96 w-auto object-contain rounded-md border dark:border-gray-600"
                />
                <button
                  onClick={() => expandImage(`${BACKEND_URL}/${dark_field}`)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  <AiOutlineExpand size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ResultsDisplay;