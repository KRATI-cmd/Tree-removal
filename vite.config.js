import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three.js (~580 kB) is its own lazily loaded chunk, fetched after first paint.
    chunkSizeWarningLimit: 700,
  },
})
