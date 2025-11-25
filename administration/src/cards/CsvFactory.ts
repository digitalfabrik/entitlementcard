import { stringify } from 'csv-stringify/browser/esm/sync'

import { ProjectConfig } from '../project-configs/getProjectConfig'
import { CSV_MIME_TYPE_UTF8 } from '../routes/applications/constants'
import { Card } from './Card'
import { CreateCardsResult } from './createCards'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from './extensions/NuernbergPassIdExtension'

export class CsvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CSVError'
  }
}

export const generateCsv = (codes: CreateCardsResult[], cards: Card[], projectConfig: ProjectConfig): Blob => {
  const csvConfig = projectConfig.csvExport
  if (!csvConfig.enabled) {
    throw new CsvError('CSV Export is disabled for this project')
  }
  try {
    let csvContent = stringify([csvConfig.csvHeader])
    for (let k = 0; k < codes.length; k++) {
      csvContent += csvConfig.buildCsvLine(codes[k], cards[k])
    }
    return new Blob([csvContent], { type: CSV_MIME_TYPE_UTF8 })
  } catch (error) {
    if (error instanceof Error) {
      throw new CsvError(error.message)
    }
    throw error
  }
}

export const getCSVFilename = (cards: Card[]): string => {
  const filename = cards.length === 1 ? cards[0].extensions[NUERNBERG_PASS_ID_EXTENSION_NAME] : 'SozialpassMassExport'
  return `${filename}.csv`
}
