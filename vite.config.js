import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, 'src/context'),
      '@auth': path.resolve(__dirname, 'src/components/Auth'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@administrador': path.resolve(__dirname, 'src/components/administrador'), // asegúrate que esta carpeta existe
      '@professors': path.resolve(__dirname, 'src/components/profesor'),
      '@calendario': path.resolve(__dirname, 'src/components/Calendar'),
      '@ui': path.resolve(__dirname, 'src/components/UI'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
