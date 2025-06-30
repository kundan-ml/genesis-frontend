import React, { useState } from 'react'
import { Circle, Square, Pencil } from 'lucide-react'

const SelectTool = ({ onSelectTool, selectedTool, setSelectedTool, clearAllShapes }) => {
//   const [selectedTool, setSelectedTool] = useState(null)

  const handleToolSelect = (tool) => {
    setSelectedTool(tool)
    if (onSelectTool) {
      onSelectTool(tool)
    }
  }

  return (
    <div className="w-auto h-14 -mt-8 ml-20 z-50 bg-neutral-700 border border-gray-400 flex items-center px-4 space-x-4">
      {[
        { tool: 'rectangle', label: 'Rectangle (Raw)', icon: Square },
        { tool: 'sam_rectangle', label: 'Rectangle (SAM)', icon: Square },
        { tool: 'circle', label: 'Circle', icon: Circle },
        { tool: 'freehand', label: 'Free Draw', icon: Pencil },
      ].map(({ tool, label, icon: Icon }) => (
        <button
          key={tool}
          className={`flex items-center px-4 py-1 text-white font-medium rounded-lg transition-all
            ${selectedTool === tool ? 'bg-blue-600' : 'bg-neutral-800 hover:bg-neutral-600'}
            border ${selectedTool === tool ? 'border-blue-400' : 'border-gray-500'}
            focus:outline-none focus:ring-2 focus:ring-blue-400`}
          onClick={() => handleToolSelect(tool)}
        >
          <Icon className="w-5 h-5 mr-2" />
          {label}
        </button>
      ))}
            <div className="flex justify-between items-center ">
        <button 
          onClick={clearAllShapes}
          className="bg-gray-500 text-white px-4 py-1 rounded-md"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

export default SelectTool
