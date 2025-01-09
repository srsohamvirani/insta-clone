import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostDetail({ post, onClose, onDelete, onDeleteComment }) {
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  const handleCommentChange = (e) => setCommentText(e.target.value);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        text: commentText,
        postedBy: JSON.parse(localStorage.getItem("user")), // Replace with actual user data
      };

      // Optimistic UI update: add the new comment locally
      const updatedComments = [...comments, newComment];
      setComments(updatedComments); // Update the comment section immediately
      setCommentText(""); // Clear the input field

      // Send the comment to the backend to be saved and updated
      fetch("http://localhost:5000/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId: post._id, text: commentText }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.comments) {
            // If the backend returns updated comments, use them to overwrite the UI
            setComments(result.comments);
          } else {
            console.error("No comments returned:", result);
          }
        })
        .catch((err) => {
          console.error("Error submitting comment:", err);
          alert("Failed to submit comment. Please try again.");

          // Revert the optimistic update if the request fails
          setComments(comments); // Revert to previous state if failed
        });
    }
  };

  const handleDeleteComment = (commentId) => {
    // Optimistically update the UI
    setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));

    fetch(`http://localhost:5000/deletecomment/${post._id}/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.comments) {
          console.error("Failed to delete comment");
        } else {
          onDeleteComment(post._id, commentId);
        }
      })
      .catch((err) => {
        console.error("Error deleting comment:", err);
      });
  };

  const handleDeletePost = () => {
    fetch(`http://localhost:5000/deletePost/${post._id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            throw new Error(error.error || "Failed to delete post");
          });
        }
        return res.json();
      })
      .then((result) => {
        if (result.message) {
          toast.success("Post deleted successfully!");
          onDelete(post._id); // Call the onDelete callback to remove the post from the state
          setTimeout(() => {
            navigate("/");
          }, 2000); // Navigate after 2 seconds to allow the toast to be visible
        } else {
          console.error("Failed to delete post:", result);
          toast.error("Failed to delete post. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error deleting post:", err);
        toast.error("Oops! Something went wrong while deleting the post.");
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl p-6 relative mx-4 sm:mx-0">
        {/* Close Button at the Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <div className="flex flex-col sm:flex-row mt-6">
          {/* Image Section, with margin-top to move it down */}
          <div className="w-full sm:w-1/2 pr-0 sm:pr-4 flex items-center justify-center mb-4 sm:mb-0">
            <div className="relative w-full h-0 pb-[100%]">
              <img
                src={post.photo || "https://via.placeholder.com/300"}
                alt="Post"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="w-full sm:w-1/2 pl-0 sm:pl-4 flex flex-col justify-between max-h-[60vh]">
            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
                <button
                  onClick={handleDeletePost}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:from-red-600 hover:to-pink-600 rounded-full transition-all duration-300 transform"
                >
                  <FaTrash className="mr-2 text-lg" /> Delete Post
                </button>
              </div>

              {/* Comment List */}
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
                        onClick={() => handleDeleteComment(comment._id)}
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

            {/* Comment Input Section */}
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
  );
}