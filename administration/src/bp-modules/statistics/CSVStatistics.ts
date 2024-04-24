import { stringify } from 'csv-stringify/browser/esm/sync'

import { CardStatisticsResultModel, Region } from '../../generated/graphql'

export class CsvStatisticsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CSVStatisticsError'
  }
}

export const getCsvFileName = (date: string, region?: Region): string =>
  region ? `${region.prefix}${region.name}_CardStatistics_${date}.csv` : `CardStatistics_${date}.csv`

export const generateCsv = (statistics: CardStatisticsResultModel[]): Blob => {
  const header = Object.keys(statistics[0])
  let csvContent = stringify([header])
  try {
    statistics.forEach(
      element => (csvContent += stringify([[element.region, element.cardsCreated, element.cardsActivated]]))
    )
    return new Blob([csvContent])
  } catch (error) {
    if (error instanceof Error) throw new CsvStatisticsError(error.message)
    throw error
  }
}
