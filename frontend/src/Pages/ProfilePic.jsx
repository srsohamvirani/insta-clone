import React, { useState } from "react";

export default function ProfilePic({ onClose }) {
  const [showModal, setShowModal] = useState(true);

  const handleUploadPhoto = () => {
    // Logic for uploading photo
    console.log("Upload Photo clicked");
  };

  const handleRemovePhoto = () => {
    // Logic for removing current photo
    console.log("Remove Photo clicked");
  };

  const handleClose = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Change Profile Photo</h2>
            <button onClick={handleClose} className="text-gray-600 hover:text-gray-900">
              &times;
            </button>
          </div>
          <div className="border-t border-gray-300 my-4"></div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleUploadPhoto}
              className="w-full text-blue-500 hover:text-blue-700 font-medium py-2 px-4 rounded-md border border-blue-500"
            >
              Upload Photo
            </button>
            <button
              onClick={handleRemovePhoto}
              className="w-full text-red-500 hover:text-red-700 font-medium py-2 px-4 rounded-md border border-red-500"
            >
              Remove Current Photo
            </button>
            <button
              onClick={handleClose}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
}