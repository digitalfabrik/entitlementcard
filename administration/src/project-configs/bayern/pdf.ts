import { Temporal } from 'temporal-polyfill'

import { BavariaCardType } from '../../generated/card_pb'
import { formatDateDefaultGerman, plainDateFromDaysSinceEpoch } from '../../util/date'
import type { InfoParams } from '../index'

export const renderPdfInfo = ({ info, region }: InfoParams): string => {
  const expirationDay = info.expirationDay ?? 0
  const cardType = info.extensions?.extensionBavariaCardType?.cardType

  return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${
    expirationDay > 0
      ? formatDateDefaultGerman(plainDateFromDaysSinceEpoch(expirationDay))
      : 'unbegrenzt'
  }
Ausgestellt am ${formatDateDefaultGerman(Temporal.Now.plainDateISO())}
${region ? `von ${region.prefix} ${region.name}` : ''}`
}

export const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash
