import { defineConfig } from 'vitest/config';

export default defineConfig({
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
