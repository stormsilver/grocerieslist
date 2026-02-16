import { defineConfig } from 'vitest/config';
import { transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

const jsxInJs = () => ({
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.includes('/app/javascript/') || !id.endsWith('.js')) return null;
    return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
  },
});

export default defineConfig({
  plugins: [jsxInJs(), react({ include: /app\/javascript\/.*\.[jt]sx?$/ })],
  esbuild: {
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['app/javascript/test/setupTests.js'],
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      exclude: ['app/javascript/test/**', '**/*.config.*'],
    },
  },
});
