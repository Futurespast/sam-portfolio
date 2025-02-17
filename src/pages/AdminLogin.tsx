import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./Responsive.css"; 

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const allowedEmail = "samprasad7220@gmail.com";
    if (email !== allowedEmail) {
      setError("Unauthorized: incorrect log in.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div className="admin-login-container">
      <h1>Login</h1>
      {error && <p className="admin-login-error">{error}</p>}
      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-login-input"
        />
        <button type="submit" className="admin-login-button">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;

