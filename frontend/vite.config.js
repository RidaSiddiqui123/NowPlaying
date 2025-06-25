import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures correct path resolution
  publicDir: 'public', // This is the default, but good to be explicit
})
