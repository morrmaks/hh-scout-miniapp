import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src')
    }
  }
});
