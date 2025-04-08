// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/theme-provider"; // ✅ importa el ThemeProvider

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark"> {/* ✅ activa el tema oscuro por defecto */}
    <App />
  </ThemeProvider>
);
