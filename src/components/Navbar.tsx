import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import "../pages/Responsive.css"; 

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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleAdminClick = () => {
    if (isLoggedIn) {
      navigate("/admin-dashboard");
    } else {
      navigate("/admin-login");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <b className="nav-brand">Next Gen Dev</b>
      <ul className="nav-list">
        <li>
          <Link to="/">
            {language === "EN" ? "Home" : "Page d'Accueil"}
          </Link>
        </li>
        <li>
          <Link to="/testimonials">
            {language === "EN" ? "Testimonials" : "Témoignages"}
          </Link>
        </li>
        <li>
          <Link to="/contact">
            {language === "EN" ? "Contact Me" : "Contactez-moi"}
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleAdminClick}>
              Login
            </button>
          </li>
        )}
        <li>
          <button onClick={toggleLanguage}>
            {language === "EN" ? "FR" : "EN"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
