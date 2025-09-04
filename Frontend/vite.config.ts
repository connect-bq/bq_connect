import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Recreates __dirname to work in ES Modules.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // Integrates Tailwind CSS into the build process.
  plugins: [tailwindcss()],
  
  // Defines 'src' as the project's root folder.
  root: 'src', 
  
  // Configuration for the build process.
  build: {
    rollupOptions: {
      // Defines each HTML page as an entry point (multi-page setup).
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
    // Defines 'dist' as the output folder, one level above 'src'.
    outDir: '../dist',
  },
});