import { join } from 'node:path'
import { type JestConfigWithTsJest, createDefaultEsmPreset } from 'ts-jest'

process.env.TZ = 'GMT'

// ESM-only dependencies (without CommonJS build), which have to be transformed to CommonJS for Jest.
const esmOnlyModules = '(react-router|@remix-run|cookie-es|temporal-polyfill|temporal-utils)'

const config: JestConfigWithTsJest = {
  ...createDefaultEsmPreset(),
  roots: ['<rootDir>/src', '<rootDir>/src-gen'],
  testEnvironment: 'jsdom',
  verbose: true,
  automock: false,
  transform: {
    // ts-jest transpiles node_modules without astTransformers (i.e. leaves `import.meta` untouched),
    // so babel-jest is used instead.
    [`/node_modules/${esmOnlyModules}/.+\\.m?js$`]: [
      'babel-jest',
      {
        babelrc: false,
        configFile: false,
        plugins: [
          join('scripts/babel-plugin-jest-import-meta.cjs'),
          '@babel/plugin-transform-modules-commonjs',
        ],
      },
    ],
    // Also process Js files, so we can support 'build-configs'.
    '^.+\\.(tsx?|js)$': [
      'ts-jest',
      {
        tsconfig: {
          // ts-jest internally forces moduleResolution to Node10 (via fixupCompilerOptionsForModuleKind),
          // which TypeScript 6.0 has deprecated. This silences the resulting TS5107 error.
          ignoreDeprecations: '6.0',
        },
        diagnostics: {
          // 1343: ts-jest internal
          // 5011: ts-jest forces noEmit:false, causing TypeScript 6 to require rootDir when emitting
          ignoreCodes: [1343, 5011],
        },
        astTransformers: {
          before: [
            {
              // https://www.npmjs.com/package/ts-jest-mock-import-meta
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
  transformIgnorePatterns: [`/node_modules/(?!${esmOnlyModules}/)`],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.ts',
    // Jest doesn't understand TypeScript's rootDirs, so relative imports of generated files
    // (e.g. '../../card_pb', '../graphql') need to be remapped to their actual location.
    '^.+/card_pb$': '<rootDir>/src-gen/card_pb',
    '^.+/graphql$': '<rootDir>/src-gen/graphql',
    // temporal-polyfill uses the native Temporal if available, which ignores Jest's fake timers.
    '^temporal-polyfill$': 'temporal-polyfill/implementation',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  restoreMocks: true,
}

export default config
