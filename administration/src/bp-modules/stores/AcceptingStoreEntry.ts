import { StoreFieldConfig } from '../../project-configs/getProjectConfig'
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
}
