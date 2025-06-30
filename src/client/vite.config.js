import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [react()],
    base: '',
    build: {
      emptyOutDir: true,
      outDir: '../modules/addons/lknnoteplus/src/assets/',
      rollupOptions: {
        input: './src/main.jsx' // Replace with your desired entry point
      },
      watch: false
    },
    server: {
      port: 8014,
      host: '0.0.0.0'
    }
  }
})
