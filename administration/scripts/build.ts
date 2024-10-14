// This file originally stems from a CRA-eject.
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import FileSizeReporter from 'react-dev-utils/FileSizeReporter'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import printBuildError from 'react-dev-utils/printBuildError'
import printHostingInstructions from 'react-dev-utils/printHostingInstructions'
import webpack from 'webpack'

import getPaths from '../config/getPaths'
import configFactory from '../config/webpack.config'

const bfj = require('bfj')

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const paths = getPaths()

const copyPublicFolder = () => {
  fs.cpSync(paths.appPublic, paths.appBuild, {
    dereference: true,
    recursive: true,
    filter: srcFile => srcFile !== paths.appHtml,
  })
}

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild
const useYarn = false

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const isInteractive = process.stdout.isTTY

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

const argv = process.argv.slice(2)
const writeStatsJson = argv.indexOf('--stats') !== -1

// Generate configuration
const config = configFactory('production')

// Create the production build and print the deployment instructions.
const build = (
  previousFileSizes: FileSizeReporter.OpaqueFileSizes
): Promise<{
  stats: webpack.Stats
  previousFileSizes: FileSizeReporter.OpaqueFileSizes
  warnings: string[]
}> => {
  console.log('Creating an optimized production build...')

  const compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages
      if (err) {
        if (!err.message) {
          return reject(err)
        }

        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        })
      } else if (!stats) {
        return reject(new Error('stats is undefined, but expected webpack.Stats object'))
      } else {
        messages = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }))
      }

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        // Ignore sourcemap warnings in CI builds. See #8227 for more info.
        const filteredWarnings = messages.warnings.filter(w => !/Failed to parse source map/.test(w))
        if (filteredWarnings.length) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            )
          )
          return reject(new Error(filteredWarnings.join('\n\n')))
        }
      }
      if (!stats) {
        return reject(new Error('stats is undefined, but expected webpack.Stats object'))
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      }

      if (writeStatsJson) {
        return bfj
          .write(`${paths.appBuild}/bundle-stats.json`, stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(reject)
      }

      return resolve(resolveArgs)
    })
  })
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper')

checkBrowsers(paths.appPath, isInteractive)
  .then(() =>
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuild)
  )
  .then((previousFileSizes: FileSizeReporter.OpaqueFileSizes) => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    if (fs.existsSync(paths.appBuild)) {
      fs.readdirSync(paths.appBuild).forEach(item =>
        fs.rmSync(path.join(paths.appBuild, item), { force: true, recursive: true })
      )
    } else {
      fs.mkdirSync(paths.appBuild)
    }
    // Merge with the public folder
    copyPublicFolder()
    // Start the webpack build
    return build(previousFileSizes)
  })
  .then(
    ({
      stats,
      previousFileSizes,
      warnings,
    }: {
      stats: webpack.Stats
      previousFileSizes: FileSizeReporter.OpaqueFileSizes
      warnings: string[]
    }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'))
        console.log(warnings.join('\n\n'))
        console.log(`\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`)
        console.log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`)
      } else {
        console.log(chalk.green('Compiled successfully.\n'))
      }

      console.log('File sizes after gzip:\n')
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      )
      console.log()

      const appPackage = require(paths.appPackageJson)
      const publicUrl = paths.publicUrlOrPath
      const publicPath = config.output?.publicPath?.toString() ?? '(public path not available)'
      const buildFolder = path.relative(process.cwd(), paths.appBuild)
      printHostingInstructions(appPackage, publicUrl, publicPath, buildFolder, useYarn)
    },
    (err: Error) => {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
          )
        )
        printBuildError(err)
      } else {
        console.log(chalk.red('Failed to compile.\n'))
        printBuildError(err)
        process.exit(1)
      }
    }
  )
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.log(err.message)
    }
    process.exit(1)
  })
