import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, BuildConfigType } from 'build-configs'

const getCustomSchemeDeepLinkFromCode = (activationCode: string, buildConfig: BuildConfigType): string => {
  const { deepLinking, projectId } = buildConfig.common
  const { production: host } = projectId
  const { customScheme } = deepLinking
  return `${customScheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCode}`
}
export default getCustomSchemeDeepLinkFromCode
