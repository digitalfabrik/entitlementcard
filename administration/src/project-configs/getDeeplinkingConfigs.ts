import { buildConfigBayern, buildConfigNuernberg, DeeplLinkingConfig } from 'build-configs'

const getDeepLinkingConfigs = (): DeeplLinkingConfig[] => {
  return [buildConfigBayern.common.deepLinking, buildConfigNuernberg.common.deepLinking]
}

export default getDeepLinkingConfigs
