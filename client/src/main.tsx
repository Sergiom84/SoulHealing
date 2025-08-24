// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/theme-provider";

console.log("VITE_SUPABASE_URL cargado:", !!import.meta.env.VITE_SUPABASE_URL);
console.log(
  "VITE_SUPABASE_ANON_KEY cargado:",
  !!import.meta.env.VITE_SUPABASE_ANON_KEY
);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark">
    <App />
  </ThemeProvider>
);
