import React from "react";

export default function Section({ title, children, className = "" }) {
  return (
    <section className={`grid gap-3 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </section>
  );
}
