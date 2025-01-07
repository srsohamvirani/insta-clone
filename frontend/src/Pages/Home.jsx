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

  // Optimistic UI update for like/unlike
  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    setIsLiked(newIsLiked);
    setLikes(newLikes); // Update likes immediately

    // Optimistically update the UI and send request to the server
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
        // Update state based on server response
        if (result.likes) {
          setLikes(result.likes.length);
          setIsLiked(result.likes.includes(JSON.parse(localStorage.getItem("user"))._id));
        }
      })
      .catch((err) => {
        console.log("Error updating like/unlike:", err);
        // Rollback on error
        setIsLiked(!newIsLiked);
        setLikes(likes); // Rollback likes count if the request fails
      });
  };

  const handleCommentChange = (e) => setCommentText(e.target.value);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments(comments + 1);
      setCommentText("");
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
        <div className="relative w-full h-0 pb-[56.25%]">
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
            {isLiked ? <span className="text-red-500">❤️</span> : <span>🤍</span>}
            <span className="ml-1">{likes} Likes</span>
          </button>
          <div className="flex items-center text-sm font-medium text-gray-600">
            <span>💬</span>
            <span className="ml-1">{comments} Comments</span>
          </div>
        </div>
        <p className="text-sm text-gray-700">{caption || "No caption available"}</p>
      </div>

      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3 w-full">
          <textarea
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
    </div>
  );
};
