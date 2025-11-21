import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);

// Notify the HTML shell we’re ready (hides skeleton).                                 


                                                                               
window.dispatchEvent(new Event("app:ready"));

