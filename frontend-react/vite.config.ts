import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // AGREGA ESTE BLOQUE SERVER:
  server: {
    host: true, // Expone el proyecto a la red
    port: 5173, // Fuerza a usar siempre este puerto
    strictPort: true, // Si el 5173 está ocupado, dará error en vez de saltar al 5174
    hmr: {
      clientPort: 443 // Le dice a Vite que Codespaces usa protocolo seguro (HTTPS)
    }
  }
})