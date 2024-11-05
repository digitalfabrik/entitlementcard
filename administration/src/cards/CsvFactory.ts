import { stringify } from 'csv-stringify/browser/esm/sync'

import { CsvExport } from '../project-configs/getProjectConfig'
import { Card } from './Card'
import { CreateCardsResult } from './createCards'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from './extensions/NuernbergPassIdExtension'

export class CsvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CSVError'
  }
}

export const generateCsv = (codes: CreateCardsResult[], cards: Card[], csvProjectConfig: CsvExport): Blob => {
  if (!csvProjectConfig.enabled) {
    throw new CsvError('CSV Export is disabled for this project')
  }
  try {
    let csvContent = stringify([csvProjectConfig.csvHeader])
    for (let k = 0; k < codes.length; k++) {
      csvContent += csvProjectConfig.buildCsvLine(codes[k], cards[k])
    }
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
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
