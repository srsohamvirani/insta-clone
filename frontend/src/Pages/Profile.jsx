import React, { useState } from "react";

export default function Profile() {
  const [isFollowing, setIsFollowing] = useState(false);

  // Handle follow/unfollow toggle
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex flex-col items-center">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <img
            src="https://images.pexels.com/photos/26903601/pexels-photo-26903601/free-photo-of-portrait-of-a-young-man-in-a-black-shirt.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">John Doe</h1>
            <div className="text-sm text-gray-600">
              <span>Posts: 120</span> | <span>Followers: 1.2K</span> | <span>Following: 180</span>
            </div>
          </div>
        </div>
        {/* Follow/Unfollow Button */}
        <button
          onClick={handleFollowToggle}
          className={`${
            isFollowing ? "bg-gray-300 text-gray-600" : "bg-blue-500 text-white"
          } py-2 px-6 rounded-full text-sm font-medium hover:bg-blue-600 focus:outline-none`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* User Posts Section */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Posts</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Post 1 */}
          <img
            src="https://images.pexels.com/photos/2526882/pexels-photo-2526882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Post 1"
            className="w-full h-auto rounded-lg"
          />
          {/* Post 2 */}
          <img
            src="https://images.pexels.com/photos/2176593/pexels-photo-2176593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Post 2"
            className="w-full h-auto rounded-lg"
          />
          {/* Post 3 */}
          <img
            src="https://images.pexels.com/photos/2526882/pexels-photo-2526882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Post 3"
            className="w-full h-auto rounded-lg"
          />
          {/* Add more posts as needed */}
        </div>
      </div>
    </div>
  );
}
