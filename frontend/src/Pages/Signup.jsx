import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import { ToastContainer, toast } from "react-toastify";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // toast function
  const notifyA = () => toast.error("wow");

  const postData = (e) => {
    e.preventDefault(); // Prevent default form submission

    // sending data to server
    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name:name,
        email:email,
        userName:userName,
        password:password
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        notifyA();
        console.log(data);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <img src={logo} alt="logo" className="h-12 w-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create your account</h1>
      <form
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
        onSubmit={postData} // Use onSubmit instead of onClick for the form
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="fullname">
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            value={name}
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={userName}
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>

        <div className="text-xs text-gray-600 mb-4 text-center">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-blue-500 hover:underline">
            Terms
          </a>
          ,{" "}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          , and{" "}
          <a href="/cookie-policy" className="text-blue-500 hover:underline">
            Cookie Policy
          </a>
          .
        </div>

        <button
          type="submit" // Submit the form
          id="submit-btn"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign Up
        </button>

        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
