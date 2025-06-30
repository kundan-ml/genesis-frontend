import React, { useState, useRef, useEffect } from "react";

const ImageAnnotationPopup = ({ setEditImage, abotationImage }) => {
  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const canvasRef = useRef(null);
  const [annotationCount, setAnnotationCount] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  let imageSrc = abotationImage;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxWidth = 800;
      const maxHeight = 500;

      let width = maxWidth;
      let height = maxHeight;

      if (img.width > maxWidth || img.height > maxHeight) {
        if (img.width / maxWidth > img.height / maxHeight) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;
      setImageDimensions({ width, height });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      // Store the image for quick redraws
      canvas.image = img;

      drawAnnotations();
    };
  }, [imageSrc, annotations]);

  const drawAnnotations = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(canvas.image, 0, 0, canvas.width, canvas.height);

    annotations.forEach(({ x, y, width, height, comment, id }) => {
      ctx.strokeStyle = selectedAnnotation === id ? "#00FF00" : "#FF4C4C"; // Highlight selected
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw annotation text
      ctx.fillStyle = "#FF4C4C";
      ctx.font = "10px Arial";
      ctx.fillText(comment, x + 5, y + 10);
    });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setSelectedAnnotation(null); // Deselect any selected annotation
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    setCurrentAnnotation({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !currentAnnotation) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const width = (e.clientX - rect.left - currentAnnotation.x) * scaleX;
    const height = (e.clientY - rect.top - currentAnnotation.y) * scaleY;

    setCurrentAnnotation((prev) => ({
      ...prev,
      width,
      height,
    }));

    // Redraw
    drawAnnotations();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#FF4C4C";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(currentAnnotation.x, currentAnnotation.y, width, height);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (currentAnnotation.width && currentAnnotation.height) {
      const annotationText = prompt("Enter annotation text:");
      const newAnnotation = {
        ...currentAnnotation,
        comment: annotationText || "No comment",
        id: annotationCount,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      setAnnotationCount((prev) => prev + 1);
    }
    setCurrentAnnotation(null);
  };

  const handleDeleteAnnotation = () => {
    if (selectedAnnotation !== null) {
      setAnnotations((prev) => prev.filter((a) => a.id !== selectedAnnotation));
      setSelectedAnnotation(null);
    }
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const clickedAnnotation = annotations.find(
      ({ x, y, width, height }) =>
        clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height
    );

    if (clickedAnnotation) {
      setSelectedAnnotation(clickedAnnotation.id);
    } else {
      setSelectedAnnotation(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex z-50 items-center justify-center">
      <div className="bg-neutral-900 text-white p-6 rounded-2xl h-[96vh] shadow-xl relative w-auto">
        <button onClick={() => setEditImage(false)} className="absolute top-2 right-4 text-gray-400 hover:text-white">
          ✖
        </button>

        {selectedAnnotation !== null && (
          <button
            onClick={handleDeleteAnnotation}
            className="absolute top-16 right-8 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
          >
            Delete Annotation
          </button>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
          style={{ width: `auto`, height: `88vh` }}
          className="border border-gray-600 mt-2 rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageAnnotationPopup;
