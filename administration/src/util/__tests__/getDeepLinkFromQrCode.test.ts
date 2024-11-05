import {
  ACTIVATION_FRAGMENT,
  ACTIVATION_PATH,
  BAYERN_PRODUCTION_ID,
  BAYERN_STAGING_ID,
  HTTPS_SCHEME,
} from 'build-configs'

import { generateCardInfo, initializeCard } from '../../cards/Card'
import { CreateCardsResult } from '../../cards/createCards'
import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { PdfQrCode } from '../../cards/pdf/PdfQrCodeElement'
import { DynamicActivationCode } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import { LOCAL_STORAGE_PROJECT_KEY } from '../../project-configs/constants'
import { getBuildConfig } from '../getBuildConfig'
import getDeepLinkFromQrCode from '../getDeepLinkFromQrCode'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })

describe('DeepLink generation', () => {
  const region: Region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
    activatedForCardConfirmationMail: true,
  }

  const cardConfigBayern = {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null],
    extensions: [BavariaCardTypeExtension, RegionExtension],
  }

  const card = initializeCard(cardConfigBayern, region, { fullName: 'Thea Test' })
  const code: CreateCardsResult = {
    dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
    dynamicActivationCode: new DynamicActivationCode({ info: generateCardInfo(card) }),
  }

  const dynamicPdfQrCode: PdfQrCode = {
    case: 'dynamicActivationCode',
    value: code.dynamicActivationCode,
  }

  const encodedActivationCodeBase64 = 'ChsKGQoJVGhlYSBUZXN0ENOiARoICgIIACICCAA%3D'
  const overrideHostname = (hostname: string) =>
    Object.defineProperty(window, 'location', {
      value: {
        hostname,
      },
      writable: true,
    })

  it('should generate a correct link for development', () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, BAYERN_STAGING_ID)
    const projectId = getBuildConfig(window.location.hostname).common.projectId.staging
    expect(getDeepLinkFromQrCode(dynamicPdfQrCode)).toBe(
      `${HTTPS_SCHEME}://${projectId}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodedActivationCodeBase64}/`
    )
  })
  it('should generate a correct link for staging', () => {
    overrideHostname(BAYERN_STAGING_ID)
    const projectId = getBuildConfig(window.location.hostname).common.projectId.staging
    expect(getDeepLinkFromQrCode(dynamicPdfQrCode)).toBe(
      `${HTTPS_SCHEME}://${projectId}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodedActivationCodeBase64}/`
    )
  })
  it('should generate a correct link for production', () => {
    overrideHostname(BAYERN_PRODUCTION_ID)
    const projectId = getBuildConfig(window.location.hostname).common.projectId.production
    expect(getDeepLinkFromQrCode(dynamicPdfQrCode)).toBe(
      `${HTTPS_SCHEME}://${projectId}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodedActivationCodeBase64}/`
    )
  })
})
