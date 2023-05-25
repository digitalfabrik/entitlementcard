const path = require('path')

module.exports = function (config) {
  config.set({
    basePath: 'src',
    frameworks: ['jasmine', 'webpack'],
    files: [
      {
        pattern: './**/*.test.+(ts|tsx)',
        // We use webpack's watch functionality.
        watched: false,
      },
    ],
    plugins: ['karma-webpack', 'karma-sourcemap-loader', 'karma-jasmine', 'karma-chrome-launcher'],
    preprocessors: {
      './**/*.test.{ts,tsx}': ['webpack', 'sourcemap'],
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
          {
            test: /\.(pdf)$/,
            include: [path.resolve(__dirname, 'src', 'project-configs')],
            type: 'asset/resource',
            generator: {
              filename: 'pdfs/[name][hash].[ext]',
            },
          },

          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.ts', '.tsx'],
        alias: {},
      },
      context: path.resolve(__dirname, './src'),
      devtool: 'inline-source-map',
    },
    browsers: ['ChromeHeadless'],
  })
}
