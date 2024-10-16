import { ACTIVATION_FRAGMENT, ACTIVATION_PATH } from 'build-configs'

import { getBuildConfig } from './getBuildConfig'

const getCustomSchemeDeepLinkFromCode = (activationCode: string): string => {
  const { deepLinking, projectId } = getBuildConfig(window.location.hostname).common
  const { production: host } = projectId
  const { customScheme } = deepLinking
  return `${customScheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCode}`
}
export default getCustomSchemeDeepLinkFromCode
