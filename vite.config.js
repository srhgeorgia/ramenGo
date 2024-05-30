import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',  // Define o diretório raiz como o diretório principal
  base: './', // Define a base URL relativa
  publicDir: 'public', // Diretório para arquivos estáticos
  build: {
    outDir: 'dist', // Diretório de saída para a build
    rollupOptions: {
      input: 'index.html', // Arquivo de entrada principal
    }
  },
  server: {
    open: true // Abre o navegador automaticamente quando o servidor iniciar
  }
});