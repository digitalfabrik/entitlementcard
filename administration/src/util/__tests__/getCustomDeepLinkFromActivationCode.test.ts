import { ACTIVATION_FRAGMENT, ACTIVATION_PATH, BAYERN_STAGING_ID, CUSTOM_SCHEME } from 'build-configs'

import { LOCAL_STORAGE_PROJECT_KEY } from '../../project-configs/constants'
import { getBuildConfig } from '../getBuildConfig'
import getCustomDeepLinkFromActivationCode from '../getCustomDeepLinkFromActivationCode'

describe('Custom scheme deepLink generation', () => {
  const activationCodeFromUrl = '#ChsKGQoJVGhlYSBUZXN0ENOiARoICgIIACICCAA%3D'

  it('should generate a correct link', () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, BAYERN_STAGING_ID)
    const projectId = getBuildConfig(window.location.hostname).common.projectId.production
    expect(getCustomDeepLinkFromActivationCode(activationCodeFromUrl)).toBe(
      `${CUSTOM_SCHEME}://${projectId}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCodeFromUrl}`
    )
  })
})
