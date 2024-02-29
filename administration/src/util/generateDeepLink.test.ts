import {
  ACTIVATION_FRAGMENT,
  ACTIVATION_PATH,
  BAYERN_PRODUCTION_ID,
  BAYERN_STAGING_ID,
  CUSTOM_SCHEME,
  HTTPS_SCHEME,
} from 'build-configs/constants'

import CardBlueprint from '../cards/CardBlueprint'
import { CreateCardsResult } from '../cards/createCards'
import BavariaCardTypeExtension from '../cards/extensions/BavariaCardTypeExtension'
import RegionExtension from '../cards/extensions/RegionExtension'
import { PdfQrCode } from '../cards/pdf/PdfQrCodeElement'
import { DynamicActivationCode } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import generateDeepLink from './generateDeepLink'

describe('DeepLink generation', () => {
  const region: Region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
  }

  const cardConfigBayern = {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null],
    extensions: [BavariaCardTypeExtension, RegionExtension],
  }

  const card = new CardBlueprint('Thea Test', cardConfigBayern, [region])
  const code: CreateCardsResult = {
    dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
    dynamicActivationCode: new DynamicActivationCode({ info: card.generateCardInfo() }),
  }

  const dynamicPdfQrCode: PdfQrCode = {
    case: 'dynamicActivationCode',
    value: code.dynamicActivationCode,
  }

  const activationCodeBase64 = 'ChsKGQoJVGhlYSBUZXN0EI2jARoICgIIACICCAA%3D'
  window = Object.create(window)

  it('should generate a correct link for development', () => {
    expect(generateDeepLink(dynamicPdfQrCode, BAYERN_PRODUCTION_ID)).toBe(
      `${CUSTOM_SCHEME}://${BAYERN_PRODUCTION_ID}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCodeBase64}`
    )
  })
  it('should generate a correct link for staging', () => {
    const hostname = BAYERN_STAGING_ID
    Object.defineProperty(window, 'location', {
      value: {
        hostname,
      },
      writable: true,
    })
    expect(generateDeepLink(dynamicPdfQrCode, BAYERN_STAGING_ID)).toBe(
      `${HTTPS_SCHEME}://${BAYERN_STAGING_ID}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCodeBase64}`
    )
  })
  it('should generate a correct link for production', () => {
    const hostname = BAYERN_PRODUCTION_ID
    Object.defineProperty(window, 'location', {
      value: {
        hostname,
      },
      writable: true,
    })
    expect(generateDeepLink(dynamicPdfQrCode, BAYERN_PRODUCTION_ID)).toBe(
      `${HTTPS_SCHEME}://${BAYERN_PRODUCTION_ID}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}${activationCodeBase64}`
    )
  })
})
