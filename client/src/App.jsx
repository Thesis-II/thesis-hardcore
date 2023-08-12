import { Routes, Route } from "react-router-dom";
import background from "./assets/img.jpg";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./pages/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}>
      <Routes>
        <Route path='/' element={<Navbar />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
