import isIE11 from './isIE11'
import getRandomValues from './getRandomValues'
import {
  BavariaCardType,
  BavariaCardTypeExtension,
  DynamicActivationCode,
  CardExtensions,
  CardInfo,
  RegionExtension,
} from '../generated/card_pb'
import { dateToDaysSinceEpoch } from './validityPeriod'

const TOTP_SECRET_LENGTH = 20;

const generateActivationCodes = (
  fullName: string,
  regionId: number,
  expirationDate: Date | null,
  cardType: BavariaCardType
): DynamicActivationCode => {
  if (!window.isSecureContext && !isIE11())
    // localhost is considered secure.
    throw Error('Environment is not considered secure nor are we using Internet Explorer.')
  const pepper = new Uint8Array(16) // 128 bit randomness
  getRandomValues(pepper)

  // https://tools.ietf.org/html/rfc6238#section-3 - R3 (TOTP uses HTOP)
  // https://tools.ietf.org/html/rfc4226#section-4 - R6 (How long should a shared secret be? -> 160bit)
  // https://tools.ietf.org/html/rfc4226#section-7.5 - Random Generation (How to generate a secret? -> Random)
  const totpSecret = new Uint8Array(TOTP_SECRET_LENGTH)
  getRandomValues(totpSecret)

  return new DynamicActivationCode({
    info: new CardInfo({
      fullName: fullName,
      expirationDay: expirationDate !== null ? dateToDaysSinceEpoch(expirationDate) : undefined,
      extensions: new CardExtensions({
        extensionRegion: new RegionExtension({
          regionId: regionId,
        }),
        extensionBavariaCardType: new BavariaCardTypeExtension({
          cardType: cardType,
        }),
      }),
    }),
    pepper: pepper,
    totpSecret: totpSecret,
  })
}

export default generateActivationCodes
