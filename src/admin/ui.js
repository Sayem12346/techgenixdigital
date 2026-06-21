import React from "react";

export const ui = {
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px 20px", marginBottom: 16 },
  label: { display: "block", color: "#9AA1B5", fontSize: 12.5, fontWeight: 600, marginBottom: 6, marginTop: 14 },
  input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 13px", color: "#F5F7FA", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 13px", color: "#F5F7FA", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif", resize: "vertical" },
  sectionTitle: { fontSize: 17, fontWeight: 700, marginBottom: 4 },
  sectionDesc: { fontSize: 13, color: "#8B93A7", marginBottom: 18 },
  primaryBtn: { background: "linear-gradient(135deg,#2F6BFF,#1E4FD6)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" },
  secondaryBtn: { background: "rgba(255,255,255,0.06)", color: "#C7CCDA", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" },
  dangerBtn: { background: "rgba(255,80,80,0.12)", color: "#FF8585", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  toast: (ok) => ({
    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
    background: ok ? "rgba(91,227,160,0.15)" : "rgba(255,80,80,0.15)",
    border: `1px solid ${ok ? "rgba(91,227,160,0.4)" : "rgba(255,80,80,0.4)"}`,
    color: ok ? "#5BE3A0" : "#FF8585",
    padding: "11px 22px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, zIndex: 50,
  }),
};

export function Field({ label, children }) {
  return (
    <div>
      <label style={ui.label}>{label}</label>
      {children}
    </div>
  );
}

export function Toast({ message, ok }) {
  if (!message) return null;
  return <div style={ui.toast(ok)}>{message}</div>;
}
