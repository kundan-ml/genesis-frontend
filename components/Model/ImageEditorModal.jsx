import React, { useState, useRef, useEffect } from 'react';

const ImageEditorModal = ({ imageUrl, prompt, closeModal }) => {
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState('line'); // Default tool: line
  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(2);
  const [annotations, setAnnotations] = useState([]); // Store all annotations
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [currentAnnotation, setCurrentAnnotation] = useState(null);

  // Load image dimensions
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [imageUrl]);

  // Handle drawing on the canvas
  const handleMouseDown = (event) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const startX = event.nativeEvent.offsetX;
    const startY = event.nativeEvent.offsetY;
    setDrawing(true);

    setCurrentAnnotation({
      startX,
      startY,
      color,
      lineWidth,
      tool,
      endX: startX,
      endY: startY,
    });
  };

  const handleMouseMove = (event) => {
    if (!drawing || !canvasRef.current || !currentAnnotation) return;

    const ctx = canvasRef.current.getContext('2d');
    const { startX, startY, tool } = currentAnnotation;
    const endX = event.nativeEvent.offsetX;
    const endY = event.nativeEvent.offsetY;

    setCurrentAnnotation((prev) => ({
      ...prev,
      endX,
      endY,
    }));

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawAnnotations(ctx);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tool === 'square') {
      const sideLength = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
      ctx.strokeRect(startX, startY, sideLength, sideLength);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    if (currentAnnotation) {
      setAnnotations((prev) => [...prev, currentAnnotation]);
    }
    setCurrentAnnotation(null);
  };

  // Draw existing annotations on the canvas
  const drawAnnotations = (ctx) => {
    annotations.forEach((annotation) => {
      const { startX, startY, endX, endY, color, lineWidth, tool } = annotation;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'square') {
        const sideLength = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
        ctx.strokeRect(startX, startY, sideLength, sideLength);
      }
    });
  };

  // Handle save image
  const saveImage = () => {
    if (!canvasRef.current) return;

    const canvasDataUrl = canvasRef.current.toDataURL();
    const link = document.createElement('a');
    link.href = canvasDataUrl;
    link.download = 'edited_image.png';
    link.click();
  };

  // Share image and prompt on social media
  const shareImage = () => {
    if (!canvasRef.current) return;

    const canvasDataUrl = canvasRef.current.toDataURL();
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(prompt)}&url=${encodeURIComponent(canvasDataUrl)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit Image</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tool Selection */}
        <div className="mb-4">
          <label className="mr-4">Tool: </label>
          <select value={tool} onChange={(e) => setTool(e.target.value)} className="p-2 border border-gray-300 rounded">
            <option value="line">Line</option>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
          </select>
        </div>

        {/* Color and Line Width */}
        <div className="mb-4">
          <label className="mr-4">Color: </label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="mr-4">Line Width: </label>
          <input type="range" min="1" max="10" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} />
        </div>

        {/* Image and Canvas */}
        <div className="relative">
          <img ref={imageRef} src={imageUrl} alt="Image to Edit" className="w-full h-auto rounded" />
          <canvas
            ref={canvasRef}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="absolute top-0 left-0 w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          <button onClick={saveImage} className="bg-blue-500 text-white px-4 py-2 rounded">Save Image</button>
          <button onClick={shareImage} className="bg-green-500 text-white px-4 py-2 rounded">Share on Twitter</button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
