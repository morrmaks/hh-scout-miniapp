import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
