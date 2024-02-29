import {
  BAYERN_PRODUCTION_ID,
  BAYERN_STAGING_ID,
  BuildConfigType,
  NUERNBERG_PRODUCTION_ID,
  NUERNBERG_STAGING_ID,
  buildConfigBayern,
  buildConfigNuernberg,
} from 'build-configs'

export const getBuildConfig = (hostname: string): BuildConfigType => {
  switch (hostname) {
    case BAYERN_PRODUCTION_ID:
    case BAYERN_STAGING_ID:
      return buildConfigBayern
    case NUERNBERG_PRODUCTION_ID:
    case NUERNBERG_STAGING_ID:
      return buildConfigNuernberg
    default:
      console.debug('Falling back to showcase.')
      return buildConfigBayern
  }
}
