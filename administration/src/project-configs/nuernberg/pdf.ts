import { formatDateDefaultGerman, plainDateFromDaysSinceEpoch } from '../../util/date'
import type { InfoParams } from '../index'

export const renderPdfDetails = ({ info }: InfoParams): string => {
  if (info.expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Nürnberg')
  }

  const expirationDate = plainDateFromDaysSinceEpoch(info.expirationDay)
  const birthdayDate = plainDateFromDaysSinceEpoch(
    info.extensions?.extensionBirthday?.birthday ?? 0,
  )
  const startDate = plainDateFromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)

  return `${info.fullName}
Pass-ID: ${info.extensions?.extensionNuernbergPassId?.passId ?? ''}
Geburtsdatum: ${formatDateDefaultGerman(birthdayDate)}
Gültig: ${formatDateDefaultGerman(startDate)} bis ${formatDateDefaultGerman(expirationDate)}`
}

export const renderPassId = ({ info }: InfoParams): string =>
  info.extensions?.extensionNuernbergPassId?.passId?.toString() ?? ''

export const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash
