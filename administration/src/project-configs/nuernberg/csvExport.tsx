import { create } from '@bufbuild/protobuf'
import { stringify } from 'csv-stringify/browser/esm/sync'

import { Card } from '../../cards/card'
import { CreateCardsResult } from '../../cards/createCards'
import { getAddressFieldExtensionsValues } from '../../cards/extensions/AddressFieldExtensions'
import { BIRTHDAY_EXTENSION_NAME } from '../../cards/extensions/BirthdayExtension'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from '../../cards/extensions/NuernbergPassIdExtension'
import { START_DAY_EXTENSION_NAME } from '../../cards/extensions/StartDayExtension'
import { QrCodeSchema } from '../../generated/card_pb'
import { formatDateDefaultGerman } from '../../util/date'
import { convertProtobufToHexCode } from '../../util/qrcode'

export const buildCsvLine = (createCardsResult: CreateCardsResult, card: Card): string => {
  const [addressLine1, addressLine2, plz, location] = getAddressFieldExtensionsValues(card)
  const passId = card.extensions[NUERNBERG_PASS_ID_EXTENSION_NAME]
  const birthdayDate = card.extensions[BIRTHDAY_EXTENSION_NAME]
  const birthday = birthdayDate ? formatDateDefaultGerman(birthdayDate) : undefined
  const startDayDate = card.extensions[START_DAY_EXTENSION_NAME]
  const startDay = startDayDate ? formatDateDefaultGerman(startDayDate) : undefined

  const activationHex = convertProtobufToHexCode(
    create(QrCodeSchema, {
      qrCode: {
        case: 'dynamicActivationCode',
        value: createCardsResult.dynamicActivationCode,
      },
    }),
  )
  const staticVerificationHex = createCardsResult.staticVerificationCode
    ? convertProtobufToHexCode(
        create(QrCodeSchema, {
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
      card.expirationDate !== null ? formatDateDefaultGerman(card.expirationDate) : undefined,
      createCardsResult.staticCardInfoHashBase64,
      activationHex,
      staticVerificationHex,
    ],
  ])
}
