import { DeepLinkingConfig, buildConfigBayern, buildConfigNuernberg } from 'build-configs'

const getDeepLinkingConfigs = (): DeepLinkingConfig[] => {
  return [buildConfigBayern.common.deepLinking, buildConfigNuernberg.common.deepLinking]
}

export default getDeepLinkingConfigs
