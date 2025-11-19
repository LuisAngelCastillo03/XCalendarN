import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Especifica explícitamente la raíz del proyecto
  root: '.',
  
  // Configuración de build
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@auth': path.resolve(__dirname, 'src/components/Auth'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@administrador': path.resolve(__dirname, 'src/components/administrador'),
      '@professors': path.resolve(__dirname, 'src/components/profesor'),
      '@calendario': path.resolve(__dirname, 'src/components/Calendar'),
      '@ui': path.resolve(__dirname, 'src/components/UI'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  
  // Servidor de desarrollo
  server: {
    port: 3000,
    open: true
  }
});