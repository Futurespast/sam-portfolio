import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== "samprasad7220@gmail.com") {
        navigate("/admin-login");
      } else {
        setUser(user);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      {user && <p>Welcome, {user.email}!</p>}
      <button onClick={handleLogout} style={styles.button}>Logout</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center" as const,
    padding: "2rem",
    color: "#fff",
    backgroundColor: "#000",
    maxWidth: "600px",
    margin: "5rem auto",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
  },
  button: {
    backgroundColor: "#ff4444",
    color: "#fff",
    padding: "0.8rem",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

export default AdminDashboard;
