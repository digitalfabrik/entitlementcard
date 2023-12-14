import { APP_STORE_TEAM_ID, buildConfigBayern } from 'build-configs'

import { DeeplLinkingConfig } from '../getDeeplinkingConfigs'

const deepLinkConfig: DeeplLinkingConfig = {
  android: {
    applicationId: buildConfigBayern.android.applicationId,
    sha256CertFingerprint:
      '9D:BE:FB:95:02:09:90:B6:8D:4E:06:BA:8A:35:8C:8A:AD:53:4E:98:60:DA:F3:07:B1:3F:E2:8A:24:5D:B2:8B',
  },
  ios: {
    appleAppSiteAssociationAppIds: [`${APP_STORE_TEAM_ID}.${buildConfigBayern.ios.bundleIdentifier}`],
    paths: [`${buildConfigBayern.common.activationPath}/*`],
  },
  projectName: 'bayern',
}
export default deepLinkConfig
