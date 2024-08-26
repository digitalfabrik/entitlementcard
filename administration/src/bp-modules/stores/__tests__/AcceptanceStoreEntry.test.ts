import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { AcceptingStoreEntry } from '../AcceptingStoreEntry'
import { invalidStoreData, validStoreData } from '../__mock__/mockStoreEntry'

jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: jest.fn(),
}))
const fields = nuernbergConfig.storeManagement.enabled ? nuernbergConfig.storeManagement.fields : []
describe('AcceptanceStoreEntry', () => {
  it('should be validated false store invalid entries', () => {
    const store = new AcceptingStoreEntry(invalidStoreData, fields)
    expect(store.isValid()).toBeFalsy()
  })

  it('should be validated true store valid entries', () => {
    const store = new AcceptingStoreEntry(validStoreData, fields)
    expect(store.isValid()).toBeTruthy()
  })
})
