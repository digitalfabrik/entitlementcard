import deepLinkConfigBayern from './bayern/deepLinkConfig'
import deepLinkConfigNuernberg from './nuernberg/deepLinkConfig'

export type DeeplLinkingConfig = {
  android: {
    applicationId: string
    sha256CertFingerprint: string
  }
  ios: {
    appleAppSiteAssociationAppIds: string[]
    paths: string[]
  }
  projectName: string
}

export const getDeeplinkingConfigs = (): DeeplLinkingConfig[] => {
  return [deepLinkConfigBayern, deepLinkConfigNuernberg]
}
