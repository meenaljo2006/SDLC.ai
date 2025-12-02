import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sdlc.testproject.live',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://sdlc.testproject.live',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
