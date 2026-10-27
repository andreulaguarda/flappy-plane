import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/flappy-plane/' : '/',
  build: {
    outDir: 'dist',
    target: 'es2020'
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js']
  }
}));
