import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TechgenixDigital from "./TechgenixDigital.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import RequireAuth from "./admin/RequireAuth.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TechgenixDigital />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
