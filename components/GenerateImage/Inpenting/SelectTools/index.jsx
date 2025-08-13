import React, { useState } from "react";
import { Circle, Square, Pencil } from "lucide-react";

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
    setIsShrunk((prev) => !prev);
  };

  return (
    <div className="w-auto h-14 -mt-8 ml-20 z-50 bg-neutral-700 border border-gray-400 flex items-center px-4 space-x-4">
      {/* Tool Buttons */}
      {[
        { tool: "rectangle", label: "Rectangle (Raw)", icon: Square },
        { tool: "sam_rectangle", label: "Rectangle (SAM)", icon: Square },
        // { tool: "circle", label: "Circle", icon: Circle }, // Hidden but kept in code
        { tool: "freehand", label: "Free Draw", icon: Pencil },
      ].map(({ tool, label, icon: Icon }) => (
        <button
          key={tool}
          className={`flex items-center px-4 py-1 text-white font-medium rounded-lg transition-all
        ${
          selectedTool === tool
            ? "bg-blue-600"
            : "bg-neutral-800 hover:bg-neutral-600"
        }
        border ${selectedTool === tool ? "border-blue-400" : "border-gray-500"}
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
          onClick={() => handleToolSelect(tool)}
        >
          <Icon className="w-5 h-5 mr-2" />
          {label}
        </button>
      ))}

      {/* Clear button stays with tools */}
      <button
        onClick={clearAllShapes}
        className="bg-gray-500 text-white px-4 py-1 rounded-md"
      >
        Clear All
      </button>

      {/* Spacer to push toggle button to right */}
      <div className="flex-1"></div>

      {/* Toggle button on right end */}
      <button
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
      </button>
    </div>
  );
};

export default SelectTool;
