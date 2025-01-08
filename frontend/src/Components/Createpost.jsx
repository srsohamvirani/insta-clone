// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const CreatePost = ({ userImage, userName }) => {
//   const [body, setBody] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [url, setUrl] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (url) {
//       postShare();
//     }
//   }, [url]);

//   // Toast functions
//   const notifyA = (msg) => toast.error(msg);
//   const notifyB = (msg) => toast.success(msg);

//   // posting image to cloudinary
//   const postDetails = () => {
//     const data = new FormData();
//     data.append("file", image);
//     data.append("upload_preset", "insta-clone");
//     data.append("cloud_name", "dwj458at3");
//     fetch("https://api.cloudinary.com/v1_1/dwj458at3/image/upload", {
//       method: "post",
//       body: data,
//     })
//       .then((res) => res.json())
//       .then((data) => setUrl(data.url))
//       .catch((err) => console.log(err));
//   };

//   const postShare = () => {
//     fetch("http://localhost:5000/createpost", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorage.getItem("jwt"),
//       },
//       body: JSON.stringify({
//         body,
//         pic: url,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.error) {
//           notifyA(data.error);
//         } else {
//           notifyB("Successfully Posted");
//           navigate("/");
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       console.log("File Selected:", file);
//       setImage(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6 p-4">
//       {/* User info and Share button */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center">
//           <img
//             src={userImage}
//             alt={userName}
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-gray-900">{userName}</h3>
//           </div>
//         </div>

//         {/* Share button */}
//         <button
//           onClick={postDetails}
//           className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
//           id="post-button"
//         >
//           Share
//         </button>
//       </div>

//       {/* Image upload */}
//       <div className="relative mb-4">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="file-input hidden"
//           id="file-input"
//         />
//         <label
//           htmlFor="file-input"
//           className="cursor-pointer block w-full h-64 bg-gray-200 rounded-md flex justify-center items-center"
//         >
//           {imagePreview ? (
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="w-full h-full object-cover rounded-md"
//             />
//           ) : (
//             <span className="text-gray-500">Click to choose an image</span>
//           )}
//         </label>
//       </div>

//       {/* Caption input */}
//       <div className="mb-4">
//         <textarea
//           value={body}
//           onChange={(e) => setBody(e.target.value)}
//           placeholder="Write a caption..."
//           className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//     </div>
//   );
// };

// export default function Home() {
//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
//       <CreatePost
//         userImage="https://via.placeholder.com/150" // Replace with the user's profile picture URL
//         userName="John Doe" // Replace with the user's name
//       />
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ userImage, userName }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      postShare();
    }
  }, [url]);

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  // posting image to cloudinary
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dwj458at3");
    fetch("https://api.cloudinary.com/v1_1/dwj458at3/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log(err));
  };

  const postShare = () => {
    fetch("http://localhost:5000/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        body,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Successfully Posted");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File Selected:", file);
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto mb-6 p-4">
      {/* User info and Share button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={userImage}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">{userName}</h3>
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={postDetails}
          className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
          id="post-button"
        >
          Share
        </button>
      </div>

      {/* Image upload */}
      <div className="relative mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer block w-full bg-gray-200 rounded-md flex justify-center items-center"
          style={{ paddingBottom: '100%', height: '300px' }} // This ensures the container is square and slightly larger
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-gray-500 absolute">Click to choose an image</span>
          )}
        </label>
      </div>

      {/* Caption input */}
      <div className="mb-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <CreatePost
        userImage="https://via.placeholder.com/150" // Replace with the user's profile picture URL
        userName="John Doe" // Replace with the user's name
      />
    </div>
  );
}