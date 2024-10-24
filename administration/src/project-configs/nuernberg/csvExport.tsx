import { stringify } from 'csv-stringify/browser/esm/sync'

import { CardBlueprint } from '../../cards/Card'
import { CreateCardsResult } from '../../cards/createCards'
import { getAddressFieldExtensionsValues } from '../../cards/extensions/AddressFieldExtensions'
import { BIRTHDAY_EXTENSION_NAME } from '../../cards/extensions/BirthdayExtension'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from '../../cards/extensions/NuernbergPassIdExtension'
import { START_DAY_EXTENSION_NAME } from '../../cards/extensions/StartDayExtension'
import { QrCode } from '../../generated/card_pb'
import { convertProtobufToHexCode } from '../../util/qrcode'

export const buildCsvLine = (createCardsResult: CreateCardsResult, cardBlueprint: CardBlueprint): string => {
  const [addressLine1, addressLine2, plz, location] = getAddressFieldExtensionsValues(cardBlueprint)
  const passId = cardBlueprint.extensions[NUERNBERG_PASS_ID_EXTENSION_NAME]
  const birthday = cardBlueprint.extensions[BIRTHDAY_EXTENSION_NAME]?.format()
  const startDay = cardBlueprint.extensions[START_DAY_EXTENSION_NAME]?.format()

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
      addressLine1,
      addressLine2,
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
