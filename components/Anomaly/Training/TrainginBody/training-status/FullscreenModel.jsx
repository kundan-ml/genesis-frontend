// components/FullScreenModal.js
import { motion } from 'framer-motion';

const FullScreenModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 dark:bg-black bg-white bg-opacity-75 flex items-center justify-center z-40">
      <div className=" p-0 rounded-lg shadow-lg w-full h-[100vh] ">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default FullScreenModal;