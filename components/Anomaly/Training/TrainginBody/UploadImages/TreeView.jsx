import React, { useState } from 'react';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';

const TreeNode = ({ name, children, isFolder, isOpen, onToggle }) => (
  <div className={`relative flex items-center mb-2 ${isFolder ? 'pl-6' : 'pl-8'}`}>
    <div className="relative flex items-center cursor-pointer" onClick={onToggle}>
      {isFolder ? (
        isOpen ? (
          <FaFolderOpen className="text-yellow-300 mr-2 text-2xl transition-transform transform rotate-0" />
        ) : (
          <FaFolder className="text-blue-400 mr-2 text-2xl transition-transform transform rotate-0" />
        )
      ) : (
        <FaFolder className="text-neutral-500 mr-2 text-2xl" />
      )}
      <span className={`text-lg font-medium ${isFolder ? 'text-blue-200' : 'text-neutral-300'} transition-colors duration-300`}>
        {name}
      </span>
    </div>
    {isFolder && isOpen && (
      <div className="ml-6 border-l-2 border-blue-600 pl-4">
        {children}
      </div>
    )}
    {isFolder && (
      <div className={`absolute top-1/2 left-0 w-2 h-2 bg-blue-400 rounded-full ${isOpen ? 'animate-pulse' : 'hidden'}`}></div>
    )}
  </div>
);

const TreeView = ({ data }) => {
  const [openFolders, setOpenFolders] = useState({});

  const handleToggle = (name) => {
    setOpenFolders((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const renderTree = (node) => {
    if (!node) return null;

    return (
      <div>
        {Object.entries(node).map(([key, value]) => (
          <TreeNode
            key={key}
            name={key}
            isFolder={Boolean(value && !value.file)}
            isOpen={!!openFolders[key]}
            onToggle={() => handleToggle(key)}
          >
            {value && !value.file && renderTree(value)}
          </TreeNode>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-neutral-800 p-6 h-[28vh] overflow-auto scrollbar-dark rounded-md shadow-lg max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold text-neutral-200 mb-4">Folder Structure</h3>
      {renderTree(data.children)}
    </div>
  );
};

export default TreeView;
