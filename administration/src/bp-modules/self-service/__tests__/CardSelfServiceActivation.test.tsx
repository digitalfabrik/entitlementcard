import { fireEvent } from '@testing-library/react'

import { generateCardInfo, initializeCard } from '../../../cards/Card'
import { CreateCardsResult } from '../../../cards/createCards'
import { DynamicActivationCode } from '../../../generated/card_pb'
import koblenzConfig from '../../../project-configs/koblenz/config'
import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import getCustomDeepLinkFromQrCode from '../../../util/getCustomDeepLinkFromQrCode'
import CardSelfServiceActivation from '../CardSelfServiceActivation'

const downloadPdf = jest.fn()
const mockProvider: CustomRenderOptions = {
  projectConfig: koblenzConfig,
  translation: true,
}

describe('CardSelfServiceActivation', () => {
  const card = initializeCard(koblenzConfig.card, undefined, { fullName: 'Thea Test' })
  const code: CreateCardsResult = {
    dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
    dynamicActivationCode: new DynamicActivationCode({ info: generateCardInfo(card) }),
  }
  const deepLink = getCustomDeepLinkFromQrCode(koblenzConfig, {
    case: 'dynamicActivationCode',
    value: code.dynamicActivationCode,
  })

  it('should have the correct deeplink', async () => {
    const { getByText } = renderWithOptions(
      <CardSelfServiceActivation downloadPdf={downloadPdf} code={code} />,
      mockProvider
    )
    expect(getByText('KoblenzPass jetzt aktivieren').getAttribute('href')).toBe(deepLink)
  })

  it('should provide a pdf download button', async () => {
    const { getByText } = renderWithOptions(
      <CardSelfServiceActivation downloadPdf={downloadPdf} code={code} />,
      mockProvider
    )

    const downloadPDFButton = getByText('KoblenzPass PDF')
    fireEvent.click(downloadPDFButton)
    expect(downloadPdf).toHaveBeenCalledWith(code, 'KoblenzPass.pdf')
  })
})
