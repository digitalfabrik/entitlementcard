const path = require('path')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const create = () => {
  const env = process.env.NODE_ENV
  if (env !== 'development' && env !== 'production') {
    throw Error(`Environment not specified. Received ${env}. Expected one of: development, production`)
  }

  const isEnvDevelopment = env === 'development'
  const isEnvProduction = env === 'production'

  const absoluteRuntimePath = path.dirname(require.resolve('@babel/runtime/package.json'))

  return {
    assumptions: {
      // class { handleClick = () => { } }
      // Add assumptions to use assignment instead of defineProperty
      privateFieldsAsProperties: true,
      setPublicClassFields: true
    },
    presets: [
      [require('@babel/preset-env').default],
      [
        require('@babel/preset-react').default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isEnvDevelopment,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
          runtime: 'automatic'
        }
      ],
      [require('@babel/preset-typescript').default]
    ].filter(Boolean),
    plugins: [
      // Use React compiler (has to run first!)
      [require('babel-plugin-react-compiler').default],
      // Turn on legacy decorators for TypeScript files
      [require('@babel/plugin-proposal-decorators').default, false],
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          helpers: false,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require('@babel/runtime/package.json').version,
          // Option that lets us encapsulate our runtime, ensuring the correct version is used
          absoluteRuntime: absoluteRuntimePath
        }
      ],
      isEnvProduction && [
        // Remove PropTypes from production build
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true
        }
      ]
    ].filter(Boolean),
    overrides: [
      {
        test: /\.tsx?$/,
        plugins: [[require('@babel/plugin-proposal-decorators').default, { legacy: true }]]
      }
    ].filter(Boolean)
  }
}

export default create
