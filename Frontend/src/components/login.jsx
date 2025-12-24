import { useState } from "react";
import axios from "axios";
import React from "react";
const API_URL = import.meta.env.VITE_API_URL || "https://whiteboard-backend-1els.onrender.com/api";
export default function Login({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}auth/login`,
        { email, password }
      );

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.card}>
      <h2>🐱 Login to KittyBoard</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={styles.button}>Login</button>
      </form>

      <p style={styles.switch}>
        New here?{" "}
        <span onClick={onSwitch} style={styles.link}>
          Register
        </span>
      </p>
    </div>
  );
}

const styles = {
  card: {
    width: 320,
    padding: 20,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#ff69b4",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  switch: {
    marginTop: 10,
    fontSize: 14,
  },
  link: {
    color: "#ff69b4",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
