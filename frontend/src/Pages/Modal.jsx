import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function Modal({ setModalOpen }) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="relative bg-white w-96 rounded-xl shadow-xl transform transition-transform scale-95 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h5 className="text-lg font-bold text-gray-800">Log Out</h5>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setModalOpen(false)}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-center">
          <p className="text-gray-700 text-base mb-4">
            Are you sure you want to log out?
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between p-4 border-t">
          <button
            className="w-1/2 py-3 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="w-1/2 py-3 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={() => {
              setModalOpen(false);
              localStorage.clear();
              navigate("/signin");
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
