import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import UpdatePassword from "./pages/UpdatePassword";
import "./pages/Responsive.css";

function App() {
  

  return (
    <div className="app">
    <Router>
    <Navbar/>
    <div className="app-content">
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/testimonials" element={<Testimonials />}/>
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/update-password" element={<UpdatePassword />} />
    </Routes> 
    </div>
    <Footer/>
  </Router>
  </div>
  )
}

export default App


