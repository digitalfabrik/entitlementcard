import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

process.env.TZ = 'GMT'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: [
      // temporal-polyfill uses the native Temporal if available, which ignores fake timers.
      { find: /^temporal-polyfill$/, replacement: 'temporal-polyfill/implementation' },
    ],
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
})
