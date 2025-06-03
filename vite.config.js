import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Set the project root to the 'src' directory
  publicDir: '../public', // Set the public directory relative to the root
  build: {
    outDir: '../dist', // Output directory for the build
    rollupOptions: {
      input: {
        main: 'src/index.html' // Ensure Vite processes index.html from src
      }
    }
  },
  server: {
    open: true // Automatically open the app in the browser on server start
  }
});
