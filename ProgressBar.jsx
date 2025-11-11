import React from "react";

export default function ProgressBar({ value = 0 }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
      <div className="h-full bg-indigo-600" style={{ width: `${value}%` }} />
    </div>
  );
}
