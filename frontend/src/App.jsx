import "./App.css";
import { BrowserRouter, Route, Routes as Router } from "react-router-dom";
import Navbar from "./Pages/Navbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Router>
          <Route path="/" element={<Navbar />} />
        </Router>
      </BrowserRouter>
    </>
  );
}

export default App;
