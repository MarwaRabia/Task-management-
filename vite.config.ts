import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  resolve: {
    alias: {
      
      '@/': path.resolve(__dirname, './src/'),
      
  
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
},)
