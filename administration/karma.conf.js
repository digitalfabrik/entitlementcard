const path = require('path')

module.exports = function (config) {
  config.set({
    basePath: 'src',
    frameworks: ['jasmine', 'webpack'],
    files: ['./**/*.test.ts'],
    plugins: ['karma-webpack', 'karma-jasmine', 'karma-chrome-launcher'],
    preprocessors: {
      './**/*.test.ts': ['webpack'],
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
        ],
      },
      resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.ts', '.tsx'],
        alias: {},
      },
      context: path.resolve(__dirname, './src'),
    },
    browsers: ['ChromeHeadless'],
  })
}
