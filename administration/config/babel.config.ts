const path = require('path')

const validateBoolOption = (option: string, opts: Record<string, unknown>, defaultValue: boolean): boolean => {
  if (!(option in opts)) {
    return defaultValue
  }
  const value = (opts as Record<string, unknown>)[option]
  if (typeof value !== 'boolean') {
    throw Error(`Expected ${value} to be a boolean. Received ${value}`)
  }
  return value
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const create = (api: unknown, opts: Record<string, unknown> | null | undefined) => {
  const env = process.env.NODE_ENV
  if (env !== 'development' && env !== 'production' && env !== 'test') {
    throw Error(`Environment not specified. Received ${env}. Expected one of: development, production, test`)
  }
  if (opts === null || opts === undefined) {
    opts = {}
  }

  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'
  const isEnvTest = env === 'test'

  const isTypeScriptEnabled = validateBoolOption('typescript', opts, true)
  const areHelpersEnabled = validateBoolOption('helpers', opts, false)
  const useAbsoluteRuntime = validateBoolOption('absoluteRuntime', opts, true)
  const reactRuntime = 'runtime' in opts ? opts.runtime : 'classic'
  // TODO: The default changed to automatic in babel 8. Probably we should switch too?

  let absoluteRuntimePath: string | undefined
  if (useAbsoluteRuntime) {
    absoluteRuntimePath = path.dirname(require.resolve('@babel/runtime/package.json'))
  }

  return {
    assumptions: {
      // class { handleClick = () => { } }
      // Add assumptions to use assignment instead of defineProperty
      privateFieldsAsProperties: true,
      setPublicClassFields: true,
    },
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version
        require('@babel/preset-env').default,
        {
          targets: {
            node: 'current',
          },
        },
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require('@babel/preset-env').default,
        {
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        require('@babel/preset-react').default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          // TODO: useBuiltins is removed in Babel 8.
          ...(reactRuntime !== 'automatic' ? { useBuiltIns: true } : {}),
          runtime: reactRuntime,
        },
      ],
      isTypeScriptEnabled && [require('@babel/preset-typescript').default],
    ].filter(Boolean),
    plugins: [
      // Turn on legacy decorators for TypeScript files
      isTypeScriptEnabled && [require('@babel/plugin-proposal-decorators').default, false],
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          helpers: areHelpersEnabled,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require('@babel/runtime/package.json').version,
          // Option that lets us encapsulate our runtime, ensuring the correct version is used
          absoluteRuntime: absoluteRuntimePath,
        },
      ],
      isEnvProduction && [
        // Remove PropTypes from production build
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true,
        },
      ],
    ].filter(Boolean),
    overrides: [
      isTypeScriptEnabled && {
        test: /\.tsx?$/,
        plugins: [[require('@babel/plugin-proposal-decorators').default, { legacy: true }]],
      },
    ].filter(Boolean),
  }
}

export default create
