'use client';

import React, { useState } from 'react';

const SharedPromptPage = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  // Dummy data for SharedPrompts
  const sharedPrompts = [
    {
      id: 1,
      receiver: "User1",
      sender: "User2",
      subPrompt: {
        id: 101,
        images: [
          "https://via.placeholder.com/150",
          "https://via.placeholder.com/200",
        ],
      },
      subject: "Example Subject",
      message: "This is a sample message.",
      status: "pending",
      tags: "tag1, tag2",
      visibility: "private",
      isDeleted: false,
      createdAt: "2024-12-06",
    },
    {
      id: 2,
      receiver: "User3",
      sender: "User4",
      subPrompt: {
        id: 102,
        images: ["https://via.placeholder.com/250"],
      },
      subject: "Another Subject",
      message: "This is another sample message.",
      status: "viewed",
      tags: "tag3",
      visibility: "public",
      isDeleted: false,
      createdAt: "2024-12-05",
    },
  ];

  const handleViewImages = (subPrompt) => {
    setSelectedPrompt(subPrompt);
  };

  const closeImageModal = () => {
    setSelectedPrompt(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
        Shared Prompts
      </h1>

      <div className="overflow-hidden shadow-xl rounded-xl bg-gray-800">
        <table className="w-full table-auto text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="p-4 text-left">Receiver</th>
              <th className="p-4 text-left">Sender</th>
              <th className="p-4 text-left">Subject</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Visibility</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sharedPrompts.map((prompt, index) => (
              <tr
                key={prompt.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                } hover:bg-gray-600 transition duration-300 ease-in-out`}
              >
                <td className="p-4 border-t border-gray-600">{prompt.receiver}</td>
                <td className="p-4 border-t border-gray-600">{prompt.sender}</td>
                <td className="p-4 border-t border-gray-600">{prompt.subject || "No Subject"}</td>
                <td className="p-4 border-t border-gray-600">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      prompt.status === "pending"
                        ? "bg-yellow-500 text-gray-900"
                        : prompt.status === "viewed"
                        ? "bg-blue-500 text-gray-100"
                        : "bg-green-500 text-gray-100"
                    }`}
                  >
                    {prompt.status}
                  </span>
                </td>
                <td className="p-4 border-t border-gray-600">
                  <span
                    className={`px-2 py-1 rounded ${
                      prompt.visibility === "public"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {prompt.visibility}
                  </span>
                </td>
                <td className="p-4 border-t border-gray-600">
                  <button
                    onClick={() => handleViewImages(prompt.subPrompt)}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 px-6 py-3 rounded-lg shadow-lg font-semibold transform transition-transform duration-300 hover:scale-105"
                  >
                    View Images
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to display images */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center transition-all duration-500 ease-in-out">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-3xl transform transition-all duration-300 scale-105">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
              Sub-Prompt Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {selectedPrompt.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Sub-Prompt ${selectedPrompt.id} Image ${index + 1}`}
                  className="rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-110"
                />
              ))}
            </div>
            <button
              onClick={closeImageModal}
              className="mt-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-700 hover:to-red-500 px-6 py-3 rounded-lg font-bold text-white shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedPromptPage;


// import React, { useState } from 'react';
// import { FaTimes, FaPaperPlane } from 'react-icons/fa';

// const SharedPromptChat = () => {
//   const [selectedPrompt, setSelectedPrompt] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Dummy data for SharedPrompts
//   const sharedPrompts = [
//     {
//       id: 1,
//       receiver: "User1",
//       sender: "User2",
//       subPrompt: {
//         id: 101,
//         sentences: [
//           "This is the first descriptive sentence of the sub-prompt.",
//           "Another example of a longer sentence for testing the chat layout."
//         ],
//       },
//       subject: "Creative Subject",
//       status: "pending",
//       visibility: "private",
//     },
//     {
//       id: 2,
//       receiver: "User3",
//       sender: "User4",
//       subPrompt: {
//         id: 102,
//         sentences: [
//           "A creative and descriptive sentence for the second prompt.",
//           "Adding more text to test the design dynamically."
//         ],
//       },
//       subject: "Another Cool Subject",
//       status: "viewed",
//       visibility: "public",
//     },
//   ];

//   const openChat = (subPrompt) => {
//     setSelectedPrompt(subPrompt);
//     setMessages(subPrompt.sentences);
//   };

//   const sendMessage = () => {
//     if (newMessage.trim()) {
//       setMessages((prev) => [...prev, newMessage]);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white min-h-screen font-sans">
//       <h1 className="text-5xl font-bold mb-8 text-center">Shared Prompt Chat</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {sharedPrompts.map((prompt) => (
//           <div
//             key={prompt.id}
//             className="bg-gradient-to-br from-purple-800 to-indigo-800 rounded-lg shadow-2xl p-6 cursor-pointer hover:scale-105 transform transition duration-300"
//             onClick={() => openChat(prompt.subPrompt)}
//           >
//             <h2 className="text-3xl font-semibold mb-2">{prompt.subject}</h2>
//             <p className="text-gray-300">From: {prompt.sender} | To: {prompt.receiver}</p>
//             <div className="mt-4 flex items-center">
//               <span
//                 className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
//                   prompt.status === "pending" ? "bg-yellow-400 text-gray-900" : "bg-green-500 text-gray-900"
//                 }`}
//               >
//                 {prompt.status}
//               </span>
//               <span className="ml-4 px-3 py-1 rounded-lg bg-gray-700 text-gray-300 text-xs">{prompt.visibility}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chat UI */}
//       {selectedPrompt && (
//         <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
//           <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
//             <div className="bg-gray-900 p-4 flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Chat for Sub-Prompt</h2>
//               <button
//                 onClick={() => setSelectedPrompt(null)}
//                 className="text-gray-400 hover:text-white text-lg"
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="p-6 h-96 overflow-y-auto space-y-6 bg-gray-800">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`p-4 rounded-lg shadow-md ${
//                     index % 2 === 0
//                       ? "bg-indigo-600 text-white self-end"
//                       : "bg-purple-600 text-gray-200 self-start"
//                   } max-w-md`}
//                 >
//                   {msg}
//                 </div>
//               ))}
//             </div>

//             <div className="bg-gray-900 p-4 flex items-center">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 className="flex-grow p-3 rounded-l-xl focus:outline-none text-gray-900"
//                 placeholder="Type your message..."
//               />
//               <button
//                 onClick={sendMessage}
//                 className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-r-xl flex items-center space-x-2"
//               >
//                 <FaPaperPlane />
//                 <span>Send</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SharedPromptChat;
