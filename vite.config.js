import { fileURLToPath } from 'url';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Chuyển đổi __dirname cho ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {}

  }  
});
