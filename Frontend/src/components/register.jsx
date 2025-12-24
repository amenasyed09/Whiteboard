import { useState } from "react";
import axios from "axios";
import React from "react";
const API_URL = import.meta.env.VITE_API_URL || "https://whiteboard-backend-1els.onrender.com/api";
export default function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${API_URL}/auth/register`,
        { name, email, password }
      );

      setSuccess("Registered successfully! Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.card}>
      <h2>🐾 Create Account</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleRegister}>
        <input
          style={styles.input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button style={styles.button}>Register</button>
      </form>

      <p style={styles.switch}>
        Already have an account?{" "}
        <span onClick={onSwitch} style={styles.link}>
          Login
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
  success: {
    color: "green",
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
