import React, { useEffect, useState } from "react";
import PostDetail from "./PostDetail"; // Import the PostDetail component
import { useParams } from "react-router-dom";

export default function UserProfile() {
  var picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
  const { userid } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.posts);
        setIsFollowing(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id));
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [userid]);

  const followUser = () => {
    fetch(`http://localhost:5000/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser((prevState) => ({
          ...prevState,
          followers: [...prevState.followers, JSON.parse(localStorage.getItem("user"))._id],
        }));
        setIsFollowing(true);
      })
      .catch((err) => {
        console.error("Error following user:", err);
      });
  };

  const unfollowUser = () => {
    fetch(`http://localhost:5000/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser((prevState) => ({
          ...prevState,
          followers: prevState.followers.filter((id) => id !== JSON.parse(localStorage.getItem("user"))._id),
        }));
        setIsFollowing(false);
      })
      .catch((err) => {
        console.error("Error unfollowing user:", err);
      });
  };

  const toggleDetails = (post) => {
    setSelectedPost(post);
    setShow(!show);
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex flex-col items-center">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <img
            src={user.Photo ? user.Photo : picLink}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-4 border-blue-500"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.name || "User"}</h1>
            <div className="text-sm text-gray-600 mt-2 flex space-x-4">
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-800">{posts.length}</span>
                <span>Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-800">{user.followers?.length || 0}</span>
                <span>Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-800">{user.following?.length || 0}</span>
                <span>Following</span>
              </div>
            </div>
          </div>
        </div>
        {/* Follow/Unfollow Button */}
        <button
          onClick={isFollowing ? unfollowUser : followUser}
          className={`${
            isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          } py-2 px-6 rounded-full text-sm font-medium hover:bg-red-600 focus:outline-none transition duration-300 transform hover:scale-105`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* User Posts Section */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="relative w-full h-0 pb-[100%] group">
              <img
                src={post.photo}
                onClick={() => toggleDetails(post)}
                alt="Post"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg cursor-pointer transition duration-300 transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full p-2 bg-white bg-opacity-75 text-gray-800 text-sm flex justify-between items-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 10c0 3.866-3.582 7-8 7a8.964 8.964 0 01-4.9-1.45L2 17l1.45-3.1A8.964 8.964 0 012 10c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                  <span>{post.comments.length}</span>
                </div>
              </div>
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