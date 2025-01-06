import "./App.css";
import { BrowserRouter, Route, Routes as Router } from "react-router-dom";
import React, { createContext, useState } from "react";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import{ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Createpost from "./Components/Createpost";
import { LoginContext } from "./context/LoginContext";


function App() {
  const [user, setUserLogin] = useState(false);
  return (
    <>
      <BrowserRouter>
      <LoginContext.Provider value={{setUserLogin}}>
      <Navbar login={user}/>
        <Router>
          <Route path="/" element={<Home/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/createPost" element={<Createpost/>} />
          

        </Router>
        <ToastContainer theme="dark"/>
      </LoginContext.Provider>
   
      </BrowserRouter>
    </>
  );
}

export default App;
