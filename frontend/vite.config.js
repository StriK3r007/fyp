import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// import { reactRouter } from "@react-router/dev/vite";
// import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // reactRouter(),
    // tsconfigPaths(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // or whatever your backend runs on
        changeOrigin: true,
        secure: false,
      },
    },
  },
})