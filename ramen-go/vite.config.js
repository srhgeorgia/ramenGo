// vite.config.js
export default {  
  build: {
    outDir: 'dist', 
    rollupOptions: {
      input: {
        main: 'src/main.js' 
      }
    }
  }
}

