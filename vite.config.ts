/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3002,
    cors: true,
  },
  preview: {
    port: 3002,
    cors: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['src/e2e/**', 'node_modules/**'],
    setupFiles: ['src/test-setup.ts'],
    onConsoleLog: (log: string) => {
      if (log.includes('was not wrapped in act')) return false;
    },
  },
});
