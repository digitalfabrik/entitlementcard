import { config as koblenzConfig } from '../../../../project-configs/koblenz/config'
import { config } from '../../../../project-configs/nuernberg/config'
import { LOCAL_STORAGE_PROJECT_KEY } from '../../../../util/getBuildConfig'
import { invalidStoreData, validStoreData } from '../__mock__/mockStoreEntry'
import { AcceptingStoresEntry } from './acceptingStoresEntry'

describe('AcceptanceStoreEntry', () => {
  const projectConfigsWithStoreUpload = [
    { projectConfig: config },
    { projectConfig: koblenzConfig },
  ]
  it.each(projectConfigsWithStoreUpload)(
    `should mark entries invalid for $projectConfig.name, if validation fails`,
    ({ projectConfig }) => {
      localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, projectConfig.projectId)
      const fields = projectConfig.storesManagement.enabled
        ? projectConfig.storesManagement.fields
        : []
      const store = new AcceptingStoresEntry(invalidStoreData, fields)
      expect(store.isValid()).toBeFalsy()
    },
  )

  it.each(projectConfigsWithStoreUpload)(
    'should mark entries valid for $projectConfig.name, if validation succeeds',
    ({ projectConfig }) => {
      localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, projectConfig.projectId)
      const fields = projectConfig.storesManagement.enabled
        ? projectConfig.storesManagement.fields
        : []
      const store = new AcceptingStoresEntry(validStoreData, fields)
      expect(store.isValid()).toBeTruthy()
    },
  )
})
