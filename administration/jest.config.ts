import { type Config } from '@jest/types'

const swcConfig = {
  jsc: {
    experimental: {
      plugins: [['jest_workaround', {}]],
    },
    transform: {
      react: {
        runtime: 'automatic',
      },
    },
  },
}

const config: Config.InitialOptions = {
  clearMocks: true,
  testEnvironment: 'jsdom',
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  roots: ['src'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', swcConfig],
  },
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(pdf|css)$': 'identity-obj-proxy',
  },
}

export default config
