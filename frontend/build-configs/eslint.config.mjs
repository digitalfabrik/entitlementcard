import baseConfig from '../../eslint.config-base.mjs'

export default [
  ...baseConfig,
  {
    ignores: ['dist/**/*', '**eslint.config.mjs'],
  },
]
