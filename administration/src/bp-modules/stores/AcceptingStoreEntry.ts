import { StoreFieldConfig } from '../../project-configs/getProjectConfig'
import { isCoordinate } from '../../project-configs/helper/storeFieldValidation'
import { FIELD_LATITUDE, FIELD_LONGITUDE } from '../../project-configs/nuernberg/storeConfig'
import { StoreData } from './StoresImportController'

export class AcceptingStoreEntry {
  data: StoreData
  fields: StoreFieldConfig[]

  constructor(data: StoreData, fields: StoreFieldConfig[]) {
    this.data = data
    this.fields = fields
  }
  isValid(): boolean {
    return this.fields.every(field => field.isValid(this.data[field.name]))
  }

  hasValidCoordinates(): boolean {
    return isCoordinate(this.data[FIELD_LONGITUDE]) && isCoordinate(this.data[FIELD_LATITUDE])
  }
}
