import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
  appType: 'spa',
  plugins: [
    react()
  ],
  build: {
    assetsInlineLimit: 10000,
    target: '>0.2% in DE and not dead'
  },
  server: {
    port: 3000
  }
} satisfies UserConfig
