import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState("checking"); // checking | authed | guest

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "authed" : "guest");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "authed" : "guest");
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (status === "checking") {
    return (
      <div style={{ minHeight: "100vh", background: "#05070D", display: "flex", alignItems: "center", justifyContent: "center", color: "#8B93A7", fontFamily: "Inter, sans-serif" }}>
        Loading...
      </div>
    );
  }
  if (status === "guest") return <Navigate to="/admin" replace />;
  return children;
}
