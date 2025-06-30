// ImageGrid.jsx
import React from 'react';

const ImageGrid = ({ imageGroups, openModal }) => {
  const BACKEND_URL = process.env.BACKEND_URL;
  return (
    <section className="w-full max-w-6xl mb-16 h-auto py-8 sm:px-0">
      {imageGroups.map((group) => (
        <div key={group.sub_prompt_id} className="mb-8 mx-4 sm:ml-[8vw] shadow-lg p-4 sm:p-10 border rounded-2xl">
          <div className="cursor-pointer" onClick={() => openModal(group.images)}>
            <div className="text-2xl font-bold mb-4">{group.sub_prompt_text}</div>
            <p className="text-gray-500 mb-2">
              Created at: {new Date(group.created_at).toLocaleString()}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {group.images.slice(0, 4).map((image, index) => (
                <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
                  <img className="w-full min-w-48 h-40 object-cover" src={`${BACKEND_URL}${image.url}`} alt={`Generated from prompt: ${group.sub_prompt_text}`} />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    {/* Overlay content */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ImageGrid;
