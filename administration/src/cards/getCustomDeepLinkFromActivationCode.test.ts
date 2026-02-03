import {
  ACTIVATION_FRAGMENT,
  ACTIVATION_PATH,
  buildConfigBayern,
  buildConfigKoblenz,
} from 'build-configs'

import getCustomDeepLinkFromActivationCode from './getCustomDeepLinkFromActivationCode'

describe('Custom scheme deepLink generation', () => {
  const activationCodeFromUrl = '#ChsKGQoJVGhlYSBUZXN0ENOiARoICgIIACICCAA%3D'
  const buildConfigs = [{ buildConfig: buildConfigBayern }, { buildConfig: buildConfigKoblenz }]

  it.each(buildConfigs)(
    'should generate a correct link for $buildConfig.common.projectId.production',
    ({ buildConfig }) => {
      const { projectId, deepLinking } = buildConfig.common
      const { production: host } = projectId
      const { customScheme } = deepLinking
      expect(getCustomDeepLinkFromActivationCode(activationCodeFromUrl, buildConfig)).toBe(
        `${customScheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCodeFromUrl}`,
      )
    },
  )
})
