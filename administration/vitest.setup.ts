// https://testing-library.com/docs/svelte-testing-library/setup/
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Mock Vite build constants
Object.defineProperty(globalThis, 'VITE_BUILD_VERSION_NAME', {
  value: 'test',
})
Object.defineProperty(globalThis, 'VITE_BUILD_API_BASE_URL', {
  value: 'http://localhost:8000',
})

// Testing Library only cleans up automatically if test globals are enabled
afterEach(cleanup)
