import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/dashboard");
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Invalid username or password.");
      return;
    }
    navigate("/admin/dashboard");
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <div style={styles.logoMark}>TD</div>
        <h1 style={styles.title}>Techgenix Admin</h1>
        <p style={styles.subtitle}>Sign in to manage site content</p>

        <label style={styles.label}>Username / Email</label>
        <input
          style={styles.input}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#05070D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "36px 28px",
    display: "flex",
    flexDirection: "column",
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "linear-gradient(135deg,#2F6BFF,#5B8CFF)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    marginBottom: 18,
  },
  title: { color: "#F5F7FA", fontSize: 22, fontWeight: 700, margin: 0 },
  subtitle: { color: "#8B93A7", fontSize: 13.5, marginTop: 6, marginBottom: 26 },
  label: { color: "#9AA1B5", fontSize: 12.5, fontWeight: 600, marginBottom: 6, marginTop: 14 },
  input: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#F5F7FA",
    fontSize: 14.5,
    outline: "none",
  },
  error: {
    marginTop: 14,
    color: "#FF8585",
    fontSize: 13,
    background: "rgba(255,90,90,0.08)",
    border: "1px solid rgba(255,90,90,0.25)",
    borderRadius: 8,
    padding: "10px 12px",
  },
  button: {
    marginTop: 24,
    background: "linear-gradient(135deg,#2F6BFF,#1E4FD6)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px",
    fontSize: 14.5,
    fontWeight: 600,
    cursor: "pointer",
  },
};
