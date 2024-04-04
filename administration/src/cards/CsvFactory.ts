import { QrCode } from '../generated/card_pb'
import { convertProtobufToHexCode } from '../util/qrcode'
import CardBlueprint from './CardBlueprint'
import { CreateCardsResult } from './createCards'
import AddressExtensions from './extensions/AddressFieldExtensions'
import BirthdayExtension from './extensions/BirthdayExtension'
import NuernbergPassIdExtension from './extensions/NuernbergPassIdExtension'
import StartDayExtension from './extensions/StartDayExtension'
import { findExtension } from './extensions/extensions'

export class CsvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CSVError'
  }
}

export async function generateCsv(codes: CreateCardsResult[], cardBlueprints: CardBlueprint[]) {
  try {
    let csvContent =
      'Name,AddressLine1,AddressLine2,AddressLocation,PassId,Birthday,StartDate,ExpirationDate,CardHash,ActivationCode,StaticUserCode\n'
    for (let k = 0; k < codes.length; k++) {
      csvContent += buildCsvLine(codes[k], cardBlueprints[k])
    }
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  } catch (error) {
    if (error instanceof Error) throw new CsvError(error.message)
    throw error
  }
}

const buildCsvLine = (createCardsResult: CreateCardsResult, cardBlueprint: CardBlueprint): string => {
  const [addressLine1, addressLine2, plz, location] = AddressExtensions.map(ext =>
    findExtension(cardBlueprint.extensions, ext)
  )
  const passId = findExtension(cardBlueprint.extensions, NuernbergPassIdExtension)?.state?.passId
  const birthday = findExtension(cardBlueprint.extensions, BirthdayExtension)?.state?.birthday
  const startDay = findExtension(cardBlueprint.extensions, StartDayExtension)?.state?.startDay
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

  return `${cardBlueprint.fullName},${addressLine1},${addressLine2},${plz} ${location},${passId},${birthday},${startDay},${cardBlueprint.expirationDate},${createCardsResult.staticCardInfoHashBase64},${activationHex},${staticVerificationHex}\n`
}

export const getCSVFilename = (cardBlueprints: CardBlueprint[]): string => {
  const filename =
    cardBlueprints.length === 1
      ? findExtension(cardBlueprints[0].extensions, NuernbergPassIdExtension)?.state?.passId
      : 'Pass-ID[0]mass'
  return `${filename}.csv`
}
