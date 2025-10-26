import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api calls to backend Laravel dev server (php artisan serve)
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    }
  }
});