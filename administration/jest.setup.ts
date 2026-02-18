import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { subtle } from 'crypto'
import { TextDecoder, TextEncoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })
Object.assign(window, { isSecureContext: true })
Object.assign(window.crypto, { subtle })
Object.assign(window.URL, { createObjectURL: jest.fn() })

// Mock Vite build constants
Object.defineProperty(globalThis, 'VITE_BUILD_VERSION_NAME', {
  value: 'test',
})
Object.defineProperty(globalThis, 'VITE_BUILD_API_BASE_URL', {
  value: 'http://localhost:8000',
})

jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: jest.fn(),
}))

// disable enableAccessibleFieldDOMStructure for testing to ensure CustomDatePicker can be left via onBlur()
jest.mock('@mui/system', () => ({
  ...(jest.requireActual('@mui/system') as object),
  useMediaQuery: jest.fn().mockReturnValue(true),
}))
