import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Si también usas /routes:
      '/routes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
