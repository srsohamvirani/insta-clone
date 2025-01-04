import React, { useState } from "react";

const Post = ({ userImage, userName, postImage, initialLikes, initialComments }) => {
  // State for like toggle (true/false)
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");

  // Toggle like button
  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  // Handle comment change
  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments(comments + 1);
      setCommentText(""); // Clear comment input
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 max-w-sm mx-auto">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <img
          src={userImage}
          alt={userName}
          className="h-10 w-10 rounded-full object-cover mr-3"
        />
        <span className="font-semibold text-gray-800">{userName}</span>
      </div>

      {/* Post Image */}
      <img
        src={postImage}
        alt="post"
        className="w-full h-auto rounded-lg mb-4"
      />

      {/* Post Footer (Likes and Comments) */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button onClick={handleLike} className="cursor-pointer">
            {isLiked ? "❤️" : "🤍"} {likes} Likes
          </button>
          {/* Comment Button */}
          <span className="cursor-pointer">💬 {comments} Comments</span>
        </div>
        <button className="text-blue-500 hover:underline">See more</button>
      </div>

      {/* Comment Box and Post Button */}
      <div className="mt-4 flex items-center space-x-2">
        <textarea
          value={commentText}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      {/* Sample Posts */}
      <Post
        userImage="https://via.placeholder.com/150"
        userName="John Doe"
        postImage="https://via.placeholder.com/600x400"
        initialLikes={120}
        initialComments={5}
      />
      <Post
        userImage="https://via.placeholder.com/150"
        userName="Jane Smith"
        postImage="https://via.placeholder.com/600x400"
        initialLikes={230}
        initialComments={15}
      />
    </div>
  );
}
