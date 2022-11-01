import { getUnixTime } from 'date-fns'
import {
  BavariaCardType,
  CardActivationCode,
  CardExtensions,
  CardInfo,
  Expiration,
  RegionExtension,
  BavariaCardTypeExtension,
} from '../generated/protobuf'
import isIE11 from './isIE11'
import getRandomValues from './getRandomValues'
import Long from 'long'

const generateCardActivateModel = (
  fullName: string,
  regionId: number,
  expirationDate: Date | null,
  cardType: BavariaCardType
): CardActivationCode => {
  if (!window.isSecureContext && !isIE11())
    // localhost is considered secure.
    throw Error('Environment is not considered secure nor are we using Internet Explorer.')
  const hashSecret = new Uint8Array(16) // 128 bit randomness
  getRandomValues(hashSecret)

  // https://tools.ietf.org/html/rfc6238#section-3 - R3 (TOTP uses HTOP)
  // https://tools.ietf.org/html/rfc4226#section-4 - R6 (How long should a shared secret be? -> 160bit)
  // https://tools.ietf.org/html/rfc4226#section-7.5 - Random Generation (How to generate a secret? -> Random)
  const totpSecret = new Uint8Array(20)
  getRandomValues(totpSecret)

  return new CardActivationCode({
    info: new CardInfo({
      fullName: fullName,
      expiration:
        expirationDate !== null
          ? new Expiration({
              date: Long.fromNumber(getUnixTime(expirationDate), false),
            })
          : null,
      extensions: new CardExtensions({
        extensionRegion: new RegionExtension({
          regionId: regionId,
        }),
        extensionBavariaCardType: new BavariaCardTypeExtension({
          cardType: cardType,
        }),
      }),
    }),
    hashSecret: hashSecret,
    totpSecret: totpSecret,
  })
}

export default generateCardActivateModel
