// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "client", "dist"),
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      external: [],
    },
  },
  preview: {
    host: true, // 0.0.0.0
    allowedHosts: ["soulhealing-06jy.onrender.com"], // tu dominio de Render
    strictPort: true,
  },
  optimizeDeps: {
    include: ["embla-carousel-react"],
  },
});
