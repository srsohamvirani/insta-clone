import React, { useState } from "react";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");


  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const passReges = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const postData = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!name || !email || !userName || !password) {
      notifyA("Please fill all the fields");
      return;
    }

    // Check email format
    if (!emailRegex.test(email)) {
      notifyA("Invalid email format");
      return;
    // }else if (!passReges.test(password)) {
    //   notifyA("Password must be at least 8 characters, including at least one letter and one number and one include both uppercase and lowercase letters and special characters including #,?,!,@");
    //   return;
    }
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          userName,
          password,
        }),
      });

      const data = await response.json();
      if (data.error) {
        notifyA(data.error);
      } else {
        notifyB(data.message);
        navigate("/signin");
      }
    } catch (err) {
      console.error("Error:", err);
      notifyA("Server error, please try again later");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <ToastContainer />
      <img src={logo} alt="logo" className="h-12 w-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create your account</h1>
      <form
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
        onSubmit={postData} // Use onSubmit for form submission
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

        <button
          type="submit"
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
