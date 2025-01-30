import type { JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'

process.env.TZ = 'GMT'

const config: JestConfigWithTsJest = {
  ...tsjPreset,
  rootDir: 'src',
  testEnvironment: 'jsdom',
  verbose: true,
  automock: false,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['../jest.setup.ts'],
  restoreMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  maxWorkers: '50%',
  transform: {
    '^.+\\.(j|t)sx?$': ['ts-jest', { isolatedModules: true }],
  },
}

export default config
