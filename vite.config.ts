/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'music',
      filename: 'remoteEntry.js',
      exposes: {
        './MusicApp': './src/App',
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '18.2.0' },
        '@OmarZambranoDev/portfolio-ui': { singleton: true },
        zustand: { singleton: true, version: '4.5.2' },
      },
    }),
  ],
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
    onConsoleLog: (log) => {
      if (log.includes('was not wrapped in act')) return false;
    },
  },
});
