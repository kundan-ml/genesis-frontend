'use client';
import React, { useState } from 'react';

const Tutorial2 = () => {
  const [selectedProject, setSelectedProject] = useState('LS3 BV');
  const [prompts, setPrompts] = useState('');
  const [numImages, setNumImages] = useState(1);
  const [advancedSettings, setAdvancedSettings] = useState({
    seed: 42,
    promptStrength: 7.5,
    generationSteps: 25,
    model: 'LensAI-v1-512',
  });

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const handlePromptChange = (e) => {
    setPrompts(e.target.value);
  };

  const handleImageChange = (e) => {
    setNumImages(e.target.value);
  };

  const handleSettingsChange = (key, value) => {
    setAdvancedSettings({ ...advancedSettings, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-neutral-900 to-black text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-teal-400 animate-pulse">
          Welcome to Genie Genesis
        </h1>
        <p className="text-center text-gray-400 mb-12">
          A step-by-step guide to create stunning AI-generated images.
        </p>

        {/* Project Selection */}
        <div className="mb-8 p-6 rounded-lg bg-neutral-900 shadow-xl transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
            <span className="material-icons-outlined mr-2">folder_open</span>
            Select Project
          </h2>
          <select
            className="w-full bg-neutral-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
            value={selectedProject}
            onChange={handleProjectChange}
          >
            <option value="LS3 BV">LS3 BV</option>
            <option value="LS3 LPC">LS3 LPC</option>
            <option value="IOL LENS">IOL LENS</option>
          </select>
        </div>

        {/* Prompts Input */}
        <div className="mb-8 p-6 rounded-lg bg-neutral-900 shadow-xl transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
            <span className="material-icons-outlined mr-2">edit</span>
            Enter Prompts
          </h2>
          <textarea
            className="w-full bg-neutral-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
            placeholder={`Enter prompts separated by commas. For example:\n"ls3 bv, single spot, contact lens, cuvette, multiple air bubbles"`}
            value={prompts}
            onChange={handlePromptChange}
          />
        </div>

        {/* Number of Images */}
        <div className="mb-8 p-6 rounded-lg bg-neutral-900 shadow-xl transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
            <span className="material-icons-outlined mr-2">image</span>
            Number of Images
          </h2>
          <input
            type="number"
            className="w-full bg-neutral-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
            value={numImages}
            onChange={handleImageChange}
            min={1}
          />
        </div>

        {/* Advanced Settings */}
        <div className="mb-8 p-6 rounded-lg bg-neutral-900 shadow-xl transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
            <span className="material-icons-outlined mr-2">settings</span>
            Advanced Settings
          </h2>
          <div className="mb-4">
            <label className="block text-sm text-teal-400">Seed</label>
            <input
              type="number"
              className="w-full bg-neutral-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
              value={advancedSettings.seed}
              onChange={(e) => handleSettingsChange('seed', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-teal-400">Prompt Strength (Ideal: 7.5)</label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              className="w-full bg-neutral-700 focus:outline-none focus:ring focus:ring-teal-500"
              value={advancedSettings.promptStrength}
              onChange={(e) => handleSettingsChange('promptStrength', e.target.value)}
            />
            <p className="text-sm text-gray-400">Current Value: {advancedSettings.promptStrength}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-teal-400">Generation Steps (Ideal: 25)</label>
            <input
              type="number"
              className="w-full bg-neutral-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
              value={advancedSettings.generationSteps}
              onChange={(e) => handleSettingsChange('generationSteps', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-teal-400">Model Selection</label>
            <select
              className="w-full bg-neutral-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
              value={advancedSettings.model}
              onChange={(e) => handleSettingsChange('model', e.target.value)}
            >
              <option value="LensAI-v1-512">LensAI-v1-512 (Best Option)</option>
              <option value="OtherModel-v2">OtherModel-v2</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring focus:ring-teal-500 shadow-xl">
            Generate Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial2;
