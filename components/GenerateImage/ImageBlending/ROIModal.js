import React, { useRef, useEffect, useState } from "react";
import Modal from "react-modal";

const ROIModal = ({
  expandedForROI,
  setExpandedForROI,
  uploadedImage1,
  uploadedImage2,
  isDefault,
  tempRoi,
  roi1,
  roi2,
  setRoi1,
  setRoi2,
  saveModalROI,
}) => {
  const modalCanvasRef = useRef(null);
  const modalImgRef = useRef(null);
  const [modalRoi, setModalRoi] = useState(null);
  const [modalStartPos, setModalStartPos] = useState({ x: 0, y: 0 });
  const [isModalDrawing, setIsModalDrawing] = useState(false);

  const initModalCanvas = () => {
    const canvas = modalCanvasRef.current;
    const img = modalImgRef.current;
    if (img && canvas) {
      canvas.width = img.offsetWidth;
      canvas.height = img.offsetHeight;

      const existingRoi =
        expandedForROI === "image1"
          ? tempRoi.roi1 || roi1
          : tempRoi.roi2 || roi2;

      if (existingRoi) {
        const scaleX = img.offsetWidth / img.naturalWidth;
        const scaleY = img.offsetHeight / img.naturalHeight;

        const displayRoi = {
          x: existingRoi.x * scaleX,
          y: existingRoi.y * scaleY,
          width: existingRoi.width * scaleX,
          height: existingRoi.height * scaleY,
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
    ctx.font = "16px Arial";
    ctx.fillText(
      `${roundedRoi.width}x${roundedRoi.height}`,
      roundedRoi.x + roundedRoi.width / 2 - 30,
      roundedRoi.y + roundedRoi.height / 2
    );
  };

  const handleModalMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const canvas = modalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setModalStartPos({ x, y });
    setIsModalDrawing(true);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleModalMouseMove = (e) => {
    if (!isModalDrawing) return;
    e.preventDefault();
    const canvas = modalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      modalStartPos.x,
      modalStartPos.y,
      mouseX - modalStartPos.x,
      mouseY - modalStartPos.y
    );

    const width = Math.abs(mouseX - modalStartPos.x);
    const height = Math.abs(mouseY - modalStartPos.y);
    ctx.fillStyle = "#00ff00";
    ctx.font = "16px Arial";
    ctx.fillText(
      `${width}x${height}`,
      modalStartPos.x + width / 2 - 30,
      modalStartPos.y + height / 2
    );
  };

  const handleModalMouseUp = (e) => {
    if (!isModalDrawing) return;
    e.preventDefault();
    const canvas = modalCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const x = Math.min(modalStartPos.x, endX);
    const y = Math.min(modalStartPos.y, endY);
    const width = Math.abs(endX - modalStartPos.x);
    const height = Math.abs(endY - modalStartPos.y);

    if (width > 2 && height > 2) {
      const roi = { x, y, width, height };
      setModalRoi(roi);

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "#ff0000";
      ctx.font = "16px Arial";
      ctx.fillText(`${width}x${height}`, x + width / 2 - 30, y + height / 2);
    }

    setIsModalDrawing(false);
  };

  const saveModalROIHandler = () => {
    if (modalRoi) {
      const img = modalImgRef.current;
      if (img) {
        const scaleX = img.naturalWidth / img.offsetWidth;
        const scaleY = img.naturalHeight / img.offsetHeight;

        const naturalRoi = {
          x: Math.round(modalRoi.x * scaleX),
          y: Math.round(modalRoi.y * scaleY),
          width: Math.round(modalRoi.width * scaleX),
          height: Math.round(modalRoi.height * scaleY),
        };

        if (expandedForROI === "image1") {
          setRoi1(naturalRoi);
          setTempRoi({ ...tempRoi, roi1: naturalRoi });
        } else {
          setRoi2(naturalRoi);
          setTempRoi({ ...tempRoi, roi2: naturalRoi });
        }
      }
    }
    saveModalROI();
  };

  useEffect(() => {
    if (expandedForROI && modalImgRef.current?.complete) {
      initModalCanvas();
    }
  }, [expandedForROI]);

  return (
    <Modal
      isOpen={!!expandedForROI}
      onRequestClose={() => setExpandedForROI(null)}
      className="bg-neutral-900 w-3/4 mx-auto mt-5 h-[95vh]"
      overlayClassName="modal-overlay"
    >
      <div className="relative flex flex-col items-center max-h-[94vh]">
        <div className="flex border-b w-full my-2">
          <h2 className="text-lg mx-auto text-gray-300 font-bold mb-2 dark:text-white">
            Draw ROI on {expandedForROI === "image1" ? "Raw Image" : "Photo Image"}
          </h2>

          <button
            onClick={saveModalROIHandler}
            className="absolute right-6 h-8 w-8 flex items-center justify-center text-gray-300 hover:text-white font-extrabold rounded-full cursor-pointer hover:rotate-45 transition-transform duration-200"
          >
            ✕
          </button>
        </div>

        <div className="relative border-2 border-blue-400 rounded-lg overflow-auto">
          {expandedForROI === "image1" && uploadedImage1 && (
            <img
              src={uploadedImage1}
              alt="Full size Raw Image"
              className="max-h-[85vh] max-w-full object-contain"
              ref={modalImgRef}
              onLoad={initModalCanvas}
            />
          )}
          {expandedForROI === "image2" && (uploadedImage2 || isDefault) && (
            <img
              src={isDefault || uploadedImage2}
              alt="Full size Photo Image"
              className="max-h-[85vh] max-w-full object-contain"
              ref={modalImgRef}
              onLoad={initModalCanvas}
            />
          )}
          <canvas
            ref={modalCanvasRef}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            onMouseDown={handleModalMouseDown}
            onMouseMove={handleModalMouseMove}
            onMouseUp={handleModalMouseUp}
            onMouseLeave={handleModalMouseUp}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ROIModal;