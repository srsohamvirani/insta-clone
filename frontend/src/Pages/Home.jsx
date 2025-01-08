// import React, { useEffect, useState } from "react"; 

// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);

//   console.log(data);
  

//   useEffect(() => {
//     const token = localStorage.getItem("jwt");
//     if (!token) {
//       navigate("/signup");
//     }

//     fetch("http://localhost:5000/allposts", {
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     })
//       .then((res) => res.json())
//       .then((result) => {
//         if (result.posts && Array.isArray(result.posts)) {
//           setData(result.posts);
//         } else {
//           console.error("Invalid response format:", result);
//         }
//       })
//       .catch((err) => console.log("Error fetching posts:", err));
//   }, [navigate]);

//   // ============ Like Post Function ============
  

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
//       {data.length > 0 ? (
//         data.map((post, index) => (
//           <Post
//             key={index}
//             userImage={post.postedBy.pic}
//             userName={post.postedBy.name}
//             postImage={post.photo}
//             initialLikes={post._id}
//             Linke_d={post.likes}
//             initialComments={post.comments}  // assuming comments field contains the comments count
//             caption={post.body}  // use body or caption from backend response
//           />
//         ))
//       ) : (
//         <p className="text-gray-700 text-lg mt-10">No posts to display.</p>
//       )}
//     </div>
//   );
// }

// const Post = ({ userImage, userName, postImage, initialLikes, initialComments, caption ,Linke_d}) => {
//   const [isLiked, setIsLiked] = useState(false);
//   const [likes, setLikes] = useState(initialLikes);
//   const [comments, setComments] = useState(initialComments);
//   const [commentText, setCommentText] = useState("");

//   // Handle like functionality
//   const handleLike = () => {
//     // Toggle the like state
//     setIsLiked(!isLiked);
//     setLikes(isLiked ? likes - 1 : likes + 1); // Increment or decrement the like count
//   };

//   const handleCommentChange = (e) => setCommentText(e.target.value);

//   const handleCommentSubmit = () => {
//     if (commentText.trim()) {
//       setComments(comments + 1);
//       setCommentText("");
//     }
//   };


//   const likePost = (initialLikes) => {
//     fetch("http://localhost:5000/like", {
//       method: "put",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.getItem("jwt"),
//       },
//       body: JSON.stringify({
//         postId: initialLikes
//       })
//     }).then(res => res.json())
//       .then(result => {
//         console.log(result)
//         const newdata = data.map((posts) => {
//           if (posts._id == result._id) {
//             return result;
//           } else {
//             return posts;
//           }
//         });
//         setData(newdata);
//       })
//   };

//   // ============ Unlike Post Function ============
//   const unlikePost = (initialLikes) => {
//     fetch("http://localhost:5000/unlike", {
//       method: "put",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.getItem("jwt"),
//       },
//       body: JSON.stringify({
//         postId: initialLikes
//       })
//     }).then(res => res.json())
//       .then(result => {
//         console.log(result)
//         const newdata = data.map((posts) => {
//           if (posts._id == result._id) {
//             return result;
//           } else {
//             return posts;
//           }
//         });
//         setData(newdata);
//       })
//   };

//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6">
//       <div className="flex items-center px-4 py-3">
//         <img
//           src={userImage || "https://via.placeholder.com/150"}
//           alt={userName || "User"}
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div className="ml-3">
//           <h3 className="text-sm font-medium text-gray-900">
//             {userName || "User"}
//           </h3>
//         </div>
//       </div>

//       <div className="relative">
//         {/* To maintain the aspect ratio of the image */}
//         <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
//           <img
//             src={postImage || "https://via.placeholder.com/300"}
//             alt="Post"
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           />
//         </div>
//       </div>

