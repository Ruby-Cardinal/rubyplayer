import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Optional plugin loading for vite-plugin-pwa if module is available
let VitePWA = null;
try {
  const pwaModule = await import('vite-plugin-pwa');
  VitePWA = pwaModule.VitePWA;
} catch (e) {
  // Gracefully fallback to static public/sw.js & public/manifest.json if module not yet installed
}

export default defineConfig({
  plugins: [
    react(),
    ...(VitePWA
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'script',
            manifest: false, // Use public/manifest.json
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
              navigateFallback: '/index.html',
              navigateFallbackDenylist: [/^\/api/],
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      jsmediatags: 'jsmediatags/dist/jsmediatags.min.js',
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env': {},
    global: 'window',
  },
});
