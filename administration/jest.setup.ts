import { subtle } from 'crypto'
import { TextDecoder, TextEncoder } from 'util'

Object.assign(global, { TextDecoder, TextEncoder })
Object.assign(window, { isSecureContext: true })
Object.assign(window.crypto, { subtle })
Object.assign(window.URL, { createObjectURL: jest.fn() })
