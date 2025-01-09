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
import Modal from "./Pages/Modal";
import UserProfile from "./Pages/UserProfile";


function App() {
  const [user, setUserLogin] = useState(false);
  const [ModalOpen,setModalOpen] = useState(false);
  return (
    <>
      <BrowserRouter>
      <LoginContext.Provider value={{setUserLogin,setModalOpen}}>
      <Navbar login={user}/>
        <Router>
          <Route path="/" element={<Home/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route path="/createPost" element={<Createpost/>} />
          <Route path="/profile/:userid" element={<UserProfile/>} />
          

        </Router>
        <ToastContainer theme="dark"/>
        {ModalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
      </LoginContext.Provider>
   
      </BrowserRouter>
    </>
  );
}

export default App;
