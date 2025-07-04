import {
  ACTIVATION_FRAGMENT,
  ACTIVATION_PATH,
  HTTPS_SCHEME,
  buildConfigBayern,
  buildConfigKoblenz,
} from 'build-configs'

import { getTestRegion } from '../../bp-modules/user-settings/__mocks__/Region'
import { generateCardInfo, initializeCard } from '../../cards/Card'
import { CreateCardsResult } from '../../cards/createCards'
import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { PdfQrCode } from '../../cards/pdf/PdfQrCodeElement'
import { DynamicActivationCode } from '../../generated/card_pb'
import getDeepLinkFromQrCode from '../getDeepLinkFromQrCode'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })

describe('DeepLink generation', () => {
  const region = getTestRegion({})

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

  const buildConfigs = [{ buildConfig: buildConfigBayern }, { buildConfig: buildConfigKoblenz }]

  // custom link schemes don't work in browsers or pdf thats why we use the staging link scheme also for development
  it.each(buildConfigs)(
    'should generate a correct link for $buildConfig.common.projectId.staging for staging and development',
    ({ buildConfig }) => {
      const projectId = buildConfig.common.projectId.staging

      expect(getDeepLinkFromQrCode(dynamicPdfQrCode, buildConfig, false)).toBe(
        `${HTTPS_SCHEME}://${projectId}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodedActivationCodeBase64}`
      )
    }
  )

  it.each(buildConfigs)(
    'should generate a correct link for $buildConfig.common.projectId.production',
    ({ buildConfig }) => {
      const projectId = buildConfig.common.projectId.production

      expect(getDeepLinkFromQrCode(dynamicPdfQrCode, buildConfig, true)).toBe(
        `${HTTPS_SCHEME}://${projectId}/${ACTIVATION_PATH}/${ACTIVATION_FRAGMENT}#${encodedActivationCodeBase64}`
      )
    }
  )
})
