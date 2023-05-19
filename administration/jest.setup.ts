import crypto from 'crypto'
import { TextEncoder } from 'util'

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr: any[]) => crypto.randomBytes(arr.length),
    subtle: crypto.webcrypto.subtle,
  },
})

global.TextEncoder = TextEncoder

window.isSecureContext = true
window.localStorage.setItem('project-override', 'bayern.ehrenamtskarte.app')
