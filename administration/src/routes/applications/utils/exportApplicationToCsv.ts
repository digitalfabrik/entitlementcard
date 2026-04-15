import { stringify } from 'csv-stringify/browser/esm/sync'
import { Temporal } from 'temporal-polyfill'

import { ProjectConfig } from '../../../project-configs'
import i18next from '../../../translations/i18n'
import downloadDataUri from '../../../util/downloadDataUri'
import { CSV_MIME_TYPE_UTF8 } from '../constants'
import type { Application } from '../types/types'
import {
  AddressApplicationData,
  ApplicationDataIncompleteError,
  CardTypeApplicationData,
  CreationDateApplicationData,
  PersonalApplicationData,
  getAddressApplicationData,
  getCardTypeApplicationData,
  getPersonalApplicationData,
} from './applicationDataHelper'

export type CSVApplicationData = PersonalApplicationData &
  AddressApplicationData &
  CardTypeApplicationData &
  CreationDateApplicationData

export class ApplicationToCsvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApplicationToCsvError'
  }
}

/**
 * TODO If this function is to be called in a loop, refactor it to take the date formatter as an
 *   argument.
 */
export const exportApplicationToCsv = (
  application: Pick<Application, 'jsonValue' | 'createdDate'>,
  config: ProjectConfig,
): void => {
  try {
    if (!config.applicationFeature?.csvExport) {
      throw new ApplicationToCsvError('This project does not support application CSV export.')
    }
    const csvData: CSVApplicationData = {
      ...getPersonalApplicationData(application.jsonValue),
      ...getAddressApplicationData(application.jsonValue),
      ...getCardTypeApplicationData(application.jsonValue),
      // TODO Remove the hardcoded locale with either a setting or export ISO dates
      //  (also applies to other dates in this export)
      creationDate: Temporal.Instant.from(application.createdDate).toLocaleString('de-DE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    }

    const csvHeader = Object.keys(csvData).map(key => i18next.t(`application:${key}`))
    const csvContent = Object.values(csvData)
    const csv = stringify([csvHeader]) + stringify([csvContent])

    const blob = new Blob([csv], { type: CSV_MIME_TYPE_UTF8 })
    const { surname, forenames, creationDate } = csvData
    downloadDataUri(blob, `${surname}_${forenames}_${creationDate}.csv`)
  } catch (error) {
    if (error instanceof ApplicationToCsvError) {
      throw new ApplicationToCsvError(i18next.t('errors:applicationToCsvError'))
    } else if (error instanceof ApplicationDataIncompleteError) {
      throw new ApplicationDataIncompleteError(
        i18next.t('errors:applicationDataIncompleteException'),
      )
    } else {
      console.error(error)
    }
  }
}
