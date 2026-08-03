import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

let VitePWA = null;
try {
  const pwaModule = await import('vite-plugin-pwa');
  VitePWA = pwaModule.VitePWA;
} catch (e) {
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
    dedupe: ['react', 'react-dom'],
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
