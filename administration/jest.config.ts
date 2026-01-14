import { createDefaultEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

process.env.TZ = 'GMT'

const config: JestConfigWithTsJest = {
  ...createDefaultEsmPreset(),
  rootDir: 'src',
  testEnvironment: 'jsdom',
  verbose: true,
  automock: false,
  transform: {
    // https://www.npmjs.com/package/ts-jest-mock-import-meta
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    BASE_URL: '/',
                    DEV: false,
                    MODE: 'test',
                    PROD: false,
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^build-configs$': '<rootDir>/../../build-configs/src/index.ts',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['../jest.setup.ts'],
  restoreMocks: true,
}

export default config
