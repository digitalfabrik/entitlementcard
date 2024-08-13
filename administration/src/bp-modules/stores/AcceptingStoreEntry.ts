import { CsvAcceptingStoreInput } from '../../generated/graphql'
import { StoreFieldConfig } from '../../project-configs/getProjectConfig'

export class AcceptingStoreEntry {
  data: CsvAcceptingStoreInput
  fields: StoreFieldConfig[]

  constructor(data: CsvAcceptingStoreInput, fields: StoreFieldConfig[]) {
    this.data = data
    this.fields = fields
  }

  // TODO add proper checks

  // improve mandatoryFields checking
  allMandatoryFieldsHaveValues(): boolean {
    // @ts-expect-error GraphQL interface problem
    return this.fields.every(field => !(this.data[field.name]!.length === 0 && field.mandatory))
  }

  coordinateIsValid(coordinate?: string): boolean {
    if (!coordinate) {
      return false
    }

    return !isNaN(parseFloat(coordinate))
  }
  isValid() {
    return this.allMandatoryFieldsHaveValues()
  }

  isValueValid(key: string): boolean {
    switch (key) {
      case 'latitude':
        return this.coordinateIsValid(this.data.latitude!)
        break
      case 'longitude':
        return this.coordinateIsValid(this.data.longitude!)
        break
      default:
        return true
    }
  }
}
