import React from "react";
import { FaShareAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const UserPopup = ({ users, isOpen, onClose, subPromptId, username }) => {
  if (!isOpen) return null;

  const BACKEND_URL = process.env.BACKEND_URL;

  const handleShareClick = (receiverName) => {
    fetch(`${BACKEND_URL}/api/share/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: username,
        subprompt_id: subPromptId,
        receiver: receiverName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Share action successful:", data);
      })
      .catch((error) => {
        alert("Error sharing:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-bl from-black via-gray-900 to-purple-900 bg-opacity-80 flex justify-center items-center z-50">
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-[30px] shadow-2xl w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[85vh] overflow-hidden border border-gray-700">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-5 left-5 w-32 h-32 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-tl from-green-500 to-teal-400 rounded-full blur-2xl opacity-40 animate-spin-slow"></div>
          <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-bl from-yellow-400 to-orange-500 rounded-full blur-lg opacity-30 animate-bounce"></div>
          <div className="absolute inset-0 bg-noise opacity-10"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center mb-10">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-yellow-500 tracking-wide">
            Share with Users
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition duration-300 transform hover:rotate-90 hover:scale-125"
          >
            <MdClose size={30} />
          </button>
        </div>

        {/* User List */}
        <div className="relative z-10 p-6 bg-black bg-opacity-60 rounded-2xl shadow-inner overflow-y-scroll scrollbar-dark max-h-[65vh]">
          {users.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {users.map((user, index) => (
                <li
                onClick={() => handleShareClick(user.name)}
                  key={index}
                  className="flex justify-between items-center p-2 bg-gradient-to-r from-indigo-700 via-purple-800 to-gray-800 hover:from-indigo-600 hover:via-purple-700 hover:to-gray-700 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-red-500 rounded-full flex justify-center items-center text-white text-lg font-extrabold shadow-sm">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {user.name}
                    </span>
                  </div>
                  <button
                    // onClick={() => handleShareClick(user.name)}
                    className="text-pink-400 hover:text-pink-500 transform hover:scale-125 transition duration-300"
                  >
                    <FaShareAlt size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400 text-lg">No users found.</p>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-6 mb-0 flex justify-center">
          <button
            onClick={onClose}
            className="px-20 py-1 bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:from-pink-600 hover:to-red-700 transform hover:scale-110 transition duration-300 border-2 border-white text-lg"
          >
            Close
          </button>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-8 right-8 w-6 h-6 bg-pink-500 rounded-full animate-bounce shadow-sm"></div>
        <div className="absolute bottom-8 left-8 w-8 h-8 bg-blue-500 rounded-full animate-bounce shadow-md"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-t from-yellow-500 to-red-400 rounded-full blur-md opacity-50 animate-pulse"></div>
      </div>
    </div>
  );
};

export default UserPopup;
