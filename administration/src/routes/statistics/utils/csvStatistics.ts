import { stringify } from 'csv-stringify/browser/esm/sync'
import i18next from 'i18next'
import { Intl, Temporal } from 'temporal-polyfill'

import { CardStatisticsResultModel, Region } from '../../../generated/graphql'
import { CardStatistics } from '../../../project-configs/getProjectConfig'
import { CSV_MIME_TYPE_UTF8 } from '../../applications/constants'

export class CsvStatisticsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CSVStatisticsError'
  }
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' })

export const csvFileName = (
  dateStart: Temporal.PlainDate,
  dateEnd: Temporal.PlainDate,
  region?: Region,
): string => {
  const regionPrefix = region ? `${region.prefix}${region.name}_` : ''
  const dateSuffix = (
    Temporal.PlainDate.compare(dateStart, dateEnd) !== 0
      ? `${dateFormatter.format(dateStart)}_${dateFormatter.format(dateEnd)}`
      : dateFormatter.format(dateStart)
  ).replaceAll('.', '_')
  return `${regionPrefix}CardStatistics_${dateSuffix}.csv`
}

export const generateCsv = (
  statistics: CardStatisticsResultModel[],
  cardStatistics: CardStatistics,
): Blob => {
  if (!cardStatistics.enabled) {
    throw new CsvStatisticsError('CSV statistic export is disabled for this project')
  }
  if (statistics.length === 0) {
    throw new CsvStatisticsError('There is no data available to create a csv file')
  }
  const header = Object.keys(statistics[0]).map(it => i18next.t(`statistics:${it}`))
  let csvContent = stringify([header])
  try {
    statistics.forEach(element => {
      csvContent += stringify([Object.values(element)])
    })
    return new Blob([csvContent], { type: CSV_MIME_TYPE_UTF8 })
  } catch (error) {
    if (error instanceof Error) {
      throw new CsvStatisticsError(error.message)
    }
    throw error
  }
}
