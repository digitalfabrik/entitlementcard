import type { JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'

const config: JestConfigWithTsJest = {
  ...tsjPreset,
  preset: 'ts-jest',
  rootDir: 'src',
  testEnvironment: 'jest-environment-jsdom',
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
}

export default config
