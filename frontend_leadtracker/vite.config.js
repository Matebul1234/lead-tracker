import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server:{
    port:3002,
    open:'/',
    // host:'10.1.1.36'
    host:'192.168.2.34'
  }
})
