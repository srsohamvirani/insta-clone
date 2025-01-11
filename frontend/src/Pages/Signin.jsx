import React, { useState, useContext } from "react";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { LoginContext } from "../context/LoginContext";
import "react-toastify/dist/ReactToastify.css";

export default function Signin() {
  const { setUserLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Toast functions
  const notifyA = (msg) => {
    console.log("Error Toast Triggered:", msg); // Debugging log
    toast.error(msg);
  };

  const notifyB = (msg) => {
    console.log("Success Toast Triggered:", msg); // Debugging log
    toast.success(msg);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const postData = async (e) => {
    e.preventDefault();

    // Check email format
    if (!emailRegex.test(email)) {
      notifyA("Invalid email format");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.error) {
        notifyA(data.error);
      } else {
        notifyB("Signed in successfully");
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUserLogin(true);
        navigate("/");
      }
    } catch (err) {
      notifyA("Server error, please try again later");
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <ToastContainer theme="dark" position="top-right" />
      <img src={logo} alt="logo" className="h-12 w-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Sign in to Instagram
      </h1>
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
        onSubmit={postData}
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
          Sign In
        </button>

        <div className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
