import { formatDateDefaultGerman, plainDateFromDaysSinceEpoch } from '../../util/date'
import type { InfoParams } from '../index'

export const renderPdfDetails = ({ info }: InfoParams): string => {
  if (info.expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Koblenz')
  }
  const expirationDate = plainDateFromDaysSinceEpoch(info.expirationDay)
  const birthdayDate = plainDateFromDaysSinceEpoch(
    info.extensions?.extensionBirthday?.birthday ?? 0,
  )
  const startDate = plainDateFromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)

  return `${formatDateDefaultGerman(startDate)} - ${formatDateDefaultGerman(expirationDate)}
${formatDateDefaultGerman(birthdayDate)}
${info.fullName}`
}
