// src/main.tsx
if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  
  import { createRoot } from "react-dom/client";
  import App from "./App";
  import "./index.css";
  
  createRoot(document.getElementById("root")!).render(<App />);
  