import { buildConfigBayern, buildConfigNuernberg } from 'build-configs/dist/index'
import BuildConfigType from 'build-configs/dist/types'

const getBuildConfig = (hostname: string): BuildConfigType => {
  switch (window.localStorage.getItem('project-override') ?? hostname) {
    case 'BAYERN_PRODUCTION_ID':
    case 'BAYERN_STAGING_ID':
      return buildConfigBayern
    case 'NUERNBERG_PRODUCTION_ID':
    case 'NUERNBERG_STAGING_ID':
      return buildConfigNuernberg
    default:
      console.debug('Falling back to bayern.')
      return buildConfigBayern
  }
}
export default getBuildConfig
