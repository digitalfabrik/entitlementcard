import { ACTIVATION_FRAGMENT, ACTIVATION_PATH } from 'build-configs'

import bayernConfig from '../../project-configs/bayern/config'
import { LOCAL_STORAGE_PROJECT_KEY } from '../../project-configs/constants'
import koblenzConfig from '../../project-configs/koblenz/config'
import { getBuildConfig } from '../getBuildConfig'
import getCustomDeepLinkFromActivationCode from '../getCustomDeepLinkFromActivationCode'

describe('Custom scheme deepLink generation', () => {
  const activationCodeFromUrl = '#ChsKGQoJVGhlYSBUZXN0ENOiARoICgIIACICCAA%3D'
  const projectConfigsWithCustomSchemes = [{ projectConfig: bayernConfig }, { projectConfig: koblenzConfig }]
  it.each(projectConfigsWithCustomSchemes)(
    'should generate a correct link for $projectConfig.name',
    ({ projectConfig }) => {
      localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, projectConfig.projectId)
      const { projectId, deepLinking } = getBuildConfig(window.location.hostname).common
      const { production: host } = projectId
      const { customScheme } = deepLinking
      expect(getCustomDeepLinkFromActivationCode(activationCodeFromUrl)).toBe(
        `${customScheme}://${host}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCodeFromUrl}`
      )
    }
  )
})
