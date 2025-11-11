import React from "react";
export default function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm ${className}`}
      {...props}
    />
  );
}
