// This file originally stems from a CRA-eject.
import path from 'path'
import typescript from 'typescript'

import getPaths from './getPaths'

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

  return {
    webpackAliases: getWebpackAliases(options),
    jestAliases: {},
    hasTsConfig: true,
  }
}

export default getModules()
