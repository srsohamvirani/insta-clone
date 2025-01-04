import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div>
     <nav className="bg-white border-b shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Instagram Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-gray-800">Instagram</span>
          </div>

          {/* Right Side - Signup, Sign In, Profile */}
          <div className="flex items-center space-x-6">
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
            <Link
              to="/profile"
              className="text-sm text-gray-700 hover:text-black"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </div>
  )
}

export default Navbar
