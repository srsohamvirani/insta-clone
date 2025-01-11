import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComment, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyFollowingPost() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) navigate("/signup");

    fetch("http://localhost:5000/myfollowingpost", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.posts && Array.isArray(result.posts)) setData(result.posts);
        else console.error("Invalid response format:", result);
      })
      .catch((err) => console.log("Error fetching posts:", err));
  }, [navigate]);

  const handleDeleteComment = (postId, commentId) => {
    fetch(`http://localhost:5000/deletecomment/${postId}/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => res.json())
      .then((result) => {
        setData((prevData) =>
          prevData.map((post) =>
            post._id === postId
              ? { ...post, comments: post.comments.filter((comment) => comment._id !== commentId) }
              : post
          )
        );
      })
      .catch((err) => console.error("Error deleting comment:", err));
  };

  const handleDeletePost = (postId) => {
    fetch(`http://localhost:5000/deletePost/${postId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete post");
        return res.json();
      })
      .then(() => {
        setData((prevData) => prevData.filter((post) => post._id !== postId));
        toast.success("Post deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
        toast.error("Oops! Something went wrong while deleting the post.");
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <ToastContainer />
      {data.length > 0 ? (
        data.map((post, index) => (
          <Post
            key={index}
            userImage={post.postedBy.pic}
            userName={post.postedBy.name}
            userId={post.postedBy._id}
            postImage={post.photo}
            postId={post._id}
            initialLikes={post.likes}
            initialComments={post.comments}
            caption={post.body}
            handleDeleteComment={handleDeleteComment}
            handleDeletePost={handleDeletePost}
          />
        ))
      ) : (
        <p className="text-gray-700 text-lg mt-10">No posts to display.</p>
      )}
    </div>
  );
}

const Post = ({
  userImage,
  userName,
  userId,
  postImage,
  postId,
  initialLikes,
  initialComments,
  caption,
  handleDeleteComment,
  handleDeletePost,
}) => {
  const [isLiked, setIsLiked] = useState(
    initialLikes.includes(JSON.parse(localStorage.getItem("user"))._id)
  );
  const [likes, setLikes] = useState(initialLikes.length);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    setIsLiked(newIsLiked);
    setLikes(newLikes);

    fetch(newIsLiked ? "http://localhost:5000/like" : "http://localhost:5000/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.likes) {
          setLikes(result.likes.length);
          setIsLiked(result.likes.includes(JSON.parse(localStorage.getItem("user"))._id));
        }
      })
      .catch((err) => {
        console.log("Error updating like/unlike:", err);
        setIsLiked(!newIsLiked);
        setLikes(likes);
      });
  };

  const handleCommentChange = (e) => setCommentText(e.target.value);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        text: commentText,
        postedBy: JSON.parse(localStorage.getItem("user")),
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setCommentText("");

      fetch("http://localhost:5000/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId, text: commentText }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.comments) setComments(result.comments);
        })
        .catch((err) => {
          console.error("Error submitting comment:", err);
          alert("Failed to submit comment. Please try again.");
          setComments((prevComments) => prevComments.slice(0, -1));
        });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6">
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <img
          src={userImage || "https://via.placeholder.com/150"}
          alt={userName || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3 flex-1">
          <Link to={`/profile/${userId}`}>
            <h3 className="text-sm font-medium text-gray-900 cursor-pointer">
              {userName || "User"}
            </h3>
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="relative w-full h-0 pb-[100%]">
          <img
            src={postImage || "https://via.placeholder.com/300"}
            alt="Post"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center text-sm font-medium text-gray-600"
          >
            {isLiked ? <FaHeart className="text-red-500 text-lg" /> : <FaRegHeart className="text-lg" />}
            <span className="ml-1">{likes} Likes</span>
          </button>
          <div className="flex items-center text-sm font-medium text-gray-600">
            <FaComment className="text-lg" />
            <span className="ml-1 cursor-pointer text-blue-500" onClick={() => setShowCommentsModal(true)}>
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-700">{caption || "No caption available"}</p>
      </div>

      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center space-x-3 w-full">
          <input
            value={commentText}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            className="flex-1 rounded-md border border-gray-300 p-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 resize-none h-12"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </div>

      {showCommentsModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl p-6 relative mx-4 sm:mx-0">
            <button onClick={() => setShowCommentsModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">
              &times;
            </button>

            <div className="flex flex-col sm:flex-row mt-6">
              <div className="w-full sm:w-1/2 pr-0 sm:pr-4 flex items-center justify-center mb-4 sm:mb-0">
                <div className="relative w-full h-0 pb-[100%]">
                  <img
                    src={postImage || "https://via.placeholder.com/300"}
                    alt="Post"
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2 pl-0 sm:pl-4 flex flex-col justify-between max-h-[60vh]">
                <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "300px" }}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
                    {userId === JSON.parse(localStorage.getItem("user"))._id && (
                      <button
                        onClick={() => handleDeletePost(postId)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:from-red-600 hover:to-pink-600 rounded-full transition-all duration-300 transform"
                      >
                        <FaTrash className="mr-2 text-lg" /> Delete Post
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment._id} className="flex items-center space-x-3">
                        <img
                          src={comment.postedBy.pic || "https://via.placeholder.com/150"}
                          alt={comment.postedBy.name || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{comment.postedBy.name}</p>
                          <p className="text-sm text-gray-600">{comment.text}</p>
                        </div>
                        {comment.postedBy._id === JSON.parse(localStorage.getItem("user"))._id && (
                          <button
                            onClick={() => handleDeleteComment(postId, comment._id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:bg-gradient-to-l hover:from-red-600 hover:via-orange-600 hover:to-red-600 hover:shadow-lg rounded-full transition-all duration-300 transform active:scale-95"
                          >
                            <FaTrash className="text-sm" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-6">
                  <input
                    value={commentText}
                    onChange={handleCommentChange}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-md border border-gray-300 p-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};