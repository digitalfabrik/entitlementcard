import baseConfig from '../eslint.config-base.mjs'

export default [
  ...baseConfig,
  {
    ignores: ['src/generated/**/*', 'src/coverage/**/*', 'build/**/*', '**eslint.config.mjs'],
  },
  {
    files: ['scripts/**', 'config/**'],
    rules: {
      'global-require': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
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
