import React from 'react';

const Alert = ({ message, type, onClose }) => {
    return (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg transition-transform transform ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center justify-between">
                <span> {message}</span>
                <button onClick={onClose} className="ml-4 text-lg font-semibold">x</button>
            </div>
        </div>
    );
};

export default Alert;
