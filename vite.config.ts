import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: './', // ← ¡ESTA es la línea mágica!
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"), // Directorio raíz dentro de client
  build: {
    outDir: path.resolve(__dirname, "client", "dist"), // Directorio de salida correcto
    emptyOutDir: true,
    assetsDir: "assets", // Carpeta para recursos estáticos
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: ["embla-carousel-react"],
  },
});
