import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
//import Testimonials from "./pages/Testimonials";
//import Contact from "./pages/Contact";
//import Admin from "./pages/Admin";
import './App.css'

function App() {
  

  return (
    <div style={styles.app}>
    <Router>
    <Navbar/>
    <div style={styles.content}>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/testimonials" element={<Testimonials />}/>
      <Route path="/contact" element={<Contact />} />{/*
      <Route path="/admin" element={<Admin />} />*/}
    </Routes> 
    </div>
    <Footer/>
  </Router>
  </div>
  )
}

export default App

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    flex: 1,
    marginTop: "80px",    
    marginBottom: "80px", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
