import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, GitBranch, Activity, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="rounded-2xl border bg-white/90 shadow-sm p-4 h-fit sticky top-6">
      <nav className="grid gap-2 text-sm font-semibold">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md ${
              isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-700"
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>

        <NavLink
          to="/pipelines"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md ${
              isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-700"
            }`
          }
        >
          <GitBranch className="w-4 h-4" />
          Pipelines
        </NavLink>

        <NavLink
          to="/runs"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md ${
              isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-700"
            }`
          }
        >
          <Activity className="w-4 h-4" />
          Runs
        </NavLink>

        <hr className="my-3" />

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md ${
              isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-700"
            }`
          }
        >
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
