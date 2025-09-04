import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        about: "src/pages/about.html",
        login: "src/pages/login.html",
        register: "src/pages/register.html",
        dashboard: "src/pages/dashboard.html",
      },
    },
    outDir: "dist", // siempre en la raíz
  },
});
