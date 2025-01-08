import React, { useEffect, useState } from "react";
import PostDetail from "./PostDetail"; // Import the PostDetail component

export default function Profile() {
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result.posts); // Assuming `result.posts` contains the post data
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);

  const toggleDetails = (post) => {
    setSelectedPost(post);
    setShow(!show);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleDeletePost = (postId) => {
    setPic((prevPic) => prevPic.filter((post) => post._id !== postId));
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
          {pic.map((post) => (
            <div key={post._id} className="relative w-full h-0 pb-[100%]">
              <img
                src={post.photo}
                onClick={() => toggleDetails(post)}
                alt="Post"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Post Detail Modal */}
      {show && selectedPost && (
        <PostDetail post={selectedPost} onClose={() => setShow(false)} onDelete={handleDeletePost} />
      )}
    </div>
  );
}