import { stringify } from 'csv-stringify/browser/esm/sync'

import { Card } from '../../cards/card'
import { CreateCardsResult } from '../../cards/createCards'
import { getAddressFieldExtensionsValues } from '../../cards/extensions/AddressFieldExtensions'
import { BIRTHDAY_EXTENSION_NAME } from '../../cards/extensions/BirthdayExtension'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from '../../cards/extensions/NuernbergPassIdExtension'
import { START_DAY_EXTENSION_NAME } from '../../cards/extensions/StartDayExtension'
import { QrCode } from '../../generated/card_pb'
import { convertProtobufToHexCode } from '../../util/qrcode'

export const buildCsvLine = (createCardsResult: CreateCardsResult, card: Card): string => {
  const [addressLine1, addressLine2, plz, location] = getAddressFieldExtensionsValues(card)
  const passId = card.extensions[NUERNBERG_PASS_ID_EXTENSION_NAME]
  const birthday = card.extensions[BIRTHDAY_EXTENSION_NAME]?.format()
  const startDay = card.extensions[START_DAY_EXTENSION_NAME]?.format()

  const activationHex = convertProtobufToHexCode(
    new QrCode({
      qrCode: {
        case: 'dynamicActivationCode',
        value: createCardsResult.dynamicActivationCode,
      },
    }),
  )
  const staticVerificationHex = createCardsResult.staticVerificationCode
    ? convertProtobufToHexCode(
        new QrCode({
          qrCode: {
            case: 'staticVerificationCode',
            value: createCardsResult.staticVerificationCode,
          },
        }),
      )
    : ''

  return stringify([
    [
      card.fullName,
      addressLine1,
      addressLine2,
      `${plz} ${location}`,
      passId,
      birthday,
      startDay,
      card.expirationDate?.format(),
      createCardsResult.staticCardInfoHashBase64,
      activationHex,
      staticVerificationHex,
    ],
  ])
}
