import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComment, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  var picLink = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  console.log(data);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }

    fetch("http://localhost:5000/allposts", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.posts && Array.isArray(result.posts)) {
          setData(result.posts);
        } else {
          console.error("Invalid response format:", result);
        }
      })
      .catch((err) => console.log("Error fetching posts:", err));
  }, [navigate]);

  const handleDeleteComment = (postId, commentId) => {
    // Optimistically update the UI
    setData((prevData) =>
      prevData.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment._id !== commentId
              ),
            }
          : post
      )
    );

    fetch(`http://localhost:5000/deletecomment/${postId}/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.comments) {
          console.error("Failed to delete comment");
        }
      })
      .catch((err) => {
        console.error("Error deleting comment:", err);
      });
  };

  const handleDeletePost = (postId) => {
    fetch(`http://localhost:5000/deletePost/${postId}`, {
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
          setData((prevData) => prevData.filter((post) => post._id !== postId));
          setPostToDelete(null);
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

  const confirmDeleteComment = (postId, commentId) => {
    setCommentToDelete({ postId, commentId });
  };

  const confirmDeletePost = (postId) => {
    setPostToDelete(postId);
  };

  const handleConfirmDeleteComment = () => {
    if (commentToDelete) {
      handleDeleteComment(commentToDelete.postId, commentToDelete.commentId);
      setCommentToDelete(null);
    }
  };

  const handleConfirmDeletePost = () => {
    if (postToDelete) {
      handleDeletePost(postToDelete);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCommentToDelete(null);
    setPostToDelete(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <ToastContainer />
      {data.length > 0 ? (
        data.map((post, index) => (
          <Post
            key={index}
            userImage={post.postedBy.Photo}
            userName={post.postedBy.name}
            userId={post.postedBy._id}
            postImage={post.photo}
            postId={post._id}
            initialLikes={post.likes}
            initialComments={post.comments}
            caption={post.body}
            confirmDeleteComment={confirmDeleteComment}
            confirmDeletePost={confirmDeletePost}
          />
        ))
      ) : (
        <p className="text-gray-700 text-lg mt-10">No posts to display.</p>
      )}

      {/* Delete Confirmation Modal */}
      {(commentToDelete || postToDelete) && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-md p-6 relative mx-4 sm:mx-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this{" "}
              {commentToDelete ? "comment" : "post"}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={
                  commentToDelete
                    ? handleConfirmDeleteComment
                    : handleConfirmDeletePost
                }
                className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
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
  confirmDeleteComment,
  confirmDeletePost,
}) => {
  const [isLiked, setIsLiked] = useState(
    initialLikes.includes(JSON.parse(localStorage.getItem("user"))._id)
  );
  const [likes, setLikes] = useState(initialLikes.length);
  const [comments, setComments] = useState(initialComments);
  console.log("🚀 ~ comments:", comments)

  const [commentText, setCommentText] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  // Optimistic UI update for like/unlike
  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    setIsLiked(newIsLiked);
    setLikes(newLikes);

    fetch(
      newIsLiked
        ? "http://localhost:5000/like"
        : "http://localhost:5000/unlike",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.likes) {
          setLikes(result.likes.length);
          setIsLiked(
            result.likes.includes(JSON.parse(localStorage.getItem("user"))._id)
          );
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
        postedBy: JSON.parse(localStorage.getItem("user")), // Get the user info from localStorage
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
        body: JSON.stringify({ postId, text: commentText }),
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
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );

    fetch(`http://localhost:5000/deletecomment/${postId}/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.comments) {
          console.error("Failed to delete comment");
        }
      })
      .catch((err) => {
        console.error("Error deleting comment:", err);
      });
  };

  const handleDeletePost = () => {
    fetch(`http://localhost:5000/deletePost/${postId}`, {
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
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Reload after 2 seconds to allow the toast to be visible
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6">
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <img
          src={
            userImage ||
            "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
          }
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
            {isLiked ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-lg" />
            )}
            <span className="ml-1">{likes} Likes</span>
          </button>
          <div className="flex items-center text-sm font-medium text-gray-600">
            <FaComment className="text-lg" />
            <span
              className="ml-1 cursor-pointer text-blue-500"
              onClick={() => setShowCommentsModal(true)}
            >
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-700">
          {caption || "No caption available"}
        </p>
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

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl p-6 relative mx-4 sm:mx-0">
            {/* Close Button at the Top Right */}
            <button
              onClick={() => setShowCommentsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>

            <div className="flex flex-col sm:flex-row mt-6">
              {/* Image Section, with margin-top to move it down */}
              <div className="w-full sm:w-1/2 pr-0 sm:pr-4 flex items-center justify-center mb-4 sm:mb-0">
                <div className="relative w-full h-0 pb-[100%]">
                  <img
                    src={postImage || "https://via.placeholder.com/300"}
                    alt="Post"
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Comments Section */}
              <div className="w-full sm:w-1/2 pl-0 sm:pl-4 flex flex-col justify-between max-h-[60vh]">
                <div
                  className="space-y-4 overflow-y-auto"
                  style={{ maxHeight: "300px" }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Comments
                    </h3>
                    {userId ===
                      JSON.parse(localStorage.getItem("user"))._id && (
                      <button
                        onClick={handleDeletePost}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:from-red-600 hover:to-pink-600 rounded-full transition-all duration-300 transform "
                      >
                        <FaTrash className="mr-2 text-lg" /> Delete Post
                      </button>
                    )}
                  </div>

                  {/* Comment List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={
                            comment.postedBy.Photo ||
                            "https://via.placeholder.com/150"
                          }
                          alt={comment.postedBy.name || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {comment.postedBy.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {comment.text}
                          </p>
                        </div>
                        {comment.postedBy._id ===
                          JSON.parse(localStorage.getItem("user"))._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:bg-gradient-to-l hover:from-red-600 hover:via-orange-600 hover:to-red-600 hover:shadow-lg rounded-full transition-all duration-300 transform  active:scale-95"
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
      )}
    </div>
  );
};
