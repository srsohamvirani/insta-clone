import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import logo from "../img/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(LoginContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0"
          >
            Profile
          </Link>
          <Link
            to="/createPost"
            className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0"
          >
            Create Post
          </Link>
          <Link
            to="/followingpost"
            className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0"
          >
            My Following
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="block w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 hover:scale-105 transition-transform transform shadow-md"
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link
            to="/signup"
            className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0"
          >
            Signup
          </Link>
          <Link
            to="/signin"
            className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0"
          >
            Sign In
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} alt="logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Navbar Links */}
          <div className="hidden md:flex md:items-center space-x-6">
            {loginStatus()}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-50 shadow-md rounded-lg mt-2">
            <div className="space-y-1 py-4">{loginStatus()}</div>
          </div>
        )}
      </div>
    </nav>
  );
}
// ============================================================
// import React, { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import { LoginContext } from "../context/LoginContext";
// import logo from "../img/logo.png";
// import { FaBars, FaTimes, FaUser, FaPlus, FaHeart, FaHome, FaSignOutAlt } from "react-icons/fa";

// export default function Navbar({ login }) {
//   const { setModalOpen } = useContext(LoginContext);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const loginStatus = () => {
//     const token = localStorage.getItem("jwt");
//     if (login || token) {
//       return (
//         <>
//           <Link
//             to="/profile"
//             className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0 flex items-center"
//           >
//             <FaUser className="mr-2" />
//             Profile
//           </Link>
//           <Link
//             to="/createPost"
//             className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0 flex items-center"
//           >
//             <FaPlus className="mr-2" />
//             Create Post
//           </Link>
//           <Link
//             to="/followingpost"
//             className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0 flex items-center"
//           >
//             <FaHeart className="mr-2" />
//             My Following
//           </Link>
//           <button
//             onClick={() => setModalOpen(true)}
//             className="block w-full md:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 hover:scale-105 transition-transform transform shadow-md flex items-center"
//           >
//             <FaSignOutAlt className="mr-2" />
//             Logout
//           </button>
//         </>
//       );
//     } else {
//       return (
//         <>
//           <Link
//             to="/signup"
//             className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0"
//           >
//             Signup
//           </Link>
//           <Link
//             to="/signin"
//             className="block px-4 py-2 text-gray-700 hover:text-black md:px-6 md:py-0"
//           >
//             Sign In
//           </Link>
//         </>
//       );
//     }
//   };

//   return (
//     <nav className="bg-white shadow-md border-b">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/">
//               <img src={logo} alt="logo" className="h-10 w-auto" />
//             </Link>
//           </div>

//           {/* Hamburger Icon */}
//           <div className="md:hidden">
//             <button
//               className="text-gray-700 hover:text-gray-900 focus:outline-none"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </div>

//           {/* Navbar Links */}
//           <div className="hidden md:flex md:items-center space-x-6">
//             {loginStatus()}
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-gray-50 shadow-md rounded-lg mt-2">
//             <div className="space-y-1 py-4">{loginStatus()}</div>
//           </div>
//         )}
//       </div>

//       {/* Bottom Navbar for Mobile */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden flex justify-around items-center py-2">
//         <Link to="/" className="text-gray-700 hover:text-black">
//           <FaHome size={24} />
//         </Link>
//         <Link to="/createPost" className="text-gray-700 hover:text-black">
//           <FaPlus size={24} />
//         </Link>
//         <Link to="/profile" className="text-gray-700 hover:text-black">
//           <FaUser size={24} />
//         </Link>
//         <Link to="/followingpost" className="text-gray-700 hover:text-black">
//           <FaHeart size={24} />
//         </Link>
//         <button
//           onClick={() => setModalOpen(true)}
//           className="text-gray-700 hover:text-black"
//         >
//           <FaSignOutAlt size={24} />
//         </button>
//       </div>
//     </nav>
//   );
// }