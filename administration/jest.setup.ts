import '@testing-library/jest-dom'
import { subtle } from 'crypto'
import { TextDecoder, TextEncoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })
Object.assign(window, { isSecureContext: true })
Object.assign(window.crypto, { subtle })
Object.assign(window.URL, { createObjectURL: jest.fn() })

jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: jest.fn(),
}))

// disable enableAccessibleFieldDOMStructure for testing to ensure CustomDatePicker can be left via onBlur()
jest.mock('@mui/system', () => ({
  ...jest.requireActual('@mui/system'),
  useMediaQuery: jest.fn().mockReturnValue(true),
}))
