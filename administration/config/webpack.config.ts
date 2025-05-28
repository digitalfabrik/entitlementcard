// This file originally stems from a CRA-eject.
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { DeeplLinkingConfig } from 'build-configs'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import type { Configuration as WebpackConfiguration } from 'webpack/types'

import getDeepLinkingConfigs from '../src/project-configs/getDeeplinkingConfigs'
import getClientEnvironment from './env'
import getPaths, { moduleFileExtensions } from './getPaths'
import modules from './modules'
import createEnvironmentHash from './webpack/persistentCache/createEnvironmentHash'

type Configuration = WebpackConfiguration & { devServer: DevServerConfiguration }

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10)

// https://developer.android.com/training/app-links/verify-android-applinks#web-assoc
const generateAssetLinks = (config: DeeplLinkingConfig) =>
  JSON.stringify(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: config.android.applicationId,
          sha256_cert_fingerprints: [config.android.sha256CertFingerprint],
        },
      },
    ],
    null,
    2
  )

const generateAppleAppSiteAssociation = (config: DeeplLinkingConfig) =>
  JSON.stringify(
    {
      applinks: {
        apps: [],
        details: [
          {
            appID: config.ios.appleAppSiteAssociationAppId,
            components: [
              {
                '/': config.ios.path,
                comment: config.ios.pathComment,
              },
            ],
          },
        ],
      },
    },
    null,
    2
  )

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
const createWebpackConfig = (webpackEnv: 'development' | 'production'): Configuration => {
  console.log(`Creating configuration for ${webpackEnv}...`)

  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  const paths = getPaths()
  const distDirectory = path.resolve(__dirname, `../build/`)
  const assetLinksPreset = path.resolve(__dirname, 'assetlinks.json')
  const appleAppSiteAssociationPreset = path.resolve(__dirname, 'apple-app-site-association')

  // Variable used for enabling profiling in Production
  // passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile')

  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

  const shouldUseReactRefresh = env.raw.FAST_REFRESH === true

  return {
    target: ['browserslist'],
    mode: webpackEnv,
    // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction ? 'source-map' : 'cheap-module-source-map',
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in the JS bundle.
    entry: paths.appIndexJs,
    output: {
      // The build folder.
      path: paths.appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      // Webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env.raw),
      cacheDirectory: paths.appWebpackCache,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f => fs.existsSync(f)),
      },
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
          },
        }),
        // This is only used in production mode
        new CssMinimizerPlugin(),
      ],
    },
    resolve: {
      // This allows you to set a fallback for where webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules', paths.appNodeModules],
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: moduleFileExtensions.map(ext => `.${ext}`),
      alias: {
        // Allows for better profiling with ReactDevTools
        ...(isEnvProductionProfile
          ? {
              'react-dom$': 'react-dom/profiling',
              'scheduler/tracing': 'scheduler/tracing-profiling',
            }
          : {}),
        ...(modules.webpackAliases.src ? modules.webpackAliases : {}),
      },
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        } as const,
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // TODO: Merge this config once `image/avif` is in the mime-db
            // https://github.com/jshttp/mime-db
            {
              test: [/\.avif$/],
              type: 'asset',
              mimetype: 'image/avif',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: imageInlineSizeLimit,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            // Process application JS with babel
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('./babel.config.ts'),
                    {
                      runtime: 'automatic',
                    },
                  ],
                ],
                plugins: [isEnvDevelopment && shouldUseReactRefresh && require.resolve('react-refresh/babel')].filter(
                  Boolean
                ),
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            // Process any JS outside the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [[require.resolve('./babel-dependencies.config.ts'), { helpers: true }]],
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,

                // Babel sourcemaps are needed for debugging into node_modules
                // code.  Without the options below, debuggers like VSCode
                // show incorrect code and set breakpoints on the wrong lines.
                sourceMaps: true,
                inputSourceMap: true,
              },
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style-loader" enables hot editing
            // of CSS.
            {
              test: /\.css$/,
              use: [
                isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    sourceMap: true,
                    modules: { mode: 'icss' },
                  },
                },
              ],
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ].filter(Boolean),
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        template: paths.appHtml,
        ...(isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined),
      }),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is essential that NODE_ENV is set to production during a production build.
      // Otherwise, React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env.stringified),
      // Experimental hot reloading for React.
      // https://github.com/facebook/react/tree/main/packages/react-refresh
      isEnvDevelopment &&
        shouldUseReactRefresh &&
        new ReactRefreshWebpackPlugin({
          overlay: false,
        }),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path
            return manifest
          }, seed)
          const entrypointFiles = entrypoints.main.filter(fileName => !fileName.endsWith('.map'))

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          }
        },
      }),
      new CopyPlugin({
        patterns: [
          ...getDeepLinkingConfigs().map(config => ({
            from: assetLinksPreset,
            to: `${distDirectory}/${config.projectName}`,
            transform: () => generateAssetLinks(config),
          })),
          ...getDeepLinkingConfigs().map(config => ({
            from: appleAppSiteAssociationPreset,
            to: `${distDirectory}/${config.projectName}`,
            transform: () => generateAppleAppSiteAssociation(config),
          })),
        ],
      }),
    ].filter(Boolean),
    devServer: {
      compress: true,
      host: '0.0.0.0', // This enables devices in the same network to connect to the dev server
      hot: true,
      historyApiFallback: true,
      port: 3000,
      open: true,
      static: {
        directory: paths.appPublic,
      },
    },
  }
}

const getNodeEnv: () => 'development' | 'production' = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    return process.env.NODE_ENV
  }
  throw Error(`Illegal NODE_ENV: ${process.env.NODE_ENV}.`)
}

const config = createWebpackConfig(getNodeEnv())

export default config
