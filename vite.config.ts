// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      injectRegister: null,
      devOptions: { enabled: false },
      filename: 'sw.js',
      manifest: false,
      includeAssets: ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'manifest.webmanifest'],
      workbox: {
        globPatterns: ['**/*.{js,css,png,jpg,woff2,html}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: null,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          { urlPattern: ({request,url}) => request.mode === 'navigate' && !url.pathname.startsWith('/~oauth'), handler: 'NetworkFirst', options: {cacheName: 'alif-pages', networkTimeoutSeconds: 4, cacheableResponse: {statuses:[200]}} },
          { urlPattern: ({url}) => url.origin === self.location.origin && /\/assets\/.*[-.][a-zA-Z0-9_-]{8,}\./.test(url.pathname), handler: 'CacheFirst', options: {cacheName:'alif-assets', expiration:{maxEntries:100,maxAgeSeconds:2592000}} },
          { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//, handler: 'StaleWhileRevalidate', options: {cacheName:'alif-fonts',cacheableResponse:{statuses:[0,200]}} },
        ],
      },
    })],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
