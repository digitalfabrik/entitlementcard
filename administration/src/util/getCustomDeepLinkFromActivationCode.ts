import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, CUSTOM_SCHEME } from 'build-configs'

import { getBuildConfig } from './getBuildConfig'

const getCustomSchemeDeepLinkFromCode = (activationCode: string): string => {
  const host = getBuildConfig(window.location.hostname).common.projectId.production
  return `${CUSTOM_SCHEME}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCode}`
}
export default getCustomSchemeDeepLinkFromCode
