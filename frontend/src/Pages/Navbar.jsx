import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../img/logo.png";

export default function Navbar({login}) {
  
  // loginStatus function ko component ke andar define kiya hai
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
            <Link
                to="/profile"
                className="text-sm text-gray-700 hover:text-black"
              >
                Profile
              </Link>
              <Link to="/createPost">
                Create Post
              </Link>
        </>
      ]
    }else{
      return [
        <>
            <Link
                to="/signup"
                className="text-sm text-gray-700 hover:text-black"
              >
                Signup
              </Link>
              <Link
                to="/signin"
                className="text-sm text-gray-700 hover:text-black"
              >
                Sign In
              </Link>
        </>
      ]
    }
  };



  return (
    <div>
      <nav className="bg-white border-b shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Instagram Logo */}
            <div className="flex-shrink-0">
              <img src={logo} alt="logo" className="h-10 w-auto " />
            </div>

            {/* Right Side - Signup, Sign In, Profile */}
            <div className="flex items-center space-x-6">
              {loginStatus()}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

