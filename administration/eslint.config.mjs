import baseConfig from '../eslint.config-base.mjs'

export default [
  ...baseConfig,
  {
    ignores: [
      '**eslint.config.mjs',
      'build/**/*',
      'e2e-tests/',
      'playwright.config.ts',
      'src/generated/**/*',
      'src/coverage/**/*',
    ],
  },
  {
    files: ['scripts/**', 'config/**'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'global-require': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-dynamic-require': 'off',
    },
  },
  {
    files: ['src/mui-modules/application/forms/**'],
    rules: {
      'react/jsx-pascal-case': 'off',
    },
  },
]
