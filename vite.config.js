import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  css: {
    modules: false,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/index.css";`
      }
    }
  }
})