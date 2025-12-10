const path = require('path')

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const create = () => {
  const env = process.env.NODE_ENV
  if (env !== 'development' && env !== 'production') {
    throw Error(
      `Environment not specified. Received ${env}. Expected one of: development, production`,
    )
  }

  const absoluteRuntimePath = path.dirname(require.resolve('@babel/runtime/package.json'))

  return {
    // Babel assumes ES Modules, which isn't safe until CommonJS
    // dies. This changes the behavior to assume CommonJS unless
    // an `import` or `export` is present in the file.
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: 'unambiguous',
    presets: [require('@babel/preset-env').default].filter(Boolean),
    plugins: [
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require('@babel/plugin-transform-runtime').default,
        {
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require('@babel/runtime/package.json').version,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules: true,
          // Option that lets us encapsulate our runtime, ensuring the correct version is used
          absoluteRuntime: absoluteRuntimePath,
        },
      ],
    ].filter(Boolean),
  }
}

export default create
