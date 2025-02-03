import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleAdminClick = () => {
    if (isLoggedIn) {
      navigate("/admin-dashboard");
    } else {
      navigate("/admin-login");
    }
  };

  return (
    <nav style={styles.navbar}>
    <b style={styles.brand}>Next Gen Dev</b>
    <ul style={styles.navList}>
      <li>
      <Link to="/" style={styles.link}>{language === "EN"? "Main Page" : "Page d'Accueil"}</Link>
      </li>
      <li>
      <Link to="/testimonials" style={styles.link}>{language === "EN"? "Testimonials" : "Témoignages"}</Link>
      </li>
      <li>
      <Link to="/contact" style={styles.link}>{language === "EN"? "Contact Me" : "Contactez-moi"}</Link>
      </li>
      <li>
      <button style={styles.adminButton} onClick={handleAdminClick}>Admin</button>
      </li>
      <li>
      <button onClick={toggleLanguage} style={styles.languageButton}>
        {language === "EN" ? "FR" : "EN"}
      </button>
      </li>
    </ul>
    </nav>
  );
  };
  
  import { CSSProperties } from "react";
  
  const styles: { [key: string]: CSSProperties } = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    boxSizing: "border-box" as const,
  },
  brand: {
    margin: 0,
  },
  navList: {
    display: "flex",
    listStyleType: "none",
    gap: "1rem",
    margin: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  languageButton: {
    backgroundColor: "transparent",
    border: "1px solid #fff",
    borderRadius: "5px",
    padding: "0.5rem",
    color: "#fff",
    cursor: "pointer",
  },
  adminButton: {
    background: "none",
    border: "none",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  };
  
  export default Navbar;