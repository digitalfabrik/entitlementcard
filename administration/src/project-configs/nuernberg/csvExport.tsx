import { stringify } from 'csv-stringify/browser/esm/sync'

import CardBlueprint from '../../cards/CardBlueprint'
import { CreateCardsResult } from '../../cards/createCards'
import AddressExtensions from '../../cards/extensions/AddressFieldExtensions'
import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import NuernbergPassIdExtension from '../../cards/extensions/NuernbergPassIdExtension'
import StartDayExtension from '../../cards/extensions/StartDayExtension'
import { findExtension } from '../../cards/extensions/extensions'
import { QrCode } from '../../generated/card_pb'
import { convertProtobufToHexCode } from '../../util/qrcode'

export const buildCsvLine = (createCardsResult: CreateCardsResult, cardBlueprint: CardBlueprint): string => {
  const [addressLine1, addressLine2, plz, location] = AddressExtensions.map(ext =>
    findExtension(cardBlueprint.extensions, ext)
  )
  const passId = findExtension(cardBlueprint.extensions, NuernbergPassIdExtension)?.state?.passId
  const birthday = findExtension(cardBlueprint.extensions, BirthdayExtension)?.toString()
  const startDay = findExtension(cardBlueprint.extensions, StartDayExtension)?.toString()
  const activationHex = convertProtobufToHexCode(
    new QrCode({
      qrCode: {
        case: 'dynamicActivationCode',
        value: createCardsResult.dynamicActivationCode,
      },
    })
  )
  const staticVerificationHex = createCardsResult.staticVerificationCode
    ? convertProtobufToHexCode(
        new QrCode({
          qrCode: {
            case: 'staticVerificationCode',
            value: createCardsResult.staticVerificationCode,
          },
        })
      )
    : ''

  return stringify([
    [
      cardBlueprint.fullName,
      addressLine1?.state,
      addressLine2?.state,
      `${plz} ${location}`,
      passId,
      birthday,
      startDay,
      cardBlueprint.expirationDate?.format(),
      createCardsResult.staticCardInfoHashBase64,
      activationHex,
      staticVerificationHex,
    ],
  ])
}
