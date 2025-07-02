import React from "react";
import Modal from "react-modal";

const ImageExpandedModal = ({
  expandedImage,
  closeModal,
  allImages,
  currentImageIndex,
  navigateImage,
  downloadAsBMP,
  downloadAllAsZip,
  BACKEND_URL,
}) => {
  const handleKeyDown = (e) => {
    if (expandedImage) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateImage("next");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateImage("prev");
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedImage, currentImageIndex, allImages]);

  return (
    <Modal
      isOpen={!!expandedImage}
      onRequestClose={closeModal}
      contentLabel="Expanded Image"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="relative h-full w-full flex items-center justify-center">
        {allImages.length > 1 && (
          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-4 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 z-10"
          >
            ←
          </button>
        )}
        <img
          src={expandedImage}
          alt="Expanded view"
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
        {allImages.length > 1 && (
          <button
            onClick={() => navigateImage("next")}
            className="absolute right-4 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 z-10"
          >
            →
          </button>
        )}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
        >
          ✕
        </button>
        <div className="absolute top-4 right-12 flex space-x-2">
          <button
            onClick={downloadAsBMP}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            title="Download current as BMP"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={downloadAllAsZip}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            title="Download all as ZIP"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
              <path d="M17 8V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3"></path>
            </svg>
          </button>
        </div>
        {allImages.length > 1 && (
          <div className="absolute bottom-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageExpandedModal;