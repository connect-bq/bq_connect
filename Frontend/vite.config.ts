import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Integrates Tailwind CSS into the build process.
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        about: "src/pages/about.html",
        login: "src/pages/login.html",
        register: "src/pages/register.html",
        dashboard: "src/pages/dashboard.html",


        404: "src/errors/404/404.html",
        500: "src/errors/500/500.html",
        401: "src/errors/401/401.html",
      },
    },
    outDir: "dist",
  },
});
