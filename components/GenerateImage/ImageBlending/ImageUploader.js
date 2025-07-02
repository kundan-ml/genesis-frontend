import React, { useRef, useEffect } from "react";
import { AiOutlineCloudUpload, AiOutlineExpand } from "react-icons/ai";

const ImageUploader = ({
  imageNum,
  uploadedImage,
  handleImageUpload,
  roi,
  setRoi,
  tempRoi,
  setTempRoi,
  setExpandedForROI,
  isPdf,
  isPdfLoading,
  totalPages,
  currentPage,
  handlePageChange,
  isDefault,
}) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (img && canvas) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      if (roi && img.naturalWidth > 0) {
        const scaleX = img.offsetWidth / img.naturalWidth;
        const scaleY = img.offsetHeight / img.naturalHeight;

        const displayRoi = {
          x: roi.x * scaleX,
          y: roi.y * scaleY,
          width: roi.width * scaleX,
          height: roi.height * scaleY,
        };

        drawRoiOnCanvas(canvas, displayRoi);
      }
    }
  };

  const drawRoiOnCanvas = (canvas, roi, color = "#ff0000") => {
    if (!canvas || !roi) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const roundedRoi = {
      x: Math.round(roi.x),
      y: Math.round(roi.y),
      width: Math.round(roi.width),
      height: Math.round(roi.height)
    };

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(roundedRoi.x, roundedRoi.y, roundedRoi.width, roundedRoi.height);
    
    ctx.fillStyle = color;
    const fontSize = canvas.width > 500 ? "16px" : "12px";
    ctx.font = `${fontSize} Arial`;
    ctx.fillText(
      `${roundedRoi.width}x${roundedRoi.height}`,
      roundedRoi.x + roundedRoi.width / 2 - 30,
      roundedRoi.y + roundedRoi.height / 2
    );
  };

  const startDrawingRect = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRoi({ x, y, width: 0, height: 0 });
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawRect = (e) => {
    if (!roi || !roi.x) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    
    const width = mouseX - roi.x;
    const height = mouseY - roi.y;
    ctx.strokeRect(roi.x, roi.y, width, height);
    
    ctx.fillStyle = "#00ff00";
    const fontSize = canvas.width > 500 ? "16px" : "12px";
    ctx.font = `${fontSize} Arial`;
    ctx.fillText(
      `${Math.abs(width)}x${Math.abs(height)}`,
      roi.x + width / 2 - 30,
      roi.y + height / 2
    );
  };

  const finishDrawingRect = (e) => {
    if (!roi || !roi.x) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const img = imgRef.current;

    const width = mouseX - roi.x;
    const height = mouseY - roi.y;

    if (Math.abs(width) > 2 && Math.abs(height) > 2) {
      const scaleX = img.naturalWidth / img.offsetWidth;
      const scaleY = img.naturalHeight / img.offsetHeight;

      const naturalRoi = {
        x: Math.round(roi.x * scaleX),
        y: Math.round(roi.y * scaleY),
        width: Math.round(width * scaleX),
        height: Math.round(height * scaleY),
      };

      setRoi(naturalRoi);
      drawRoiOnCanvas(canvas, roi);
    } else {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setRoi(null);
    }
  };

  useEffect(() => {
    if (uploadedImage && imgRef.current?.complete) {
      initCanvas();
    }
  }, [uploadedImage, roi]);

  return (
    <div className="border dark:border-gray-600 border-gray-300 rounded-lg p-2">
      <div className="relative">
        <label
          className="flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer dark:hover:bg-neutral-700 hover:bg-gray-300 transition duration-300 dark:border-gray-500 dark:bg-neutral-800 dark:text-gray-400 border-indigo-300 bg-gray-100 text-gray-900"
          onMouseDown={(e) => {
            if (uploadedImage) e.preventDefault();
          }}
        >
          {isPdfLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Loading PDF...
              </p>
            </div>
          ) : uploadedImage ? (
            <div className="relative">
              <img
                ref={imgRef}
                id={`image${imageNum}`}
                src={isDefault || uploadedImage}
                alt={`Uploaded ${imageNum}`}
                className="max-h-96 w-auto object-contain rounded-md"
                onLoad={initCanvas}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                onMouseDown={startDrawingRect}
                onMouseMove={drawRect}
                onMouseUp={finishDrawingRect}
                onMouseLeave={finishDrawingRect}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTempRoi({ ...tempRoi, [`roi${imageNum}`]: roi });
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
              >
                <AiOutlineExpand
                  size={20}
                  onClick={(e) => {
                    setExpandedForROI(`image${imageNum}`);
                  }}
                />
              </button>
            </div>
          ) : (
            <>
              <AiOutlineCloudUpload className="h-12 w-12 dark:text-gray-500 text-indigo-600" />
              <span className="text-sm mt-2 dark:text-gray-500 text-indigo-600">
                Click to upload {imageNum === 1 ? "Raw Image" : "Photo Image or PDF"}
              </span>
            </>
          )}
          <input
            type="file"
            accept={imageNum === 1 ? "image/*" : "image/*,.pdf"}
            onChange={(e) => handleImageUpload(e, imageNum === 2)}
            className="hidden"
          />
        </label>
      </div>

      {isPdf && totalPages > 0 && (
        <div className="mt-3 flex items-center justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-l-md disabled:opacity-50"
          >
            &lt;
          </button>
          <div className="px-4 py-1 bg-gray-100 dark:bg-gray-800">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-r-md disabled:opacity-50"
          >
            &gt;
          </button>

          <div className="ml-4">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(parseInt(e.target.value))}
              className="w-16 p-1 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;