//       <div className="px-4 py-3 space-y-3">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={handleLike}
//             className="flex items-center text-sm font-medium text-gray-600"
//           >
//             {/* {isLiked ? 
//             <span className="text-red-500" onClick={()=>{unlikePost(initialLikes)}}>❤️</span> : 
//             <span onClick={()=>{likePost(initialLikes)}}>🤍</span>} */}
//             {Linke_d.includes(
//                 JSON.parse(localStorage.getItem("user"))._id
//               ) ? (
//                 <span className="text-red-500" onClick={()=>{unlikePost(initialLikes)}}>❤️</span> 
//               ) : (
//                 <span onClick={()=>{likePost(initialLikes)}}>🤍</span>
//               )}
//             <span className="ml-1">{Linke_d.length} Likes</span>
//           </button>
//           <div className="flex items-center text-sm font-medium text-gray-600">
//             <span>💬</span>
//             <span className="ml-1">{comments} Comments</span>
//           </div>
//         </div>
//         {/* Dynamically render caption */}
//         <p className="text-sm text-gray-700">{caption || "No caption available"}</p>
//       </div>

//       <div className="border-t border-gray-200 px-4 py-3">
//         <div className="flex items-center space-x-3 w-full">
//           <textarea
//             value={commentText}
//             onChange={handleCommentChange}
//             placeholder="Add a comment..."
//             className="flex-1 rounded-md border border-gray-300 p-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 resize-none h-12"
//           />
//           <button
//             onClick={handleCommentSubmit}
//             className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
//           >
//             Post
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };  

// ===========bus=================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

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

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      {data.length > 0 ? (
        data.map((post, index) => (
          <Post
            key={index}
            userImage={post.postedBy.pic}
            userName={post.postedBy.name}
            postImage={post.photo}
            postId={post._id}
            initialLikes={post.likes}
            initialComments={post.comments}
            caption={post.body}
          />
        ))
      ) : (
        <p className="text-gray-700 text-lg mt-10">No posts to display.</p>
      )}
    </div>
  );
}

const Post = ({ userImage, userName, postImage, postId, initialLikes, initialComments, caption }) => {
  const [isLiked, setIsLiked] = useState(initialLikes.includes(JSON.parse(localStorage.getItem("user"))._id));
  const [likes, setLikes] = useState(initialLikes.length);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  // Optimistic UI update for like/unlike
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
        postedBy: JSON.parse(localStorage.getItem("user")), // Get the user info from localStorage
      };

      // Log the data that will be sent to the backend
      console.log("Data being sent to backend:", {
        postId,
        text: commentText,
      });

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

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6">
      <div className="flex items-center px-4 py-3">
        <img
          src={userImage || "https://via.placeholder.com/150"}
          alt={userName || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">{userName || "User"}</h3>
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
          <button onClick={handleLike} className="flex items-center text-sm font-medium text-gray-600">
            {isLiked ? <span className="text-red-500 text-lg">❤️</span> : <span className="text-lg">🤍</span>}
            <span className="ml-1">{likes} Likes</span>
          </button>
          <div className="flex items-center text-sm font-medium text-gray-600">
            <span className="text-lg">💬</span>
            <span
              className="ml-1 cursor-pointer text-blue-500"
              onClick={() => setShowCommentsModal(true)}
            >
              {comments.length > 0 ? "View all comments" : "No comments yet."}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-700">{caption || "No caption available"}</p>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center space-x-3 w-full mt-3">
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
    <div className="bg-white rounded-lg overflow-hidden w-10/12 max-w-3xl p-6 relative">
      {/* Close Button at the Top Right */}
      <button
        onClick={() => setShowCommentsModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
      >
        &times;
      </button>

      <div className="flex mt-6">
        {/* Image Section, with margin-top to move it down */}
        <div className="w-1/2 pr-4 flex items-center justify-center">
          <div className="relative w-full h-0 pb-[100%]">
            <img
              src={postImage || "https://via.placeholder.com/300"}
              alt="Post"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="w-1/2 pl-4 flex flex-col justify-between max-h-[60vh]">
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>

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
)}
      
    </div>
  );
};