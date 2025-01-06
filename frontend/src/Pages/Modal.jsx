import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function Modal({ setModalOpen }) {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 z-0 flex items-center justify-center "
      onClick={() => setModalOpen(false)}
    >
      <div className="relative bg-white w-64 h-44 rounded-xl shadow-lg">
        {/* Modal header */}
        <div className="h-12 bg-white rounded-t-xl flex justify-center items-center">
          <h5 className="text-lg text-gray-800 font-medium">Confirm</h5>
        </div>
        <button
          className="absolute top-[-14px] right-[-14px] right-2 p-3 text-1xl text-white bg-blue-600 rounded-xl  shadow-lg hover:shadow-md transition-transform transform hover:scale-105"
          onClick={() => setModalOpen(false)}
        >
          <RiCloseLine />
        </button>
        {/* Modal content */}
        <div className="py-2 text-center text-sm text-gray-700">
          Are you really want to log out?
        </div>
        <div className="absolute bottom-2 w-full px-4">
          <div className="flex justify-between">
            <button
              className="py-3 px-7 bg-red-500 text-white rounded-full text-sm font-medium transition-transform transform hover:scale-105"
              onClick={() => {
                setModalOpen(false);
                localStorage.clear();
                navigate("/signin");
              }}
            >
              Log Out
            </button>
            <button
              className="py-3 px-7 bg-gray-700 text-white rounded-full text-sm font-medium transition-transform transform hover:scale-105"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
