import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  
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
      <Link to="/admin" style={styles.link}>Admin</Link>
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
  };
  
  export default Navbar;