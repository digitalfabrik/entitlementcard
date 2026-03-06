import { fireEvent } from '@testing-library/react'
import React from 'react'

import { generateCardInfo, initializeCard } from '../../../cards/card'
import { CreateCardsResult } from '../../../cards/createCards'
import getCustomDeepLinkFromQrCode from '../../../cards/getCustomDeepLinkFromQrCode'
import { DynamicActivationCode } from '../../../generated/card_pb'
import { config } from '../../../project-configs/koblenz/config'
import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import CardSelfServiceActivation from './CardSelfServiceActivation'

const downloadPdf = jest.fn()
const mockProvider: CustomRenderOptions = {
  projectConfig: config,
  translation: true,
}

describe('CardSelfServiceActivation', () => {
  const card = initializeCard(config.card, undefined, { fullName: 'Thea Test' })
  const code: CreateCardsResult = {
    dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
    dynamicActivationCode: new DynamicActivationCode({ info: generateCardInfo(card) }),
  }
  const deepLink = getCustomDeepLinkFromQrCode(config, {
    case: 'dynamicActivationCode',
    value: code.dynamicActivationCode,
  })

  it('should have the correct deeplink', async () => {
    const { getByText } = renderWithOptions(
      <CardSelfServiceActivation downloadPdf={downloadPdf} code={code} />,
      mockProvider,
    )
    expect(getByText('KoblenzPass jetzt aktivieren').getAttribute('href')).toBe(deepLink)
  })

  it('should provide a pdf download button', async () => {
    const { getByText } = renderWithOptions(
      <CardSelfServiceActivation downloadPdf={downloadPdf} code={code} />,
      mockProvider,
    )

    const downloadPDFButton = getByText('KoblenzPass PDF')
    fireEvent.click(downloadPDFButton)
    expect(downloadPdf).toHaveBeenCalledWith(code, 'KoblenzPass.pdf')
  })
})
