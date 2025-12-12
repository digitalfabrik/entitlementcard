import {
  DeeplLinkingConfig,
  buildConfigBayern,
  buildConfigKoblenz,
  buildConfigNuernberg,
} from 'build-configs'

const getDeepLinkingConfigs = (): DeeplLinkingConfig[] => [
  buildConfigBayern.common.deepLinking,
  buildConfigNuernberg.common.deepLinking,
  buildConfigKoblenz.common.deepLinking,
]

export default getDeepLinkingConfigs
