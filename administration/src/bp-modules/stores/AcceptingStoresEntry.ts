import { FIELD_LATITUDE, FIELD_LONGITUDE } from '../../project-configs/constants'
import { StoresFieldConfig } from '../../project-configs/getProjectConfig'
import { isCoordinate } from '../../project-configs/helper/storeFieldValidation'
import type { StoresData } from './StoresImportController'

export class AcceptingStoresEntry {
  data: StoresData
  fields: StoresFieldConfig[]

  constructor(data: StoresData, fields: StoresFieldConfig[]) {
    this.data = data
    this.fields = fields
  }
  isValid(): boolean {
    return this.fields.every(field => field.isValid(this.data[field.name]))
  }

  hasValidCoordinates(): boolean {
    return isCoordinate(this.data[FIELD_LONGITUDE]) && isCoordinate(this.data[FIELD_LATITUDE])
  }

  hasEmptyCoordinates(): boolean {
    return this.data[FIELD_LONGITUDE].length === 0 && this.data[FIELD_LATITUDE].length === 0
  }
}
