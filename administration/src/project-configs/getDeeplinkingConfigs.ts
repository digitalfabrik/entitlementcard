import { DeeplLinkingConfig, buildConfigBayern, buildConfigNuernberg } from 'build-configs'

const getDeepLinkingConfigs = (): DeeplLinkingConfig[] => [
  buildConfigBayern.common.deepLinking,
  buildConfigNuernberg.common.deepLinking,
]

export default getDeepLinkingConfigs
