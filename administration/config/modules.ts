// This file originally stems from a CRA-eject.
import chalk from 'chalk'
import path from 'path'
import typescript from 'typescript'

import getPaths from './getPaths'

/**
 * Get additional module paths based on the baseUrl of a compilerOptions object.
 */
const getAdditionalModulePaths = (paths: ReturnType<typeof getPaths>, options: { baseUrl?: string } = {}) => {
  const baseUrl = options.baseUrl

  if (!baseUrl) {
    return ''
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl)

  // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
  // the default behavior.
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null
  }

  // Allow the user set the `baseUrl` to `appSrc`.
  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc]
  }

  // If the path is equal to the root directory we ignore it here.
  // We don't want to allow importing from the root directly as source files are
  // not transpiled outside of `src`. We do allow importing them with the
  // absolute path (e.g. `src/Components/Button.js`) but we set that up with
  // an alias.
  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return null
  }

  // Otherwise, throw an error.
  throw new Error(
    chalk.red.bold(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
        ' Create React App does not support other values at this time.'
    )
  )
}

/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 */
const getWebpackAliases = (paths: ReturnType<typeof getPaths>, options: { baseUrl?: string } = {}) => {
  const baseUrl = options.baseUrl

  if (!baseUrl) {
    return {}
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl)

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      src: paths.appSrc,
    }
  }
  return {}
}

const getModules = () => {
  const paths = getPaths()
  // Set up the config based on tsconfig.json

  const config = typescript.readConfigFile(paths.appTsConfig, typescript.sys.readFile).config

  const options = config.compilerOptions ?? {}

  const additionalModulePaths = getAdditionalModulePaths(options)

  return {
    additionalModulePaths,
    webpackAliases: getWebpackAliases(options),
    jestAliases: {},
    hasTsConfig: true,
  }
}

export default getModules()
