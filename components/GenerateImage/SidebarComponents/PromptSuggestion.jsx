import React, { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { MdOutlineGesture } from "react-icons/md";

const PromptSuggestion = ({
  openSections,
  setOpenSections,
  toggleSection,
  suggestions,
  setSuggestions,
  inputPrompt,
  setInputPrompt,
  fuse,
}) => {
  // const [suggestions, setSuggestions] = useState([]);
  const promptList = [
    "single spot, contact lens, cuvette, multiple air bubbles",
    "phase contrast, contact lens, cuvette, bottle cap edge",
    "single spot, contact lens, cuvette, dosing bubble",
    "contact lens, shell, crumpled center, folded center",
    "contact lens, shell, bright lens edge",
    "contact lens, shell, folded lens edge, type c",
    "monofocal, fov, bright field, lens, haptics, fracture, high resolution",
    "monofocal, fov, dark field bit-1, lens, haptics, fracture, high resolution",
    "monofocal, fov, dark field bit-2, lens, haptics, fracture, high resolution",
  ];
  // Fuse.js setup for fuzzy searching

  // Handle suggestion click (autocomplete)
  const handleSuggestionClick = (suggestion) => {
    setInputPrompt(suggestion);
    setSuggestions([]);
  };

  return (
    <div
      className={`border mt-0 p-2 mx-2 dark:bg-neutral-800 bg-gray-200 shadow-md rounded-md overflow-hidden ${
        openSections.includes("negativePrompt")
          ? "border-gray-500"
          : "dark:border-gray-600 border-gray-400"
      } transition-all duration-300`}
    >
      <label
        htmlFor="promptSugession"
        className="cursor-pointer text-sm px-1 flex dark:hover:text-neutral-400 hover:text-indigo-600"
        onClick={() => toggleSection("promptSugession")}
      >
        <MdOutlineGesture className="mt-1" />
        <span className="ml-2">Prompt Suggestion</span>
      </label>
      {openSections.includes("promptSugession") && (
        <div>
          {suggestions.length > 0 && (
            <ul className=" z-10 w-auto mt-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto scrollbar-hidden">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-2 italic py-1 text-xs cursor-pointer hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptSuggestion;
