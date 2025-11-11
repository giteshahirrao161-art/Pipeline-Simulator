import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PipelinesPage from "./pages/Pipelines.jsx";
import RunsPage from "./pages/Runs.jsx";

function SettingsPage() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 className="card-title" style={{ fontSize: 16 }}>Settings</h3>
      <p style={{ color: "var(--ink-2)", marginTop: 6 }}>
        Configure environment, API base URLs, and preferences here.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* 2-column layout: Sidebar (240px) + Content */}
      <div className="container" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
        <Sidebar />
        <div style={{ minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pipelines" element={<PipelinesPage />} />
            <Route path="/runs" element={<RunsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
