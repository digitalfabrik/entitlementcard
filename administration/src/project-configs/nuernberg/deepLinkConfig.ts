import { APP_STORE_TEAM_ID, buildConfigNuernberg } from 'build-configs'

import { DeeplLinkingConfig } from '../getDeeplinkingConfigs'

const deepLinkConfig: DeeplLinkingConfig = {
  android: {
    applicationId: buildConfigNuernberg.android.applicationId,
    sha256CertFingerprint:
      'BC:46:1D:87:A8:DC:3F:39:0E:68:D6:4A:D7:39:43:BD:24:98:5B:76:D6:7E:96:2E:C2:03:AE:E3:35:42:3D:2D',
  },
  ios: {
    appleAppSiteAssociationAppIds: [`${APP_STORE_TEAM_ID}.${buildConfigNuernberg.ios.bundleIdentifier}`],
    paths: [`${buildConfigNuernberg.common.activationPath}/*`],
  },
  projectName: 'nuernberg',
}
export default deepLinkConfig
