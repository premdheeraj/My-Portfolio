import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/My-Portfolio/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('.', import.meta.url).pathname,
    },
  },
});
