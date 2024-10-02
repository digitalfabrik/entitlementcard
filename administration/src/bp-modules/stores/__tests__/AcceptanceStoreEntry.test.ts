import { LOCAL_STORAGE_PROJECT_KEY } from '../../../project-configs/constants'
import koblenzConfig from '../../../project-configs/koblenz/config'
import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { AcceptingStoreEntry } from '../AcceptingStoreEntry'
import { invalidStoreData, validStoreData } from '../__mock__/mockStoreEntry'

describe('AcceptanceStoreEntry', () => {
  it.each([{ projectConfig: nuernbergConfig }, { projectConfig: koblenzConfig }])(
    `should be validated false store invalid entries for $projectConfig.name`,
    ({ projectConfig }) => {
      localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, projectConfig.projectId)
      const fields = projectConfig.storeManagement.enabled ? projectConfig.storeManagement.fields : []
      const store = new AcceptingStoreEntry(invalidStoreData, fields)
      expect(store.isValid()).toBeFalsy()
    }
  )

  it.each([{ projectConfig: nuernbergConfig }, { projectConfig: koblenzConfig }])(
    'should be validated true store valid entries $projectConfig.name',
    ({ projectConfig }) => {
      localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, projectConfig.projectId)
      const fields = projectConfig.storeManagement.enabled ? projectConfig.storeManagement.fields : []
      const store = new AcceptingStoreEntry(validStoreData, fields)
      expect(store.isValid()).toBeTruthy()
    }
  )
})
