import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Fängt alle lokalen Anfragen ab, die mit /api/ beginnen
      '/api': {
        target: 'https://api.mfapi.in', // Die echte Ziel-API Subdomain
        changeOrigin: true,
        // Entfernt das "/api" aus dem Pfad, bevor es an den Server geschickt wird
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})
