import { Intl } from 'temporal-polyfill'

import { plainDateFromDaysSinceEpoch } from '../../util/date'
import type { InfoParams } from '../index'

export const renderPdfDetails = ({ info }: InfoParams): string => {
  // Use custom date formatters here, as we have strict format requirements
  const dateFormatterShort = new Intl.DateTimeFormat('de-DE', { dateStyle: 'short' })
  const dateFormatterMedium = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' })

  if (info.expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Nürnberg')
  }

  const birthdayDate =
    info.extensions?.extensionBirthday?.birthday !== undefined
      ? dateFormatterMedium.format(
          plainDateFromDaysSinceEpoch(info.extensions.extensionBirthday.birthday),
        )
      : ''
  const expirationDate = dateFormatterShort.format(plainDateFromDaysSinceEpoch(info.expirationDay))
  const startDate =
    info.extensions?.extensionStartDay?.startDay !== undefined
      ? dateFormatterShort.format(
          plainDateFromDaysSinceEpoch(info.extensions.extensionStartDay.startDay),
        )
      : ''

  return `${info.fullName}
Pass-ID: ${info.extensions?.extensionNuernbergPassId?.passId ?? ''}
Geburtsdatum: ${birthdayDate}
Gültig: ${startDate} bis ${expirationDate}`
}

export const renderPassId = ({ info }: InfoParams): string =>
  info.extensions?.extensionNuernbergPassId?.passId?.toString() ?? ''

export const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash
