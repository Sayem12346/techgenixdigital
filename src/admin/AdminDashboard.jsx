import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SettingsTab from "./tabs/SettingsTab";
import ServicesTab from "./tabs/ServicesTab";
import TestimonialsTab from "./tabs/TestimonialsTab";
import CaseStudiesTab from "./tabs/CaseStudiesTab";

const TABS = [
  { id: "settings", label: "Hero & Contact" },
  { id: "services", label: "Services" },
  { id: "testimonials", label: "Testimonials" },
  { id: "case_studies", label: "Case Studies" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("settings");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <div style={styles.logoMark}>TD</div>
            <span style={styles.brandText}>Techgenix Admin</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/" target="_blank" rel="noreferrer" style={styles.viewSiteBtn}>
              View Site
            </a>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Log Out
            </button>
          </div>
        </div>
        <div style={styles.tabRow}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...styles.tabBtn,
                color: tab === t.id ? "#F5F7FA" : "#8B93A7",
                borderColor: tab === t.id ? "#2F6BFF" : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main style={styles.main}>
        {tab === "settings" && <SettingsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "case_studies" && <CaseStudiesTab />}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#05070D", fontFamily: "Inter, sans-serif", color: "#F5F7FA" },
  header: { position: "sticky", top: 0, zIndex: 10, background: "rgba(5,7,13,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  headerInner: { maxWidth: 980, margin: "0 auto", padding: "16px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#2F6BFF,#5B8CFF)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 },
  brandText: { fontWeight: 600, fontSize: 15 },
  viewSiteBtn: { color: "#9DB6FF", textDecoration: "none", fontSize: 13, fontWeight: 600, padding: "8px 14px", border: "1px solid rgba(47,107,255,0.3)", borderRadius: 8 },
  logoutBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#C7CCDA", fontSize: 13, fontWeight: 600, padding: "8px 14px", borderRadius: 8, cursor: "pointer" },
  tabRow: { maxWidth: 980, margin: "0 auto", display: "flex", gap: 4, marginTop: 16, overflowX: "auto" },
  tabBtn: { background: "none", border: "none", borderBottom: "2px solid", padding: "10px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  main: { maxWidth: 980, margin: "0 auto", padding: "28px 20px 60px" },
};
