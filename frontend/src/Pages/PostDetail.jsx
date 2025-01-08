import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostDetail({ post, onClose, onDelete }) {
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  const handleCommentChange = (e) => setCommentText(e.target.value);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        text: commentText,
        postedBy: { _id: "user_id", name: "User Name", pic: "user_pic_url" }, // Replace with actual user data
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
      <div className="bg-white rounded-lg overflow-hidden w-10/12 max-w-3xl p-6 relative">
        {/* Close Button at the Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <div className="flex mt-6">
          {/* Image Section, with margin-top to move it down */}
          <div className="w-1/2 pr-4 flex items-center justify-center">
            <div className="relative w-full h-0 pb-[100%]">
              <img
                src={post.photo || "https://via.placeholder.com/300"}
                alt="Post"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="w-1/2 pl-4 flex flex-col justify-between max-h-[60vh]">
            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
                <button onClick={handleDeletePost} className="text-red-500 hover:text-red-700">
                  <FaTrash />
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