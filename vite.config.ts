import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Honour the backend contract's NEXT_PUBLIC_API_URL as well as Vite's VITE_ prefix.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    port: 3000,
    // Optional same-origin dev proxy: set VITE_API_URL=/ to use it.
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/oauth2': { target: 'http://localhost:8080', changeOrigin: true },
      // No `/login` proxy: that is an SPA route as well as an OAuth backend path.
      '/ws': { target: 'ws://localhost:8080', ws: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the initial bundle small and caches granular.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@tanstack/react-query')) return 'query'
          if (id.includes('@stomp/stompjs') || id.includes('sockjs-client')) return 'realtime'
          if (id.includes('react-router')) return 'router'
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) return 'forms'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
})
