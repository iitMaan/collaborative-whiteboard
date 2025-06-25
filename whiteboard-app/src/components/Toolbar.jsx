import React from 'react';

const Toolbar = ({ activeTool, setActiveTool, color, setColor, brushSize, setBrushSize }) => {
  const handleToolClick = (tool) => {
    if (activeTool === tool) {
      setActiveTool(null); // Deselect if clicked again
    } else {
      setActiveTool(tool);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Tool Buttons */}
      <div className="flex gap-2">
        {['pencil', 'rectangle', 'circle', 'text', 'eraser'].map(tool => (
          <button
            key={tool}
            onClick={() => handleToolClick(tool)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all duration-150 
              ${activeTool === tool
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
          >
            {tool}
          </button>
        ))}
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-2 ml-4">
        <label className="text-sm text-gray-600">Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Brush Color"
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Brush Size Slider */}
      <div className="flex items-center gap-2 ml-4">
        <label className="text-sm text-gray-600">Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          title="Brush Size"
          className="w-32 cursor-pointer accent-blue-500"
        />
        <span className="text-sm text-gray-600">{brushSize}px</span>
      </div>
    </div>
  );
};

export default Toolbar;
