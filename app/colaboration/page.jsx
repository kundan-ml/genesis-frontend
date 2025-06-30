'use client';
import React, { useState } from 'react';
import { FaPaperPlane, FaImage, FaCheck, FaClock } from 'react-icons/fa';

const RealTimeChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const sendMessage = () => {
    if (newMessage.trim() || imageFiles.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "You",
          receiver: "User2",
          text: newMessage,
          images: imageFiles,
          seen: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setNewMessage("");
      setImageFiles([]);
    }
  };

  const handleFileUpload = (e) => {
    setImageFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans">
      {/* Chat Header */}
      <div className="bg-green-500 text-white p-4 flex items-center shadow-md">
        <div className="rounded-full bg-gray-300 w-10 h-10 flex-shrink-0"></div>
        <div className="ml-4">
          <p className="font-semibold">User2</p>
          <p className="text-sm">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-200">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow-md ${
                msg.sender === "You"
                  ? "bg-green-400 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.text && <p className="mb-2 text-sm">{msg.text}</p>}
              {msg.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {msg.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt={`Attachment ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              <div className="text-xs flex items-center justify-between">
                <span>{msg.timestamp}</span>
                {msg.sender === "You" && (
                  <FaCheck className={msg.seen ? "text-blue-500" : "text-gray-500"} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white flex items-center border-t border-gray-300">
        <label htmlFor="file-upload" className="cursor-pointer text-green-500 mr-2">
          <FaImage size={20} />
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-green-300"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-green-500 text-white p-2 rounded-full flex items-center justify-center"
        >
          <FaPaperPlane size={18} />
        </button>
      </div>
    </div>
  );
};

export default RealTimeChat;
