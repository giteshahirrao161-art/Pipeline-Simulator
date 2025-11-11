import React from "react";
export default function Button({ children, onClick, variant = "primary" }) {
  const base =
    "btn " +
    (variant === "primary"
      ? "btn-primary"
      : variant === "outline"
      ? "btn-outline"
      : variant === "success"
      ? "btn-soft"
      : "btn-primary");

  return (
    <button className={base} onClick={onClick}>
      {children}
    </button>
  );
}


