import "./App.css";
import { BrowserRouter, Route, Routes as Router } from "react-router-dom";
import Navbar from "./Pages/Navbar";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Router>
          <Route path="/" element={<Home/>} />
          <Route path="/signin" element={<Signin/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/profile" element={<Profile/>} />

        </Router>
      </BrowserRouter>
    </>
  );
}

export default App;
