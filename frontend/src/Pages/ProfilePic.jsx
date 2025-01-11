import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePic({ onClose, changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const postDetails = () => {
    console.log("Uploading image...");
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dwj458at3");

    fetch("https://api.cloudinary.com/v1_1/dwj458at3/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Cloudinary response data:", data);
        if (data.url) {
          setUrl(data.url);
          notifySuccess("Image uploaded successfully!");
        } else {
          notifyError("Failed to upload image. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error uploading to Cloudinary:", err);
        notifyError("Error uploading image!");
      });
  };

  const postPic = () => {
    fetch("http://localhost:5000/uploadProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response with updated photo:", data);
        setUserDetails(data);
        if (changeprofile) changeprofile(data.Photo);
        notifySuccess("Profile picture updated successfully!");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        notifyError("Failed to update profile picture!");
      });
  };

  const handleRemovePhoto = () => {
    fetch("http://localhost:5000/removeProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response after removing photo:", data);
        setUserDetails(data);
        if (changeprofile) changeprofile(null);
        notifySuccess("Profile picture removed successfully!");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        notifyError("Failed to remove profile picture!");
      });
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image]);

  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url]);

  const handleClose = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  return (
    showModal && (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 p-6">
            {/* Modal Header */}
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                Change Profile Photo
              </h2>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Modal Content */}
            <div className="flex flex-col space-y-4">
              {/* Upload Photo Button */}
              <button
                onClick={handleClick}
                className="w-full text-white bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 hover:shadow-lg rounded-full py-3 px-6 font-medium transition-all duration-300 transform"
              >
                Upload Photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={hiddenFileInput}
                className="hidden"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />

              {/* Remove Current Photo Button */}
              <button
                onClick={handleRemovePhoto}
                className="w-full text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:shadow-lg rounded-full py-3 px-6 font-medium transition-all duration-300 transform"
              >
                Remove Current Photo
              </button>

              {/* Cancel Button */}
              <button
                onClick={handleClose}
                className="w-full text-gray-700 bg-gray-200 hover:bg-gray-300 hover:shadow-md rounded-full py-3 px-6 font-medium transition-all duration-300 transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    )
  );
}
