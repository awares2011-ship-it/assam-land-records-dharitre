import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    // Dev-only CORS workaround: calls to /dhar/* are forwarded to the real
    // Dharitree portal. In production the Capacitor Android build uses
    // CapacitorHttp to call ilrms.assam.gov.in directly (no proxy needed).
    proxy: {
      '/dhar': {
        target: 'https://ilrms.assam.gov.in',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
