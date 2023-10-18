import { Routes, Route } from "react-router-dom";
import background from "./assets/backG.gif";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./pages/Navbar";
import About from "./pages/About";
import Home from "./pages/Home";
import HomeA from "./admin/HomeA";
import Dashboard from "./admin/Dashboard";
import Assessment from "./admin/Assessment";
import Student from "./admin/Student";
import Practice from "./pages/Practice";
import NormalPage from "./pages/NormalPage";
import HardPage from "./pages/HardPage";
import StartClass from "./admin/StartClass";
import Lesson1 from "./admin/units/lesson1";

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/navbar' element={<Navbar />} />
        <Route path='/login' element={<Login />} />
        <Route path='/homeA' element={<HomeA />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/assessment' element={<Assessment />} />
        <Route path='/student/:sectionID' element={<Student />} />
        <Route path='/practice' element={<Practice />} />
        <Route path='/lvlNormal' element={<NormalPage />} />
        <Route path='/lvlHard' element={<HardPage />} />
        <Route path='/startClass' element={<StartClass />} />
        <Route path='/lesson1' element={<Lesson1 />} />
      </Routes>
    </div>
  );
}

export default App;
