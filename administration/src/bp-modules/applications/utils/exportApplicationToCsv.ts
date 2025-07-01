import { stringify } from 'csv-stringify/browser/esm/sync'

import i18next from '../../../i18n'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import {
  CSVApplicationData,
  getAddressApplicationData,
  getCardTypeApplicationData,
  getPersonalApplicationData,
} from '../../../util/applicationDataHelper'
import downloadDataUri from '../../../util/downloadDataUri'
import formatDateWithTimezone from '../../../util/formatDate'
import type { JsonField } from '../JsonFieldView'
import { CSV_MIME_TYPE_UTF8 } from '../constants'
import { GetApplicationsType } from '../types'

// TODO add unit tests, TODO add error handling
export const exportApplicationToCsv = (application: GetApplicationsType, config: ProjectConfig): void => {
  if (!config.applicationFeature?.csvExport) {
    throw Error('CSV export not enabled')
  }
  const json: JsonField<'Array'> = JSON.parse(application.jsonValue)

  const csvData: CSVApplicationData = {
    ...getPersonalApplicationData(json),
    ...getAddressApplicationData(json),
    ...getCardTypeApplicationData(json),
    ...{ creationDate: formatDateWithTimezone(application.createdDate, config.timezone) },
  }

  const csvHeader = Object.keys(csvData).map(key => i18next.t(`application:${key}`))
  const csvContent = Object.values(csvData)
  const csv = stringify([csvHeader]) + stringify([csvContent])

  try {
    const blob = new Blob([csv], { type: CSV_MIME_TYPE_UTF8 })
    const { surname, forenames, creationDate } = csvData
    downloadDataUri(blob, `${surname}_${forenames}_${creationDate}.csv`)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error()
    }
    throw error
  }
}
