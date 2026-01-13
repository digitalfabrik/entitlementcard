import type { JestConfigWithTsJest } from 'ts-jest'
import { createDefaultEsmPreset } from 'ts-jest'

process.env.TZ = 'GMT'

const config: JestConfigWithTsJest = {
  ...createDefaultEsmPreset(),
  rootDir: 'src',
  testEnvironment: 'jsdom',
  verbose: true,
  automock: false,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          verbatimModuleSyntax: false,
          module: 'esnext',
          moduleResolution: 'bundler',
          target: 'esnext',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^build-configs$': '<rootDir>/../../build-configs/src/index.ts',
    // Strips .js extensions from imports, allowing Jest to resolve TypeScript files when the code
    // imports with .js extensions
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['../jest.setup.ts'],
  restoreMocks: true,
}

export default config
