import { stringify } from 'csv-stringify/browser/esm/sync'

import { CsvExport } from '../project-configs/getProjectConfig'
import { CardBlueprint } from './CardBlueprint'
import { CreateCardsResult } from './createCards'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from './extensions/NuernbergPassIdExtension'

export class CsvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CSVError'
  }
}

export const generateCsv = (
  codes: CreateCardsResult[],
  cardBlueprints: CardBlueprint[],
  csvProjectConfig: CsvExport
): Blob => {
  if (!csvProjectConfig.enabled) {
    throw new CsvError('CSV Export is disabled for this project')
  }
  try {
    let csvContent = stringify([csvProjectConfig.csvHeader])
    for (let k = 0; k < codes.length; k++) {
      csvContent += csvProjectConfig.buildCsvLine(codes[k], cardBlueprints[k])
    }
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  } catch (error) {
    if (error instanceof Error) {
      throw new CsvError(error.message)
    }
    throw error
  }
}

export const getCSVFilename = (cardBlueprints: CardBlueprint[]): string => {
  const filename =
    cardBlueprints.length === 1
      ? cardBlueprints[0].extensions[NUERNBERG_PASS_ID_EXTENSION_NAME]
      : 'SozialpassMassExport'
  return `${filename}.csv`
}
