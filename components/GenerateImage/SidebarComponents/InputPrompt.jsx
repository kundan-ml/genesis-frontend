import React, { useState, useEffect, useMemo, useRef } from "react";
import { TbPrompt, TbVariable } from "react-icons/tb";
import { MdOutlineGesture, MdOutlineSettingsSuggest } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Fuse from "fuse.js";

const InputPrompt = ({
  openSections,
  toggleSection,
  inputPrompt,
  setInputPrompt,
  negativeInputPrompt,
  selectedProject,
  isInpenting,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionsPopup, setShowSuggestionsPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [bestMatch, setBestMatch] = useState("");
  const inputRef = useRef(null);
  const ghostRef = useRef(null);

  const promptList = {
    "LS3 BV": [
      "single spot,contact lens,cuvette,multiple air bubbles",
      "phase contrast,contact lens,cuvette,bottle cap edge",
      "single spot,contact lens,cuvette,dosing bubble",
      "single spot,contact lens,cuvette,ionization bubbles",
      "phase contrast,contact lens,cuvette,schlieren with crease",
      "single spot,contact lens,cuvette,ehacm on lens edge",
      "single spot,contact lens,cuvette,clipped edge on lens edge",
      "phase contrast,contact lens,cuvette,edge tear on lens edge",
      "phase contrast,contact lens,cuvette,edge gap on lens edge",
      "single spot,contact lens,cuvette,starburst on center of lens",
      "single spot,contact lens,cuvette,mold contamination",
      "single spot,contact lens,cuvette,material foam near lens edge",
      "single spot,contact lens,cuvette,water schlieren on center of lens",
      "single spot,contact lens,cuvette,multiple air bubbles,bottle cap edge",
      "single spot,contact lens,cuvette,dosing bubble,bottle cap edge",
      "single spot,contact lens,cuvette,material foam near lens edge,ionization bubbles",
      "single spot,contact lens,cuvette,mold contamination,material foam near lens edge",
      "single spot,contact lens,cuvette,multiple air bubbles,ehacm on lens edge",
      "phase contrast,contact lens,cuvette,schlieren with crease,ehacm on lens edge",
      "single spot,contact lens,cuvette,mold contamination,bottle cap edge",
      "single spot,contact lens,cuvette,mold contamination,ehacm on lens edge",
      "single spot,contact lens,cuvette,edge gap on lens edge",
      "single spot,contact lens,cuvette,multiple ehacm on lens edge",
      "single spot,contact lens,cuvette,schlieren with crease,roadmap",
      "single spot,contact lens,cuvette,multiple water schlieren on center of lens",
      "phase contrast,contact lens,cuvette,edge tear on lens edge,bottle cap edge",
      "single spot,contact lens,cuvette,mold contamination,ionization bubbles",
      "single spot,contact lens,cuvette,starburst on center of lens,air bubbles",
    ],
    "LS3 LPC": [
      "contact lens,shell,multiple lens",
      "contact lens,shell,more multiple lens",
      "contact lens,shell,multiple lens,big saline bubble",
      "contact lens,shell,multiple lens,half folded,folded lens",
      "contact lens,shell,more multiple lens,big saline bubble",
      "contact lens,shell,more multiple lens,half folded,folded lens",
      "contact lens,shell,bright lens edge,big saline bubble",
      "contact lens,shell,folded centre,crumpled centre,big saline bubble",
      "contact lens,shell,folded centre,crumpled centre,bright lens edge",
      "contact lens,shell,folded lens edge,lens folded to saline border,big saline bubble",
      "contact lens,shell,folded lens edge,lens folded to saline border,bright lens edge",
      "contact lens,shell,folded lens,half folded,folded lens,big saline bubble",
      "contact lens,shell,big saline bubble",
      "contact lens,shell,bright lens edge",
      "contact lens,shell,crumpled center,folded center",
      "contact lens,shell,folded lens edge,type c",
      "contact lens,shell,folded lens edge,lens folded to saline border",
      "contact lens,shell,half folded,folded lens",
      "contact lens,shell,folded lens edge,type c,big saline bubble",
      "contact lens,shell,two multiple lens",
      "contact lens,shell,more multiple lens",
    ],
    "TomO-C": [
      "cardboard shipper box,fourteen rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns",
      "cardboard shipper box,twelve rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns",
      "cardboard shipper box,ten rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns",
      "cardboard shipper box,eight rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns",
      "cardboard shipper box,six rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns",
      "cardboard shipper box,four rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns",
      "cardboard shipper box,two rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns",
      "cardboard shipper box,fourteen rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns,visible gap",
      "cardboard shipper box,twelve rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns,visible gap",
      "cardboard shipper box,ten rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns,visible gap",
      "cardboard shipper box,eight rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns,visible gap",
      "cardboard shipper box,six rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns,visible gap",
      "cardboard shipper box,four rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns,visible gap",
      "cardboard shipper box,two rows and two columns,neatly aligned cartons,readable labels on each box,clear spacing between columns,visible gap",
    ],

      "Wet Lens": [
        "hole present in optical region,lens surface,high contrast,neutral background,sharp focus,low glare"
        "fiber present in optical region,thin thread like structure,lens surface,high contrast,neutral background,sharp focus,low glare" 
        "foreign material present in optical region,dark irregular particle,lens surface,high contrast,neutral background,sharp focus,low glare"
  
    ],
    "IOL Lens": [
      "monofocal,fov,bright field,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field bit-1,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field bit-2,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field bit-3,lens,haptics,fracture,high resolution",
      "monofocal,fov,dark field,lens,haptics,fracture,high resolution",
      "monofocal,fov,bright field,lens,broken haptic,high resolution",
      "monofocal,fov,dark field bit-1,lens,broken haptic,high resolution",
      "monofocal,fov,dark field bit-2,lens,broken haptic,high resolution",
      "monofocal,fov,dark field bit-3,lens,broken haptic,high resolution",
      "monofocal,fov,dark field,lens,broken haptic,high resolution",
      "multifocal,toric,fov,bright field,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,bubble,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,bubble,high resolution",
      "multifocal,toric,single spot,lens,bubble,high resolution",
      "multifocal,toric,fov,bright field,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,tool mark,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,tool mark,high resolution",
      "monofocal,fov,bright field,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field bit-1,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field bit-2,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field bit-3,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,dark field,lens,haptic tip and gusset damage,high resolution",
      "monofocal,fov,bright field,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field bit-1,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field bit-2,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field bit-3,lens,haptics,optic edge damage,high resolution",
      "monofocal,fov,dark field,lens,haptics,optic edge damage,high resolution",
      "monofocal,single spot,lens,optic edge damage,high resolution",
      "toric,fov,dark field,lens,haptics,orange peel,high resolution",
      "toric,single spot,lens,orange peel,high resolution",
      "multifocal,toric,fov,bright field,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,flash,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,flash,high resolution",
      "multifocal,toric,single spot,lens,flash,high resolution",
      "multifocal,toric,fov,bright field,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptic damage,high resolution",
      "multifocal,toric,fov,dark field,lens,haptic damage,high resolution",
      "toric,fov,bright field,lens,narrow haptic,high resolution",
      "toric,fov,dark field bit-1,lens,narrow haptic,high resolution",
      "toric,fov,dark field bit-2,lens,narrow haptic,high resolution",
      "toric,fov,dark field bit-3,lens,narrow haptic,high resolution",
      "toric,fov,dark field,lens,narrow haptic,high resolution",
      "multifocal,toric,fov,bright field,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,optic surface damage,high resolution",
      "multifocal,toric,single spot,lens,optic surface damage,high resolution",
      "multifocal,fov,dark field bit-1,lens,haptics,haze,high resolution",
      "multifocal,fov,dark field bit-2,lens,haptics,haze,high resolution",
      "multifocal,fov,dark field bit-3,lens,haptics,haze,high resolution",
      "multifocal,toric,fov,bright field,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field bit-1,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field bit-2,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field bit-3,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,fov,dark field,lens,haptics,strings,fibres,high resolution",
      "multifocal,toric,single spot,lens,strings,fibres,high resolution",
      "multifocal,fov,bright field,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field bit-1,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field bit-2,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field bit-3,lens,haptics,water underfill,high resolution",
      "multifocal,fov,dark field,lens,haptics,water underfill,high resolution",
      "multifocal,fov,bright field,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field bit-1,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field bit-2,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field bit-3,lens,haptics,particulate,high resolution",
      "multifocal,fov,dark field,lens,haptics,particulate,high resolution",
      "multifocal,single spot,lens,particulate,high resolution",
      "monofocal,fov,single spot,lens,scratch,high resolution",
    ],
  };

  // Inpenting Prompts

  const promptListInpenting = {
    "LS3 BV": [
      "single spot,air bubble",
      "single spot,dosing bubble",
      "single spot,edge tear",
      "single spot,edge gap",
      "single spot,ehacm",
      "single spot,material foam",
      "single spot,particle inclusion",
      "single spot,water schlieren",
      "phase contrast,air bubble",
      "phase contrast,dosing bubble",
      "phase contrast,edge tear",
      "phase contrast,edge gap",
      "phase contrast,ehacm",
      "phase contrast,material foam",
      "phase contrast,particle inclusion",
      "phase contrast,water schlieren",
      "clean lens surface",
    ],
    "LPC Color": [
      "edge gap on lens edge",
      "edge tear on lens edge",
      "hole on the lens surface",
    ],
    "IOL Lens": [""],
  };

  const fuse = useMemo(
    () =>
      new Fuse(
        isInpenting
          ? promptListInpenting[selectedProject]
          : promptList[selectedProject],
        {
          threshold: 0.3, // Lower threshold for more aggressive matching
          includeScore: true,
        }
      ),
    [promptList, selectedProject, isInpenting]
  );

  const updateBestMatch = (value) => {
    if (value.trim()) {
      const results = fuse.search(value);
      if (results.length > 0) {
        // Find the best match (lowest score)
        const best = results.reduce((prev, current) =>
          prev.score < current.score ? prev : current
        );
        setBestMatch(best.item);
      } else {
        setBestMatch("");
      }
    } else {
      setBestMatch("");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputPrompt(value);
    updateBestMatch(value);

    if (value.trim()) {
      const results = fuse.search(value).map((result) => result.item);
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && bestMatch) {
      e.preventDefault();
      setInputPrompt(bestMatch);
      setBestMatch("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputPrompt(suggestion);
    setBestMatch("");
    setShowSuggestionsPopup(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPopupPosition({ x: e.clientX, y: e.clientY });
    setShowSuggestionsPopup(true);

    if (inputPrompt.trim()) {
      const results = fuse.search(inputPrompt).map((result) => result.item);
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions(
        isInpenting
          ? promptListInpenting[selectedProject].slice(0, 10)
          : promptList[selectedProject].slice(0, 10)
      );
    }
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowSuggestionsPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <section>
      <div
        className={`border px-2 mx-2 py-1 dark:bg-neutral-800 bg-gray-200 shadow-md rounded-md overflow-hidden ${
          openSections.includes("prompt")
            ? "border-gray-500"
            : "dark:border-gray-600 border-gray-400"
        } transition-all duration-300`}
      >
        <label
          htmlFor="promptInput"
          className="cursor-pointer text-sm px-1 dark:hover:text-neutral-400 hover:text-indigo-600 flex"
          onClick={() => toggleSection("prompt")}
        >
          <TbPrompt className="mt-1" />
          <span className="ml-2">Comma-based prompts</span>
        </label>

        {openSections.includes("prompt") && (
          <div className="relative" ref={inputRef}>
            {/* Ghost text for autocomplete suggestion */}
            {bestMatch && (
              <div
                ref={ghostRef}
                className="absolute top-2 left-1 pointer-events-none text-gray-400 dark:text-gray-500 italic text-xs whitespace-pre-wrap break-words"
                style={{
                  zIndex: 1,
                  width: "calc(100% - 0.5rem)",
                  minHeight: "5rem",
                }}
              >
                {inputPrompt}
                <span className="text-gray-300 dark:text-gray-600">
                  {bestMatch.substring(inputPrompt.length)}
                </span>
              </div>
            )}
            <textarea
              id="promptInput"
              value={inputPrompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onContextMenu={handleContextMenu}
              placeholder="Right-click for prompt suggestions..."
              className="w-full scrollbar-dark italic h-auto p-1 mt-1 border-none min-h-20 text-xs font-roboto transition-all bg-transparent rounded focus:outline-none focus:border-none relative z-10"
              required
              spellCheck="false"
              style={{ backgroundColor: "transparent" }}
            />

            {/* Suggestions Popup */}
            {showSuggestionsPopup && (
              <div
                className="fixed z-50 w-64 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-y-auto scrollbar-hidden"
                style={{
                  left: `${popupPosition.x}px`,
                  top: `${popupPosition.y}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 border-b dark:border-gray-700 bg-gray-100 dark:bg-neutral-700 flex justify-between items-center">
                  <h3 className="text-sm font-medium">Prompt Suggestions</h3>
                  <button
                    onClick={() => setShowSuggestionsPopup(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <IoClose className="w-4 h-4" />
                  </button>
                </div>
                <ul>
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 text-xs cursor-pointer hover:bg-indigo-600 hover:text-white transition-all"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-xs text-gray-500">
                      No suggestions available
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Negative prompt section */}
      <div
        className={`border mt-3 ${
          isInpenting ? "hidden" : ""
        } px-2 mx-2 py-1 dark:bg-neutral-800 bg-gray-200 shadow-md rounded-md overflow-hidden ${
          openSections.includes("negativePrompt")
            ? "border-gray-500"
            : "dark:border-gray-600 border-gray-400"
        } transition-all duration-300`}
      >
        <label
          htmlFor="negativePromptInput"
          className="cursor-pointer text-sm px-1 flex dark:hover:text-neutral-400 hover:text-indigo-600"
          onClick={() => toggleSection("negativePrompt")}
        >
          <MdOutlineGesture className="mt-1" />
          <span className="ml-2">Negative Prompt</span>
        </label>
        {openSections.includes("negativePrompt") && (
          <textarea
            id="negativePromptInput"
            type="text"
            value={negativeInputPrompt}
            placeholder="(Optional)"
            spellCheck="false"
            className="w-full scrollbar-dark text-justify h-auto p-1 mt-1 border-none min-h-12 text-xs font-roboto transition-all bordernone bg-transparent rounded focus:outline-none focus:border-none"
          />
        )}
      </div>
    </section>
  );
};

export default InputPrompt;
