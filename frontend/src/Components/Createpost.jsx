import React, { useState } from "react";

const CreatePost = ({ userImage, userName }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handlePostSubmit = () => {
    if (image && caption.trim()) {
      alert("Post submitted!");
      // Reset the form after posting
      setImage(null);
      setCaption("");
      setImagePreview(null);
    } else {
      alert("Please add an image and a caption.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6 p-4">
      {/* User info and Share button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src={userImage} alt={userName} className="w-10 h-10 rounded-full object-cover" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">{userName}</h3>
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={handlePostSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
        >
          Share
        </button>
      </div>

      {/* Image upload */}
      <div className="relative mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer block w-full h-64 bg-gray-200 rounded-md flex justify-center items-center">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
          ) : (
            <span className="text-gray-500">Click to choose an image</span>
          )}
        </label>
      </div>

      {/* Caption input */}
      <div className="mb-4">
        <textarea
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a caption..."
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <CreatePost
        userImage="https://via.placeholder.com/150"  // Replace with the user's profile picture URL
        userName="John Doe"  // Replace with the user's name
      />
    </div>
  );
}
