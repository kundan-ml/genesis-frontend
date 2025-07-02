import React from "react";

const ColorChannelSelector = ({ selectedChannel, setSelectedChannel }) => {
  return (
    <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-neutral-900/30 dark:to-neutral-900/30 border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            Color Channel Selection
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-800/60 text-indigo-700 dark:text-indigo-200 rounded-full">
              Grayscale Conversion
            </span>
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Select which color channel to use for grayscale conversion
          </p>

          <div className="mt-3 relative">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-sm rounded-lg bg-white dark:bg-neutral-800 border-0 shadow-sm ring-1 ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none transition-all"
            >
              <option value="rgb">RGB channel</option>
              <option value="red">Red Channel</option>
              <option value="green">Green Channel</option>
              <option value="blue">Blue Channel</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorChannelSelector;