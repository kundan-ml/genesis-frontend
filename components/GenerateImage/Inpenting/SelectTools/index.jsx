import React, { useState } from "react";
import { Square, Pencil } from "lucide-react";

const SelectTool = ({
  onSelectTool,
  selectedTool,
  setSelectedTool,
  clearAllShapes,
  isShrunk,
  setIsShrunk,
}) => {
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    if (onSelectTool) {
      onSelectTool(tool);
    }
  };

  const toggleShrink = () => {
    //setIsShrunk((prev) => !prev);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Tool Buttons */}
      {[
        { tool: "rectangle", label: "Rectangle (Raw)", icon: Square },
        { tool: "sam_rectangle", label: "Rectangle (SAM)", icon: Square },
        { tool: "freehand", label: "Free Draw", icon: Pencil },
      ].map(({ tool, label, icon: Icon }) => (
        <button
          key={tool}
          className={`flex items-center px-3 py-1 rounded-md transition-all
          ${
            selectedTool === tool
              ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 border border-indigo-300 dark:border-indigo-500"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-transparent"
          }`}
          onClick={() => handleToolSelect(tool)}
        >
          <Icon className="mr-1" size={18} />
          {label}
        </button>
      ))}

      {/* Polyline button with custom SVG icon */}
      <button
        className={`flex items-center px-3 py-1 rounded-md transition-all
          ${
            selectedTool === "polyline"
              ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 border border-indigo-300 dark:border-indigo-500"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-transparent"
          }`}
        onClick={() => handleToolSelect("polyline")}
      >
        <svg
          className="mr-1"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M2 12L4 10L8 14L12 10L16 14L20 10L22 12L20 14L16 10L12 14L8 10L4 14L2 12Z" />
        </svg>
        Polyline
      </button>

      {/* Clear button */}
      <button
        onClick={clearAllShapes}
        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
      >
        Clear All
      </button>

      {/* Spacer to push toggle button to right */}
      <div className="flex-1"></div>

      {/* Toggle button on right end */}
      {/* <button
        onClick={toggleShrink}
        className="p-1 bg-indigo-500 text-white rounded-full shadow-md hover:bg-indigo-600 transition-colors"
        title={isShrunk ? "Expand" : "Shrink"}
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isShrunk ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7l5-5m0 0l-5 5m5-5v12M9 17l-5 5m0 0l5-5m-5 5V10"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7l-5 5m0 0l5-5m-5 5h12M15 17l5-5m0 0l-5 5m5-5H8"
            />
          )}
        </svg>
      </button> */}
    </div>
  );
};

export default SelectTool;
