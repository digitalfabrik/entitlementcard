import {
  BAYERN_PRODUCTION_ID,
  BAYERN_STAGING_ID,
  BuildConfigType,
  KOBLENZ_PRODUCTION_ID,
  KOBLENZ_STAGING_ID,
  NUERNBERG_PRODUCTION_ID,
  NUERNBERG_STAGING_ID,
  buildConfigBayern,
  buildConfigNuernberg,
} from 'build-configs'

import { LOCAL_STORAGE_PROJECT_KEY } from '../project-configs/constants'

export const getBuildConfig = (hostname: string): BuildConfigType => {
  switch (window.localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY) ?? hostname) {
    case BAYERN_PRODUCTION_ID:
    case BAYERN_STAGING_ID:
      return buildConfigBayern
    case NUERNBERG_PRODUCTION_ID:
    case NUERNBERG_STAGING_ID:
      return buildConfigNuernberg
    case KOBLENZ_PRODUCTION_ID:
    case KOBLENZ_STAGING_ID:
      // TODO 1647 Add correct buildConfig for koblenz
      return buildConfigNuernberg
    default:
      console.debug('Falling back to bayern.')
      return buildConfigBayern
  }
}
