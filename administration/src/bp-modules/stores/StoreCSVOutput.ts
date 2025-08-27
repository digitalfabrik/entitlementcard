import { stringify } from 'csv-stringify/browser/esm/sync'

import { CsvAcceptingStoreInput } from '../../generated/graphql'
import { CSV_MIME_TYPE_UTF8 } from '../applications/constants'

export class StoreCSVOutputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StoreCSVOutputError'
  }
}

export const generateCsv = (storeData: CsvAcceptingStoreInput[]): Blob => {
  if (storeData.length === 0) {
    throw new StoreCSVOutputError('There is no data available to create a csv file')
  }
  const header = Object.keys(storeData[0])
  let csvContent = stringify([header])
  try {
    storeData.forEach(element => {
      csvContent += stringify([Object.values(element)])
    })
    return new Blob([csvContent], { type: CSV_MIME_TYPE_UTF8 })
  } catch (error) {
    if (error instanceof Error) {
      throw new StoreCSVOutputError(error.message)
    }
    throw error
  }
}
