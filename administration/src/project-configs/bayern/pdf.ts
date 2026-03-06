import { BavariaCardType } from '../../generated/card_pb'
import PlainDate from '../../util/PlainDate'
import type { InfoParams } from '../index'

export const renderPdfInfo = ({ info, region }: InfoParams): string => {
  const expirationDay = info.expirationDay ?? 0
  const expirationDate =
    expirationDay > 0 ? PlainDate.fromDaysSinceEpoch(expirationDay).format() : 'unbegrenzt'
  const cardType = info.extensions?.extensionBavariaCardType?.cardType

  return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${expirationDate}
Ausgestellt am ${PlainDate.fromLocalDate(new Date()).format()} 
${region ? `von ${region.prefix} ${region.name}` : ''}`
}

export const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash
