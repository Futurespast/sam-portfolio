import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => navigate("/admin-login"), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Set New Password</h1>
      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.success}>{message}</p>}
      <form onSubmit={handleUpdatePassword} style={styles.form}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Update Password</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center" as const,
    padding: "2rem",
    color: "#fff",
    backgroundColor: "#000",
    maxWidth: "400px",
    margin: "5rem auto",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #444",
    outline: "none",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "0.8rem",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
  success: {
    color: "green",
    fontSize: "0.9rem",
  },
};

export default UpdatePassword;
