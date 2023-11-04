import { Routes, Route } from "react-router-dom";
import background from "./assets/backG.jpg";

import MLogin from "./pages/MLogin";
import MRegister from "./pages/MRegister";
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
import L1Test1 from "./admin/activities/L1Test1";

function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/navbar' element={<Navbar />} />
        <Route path='/modified-login' element={<MLogin />} />
        <Route path='/homeA' element={<HomeA />} />
        <Route path='/register' element={<MRegister />} />
        <Route path='/about' element={<About />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/assessment' element={<Assessment />} />
        <Route path='/student/:sectionID' element={<Student />} />
        <Route path='/practice' element={<Practice />} />
        <Route path='/lvlNormal' element={<NormalPage />} />
        <Route path='/lvlHard' element={<HardPage />} />
        <Route path='/startClass' element={<StartClass />} />
        <Route path='/lesson1' element={<Lesson1 />} />
        <Route path='/l1t1' element={<L1Test1 />} />
      </Routes>
    </div>
  );
}

export default App;
