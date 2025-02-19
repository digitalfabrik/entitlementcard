import { fireEvent } from '@testing-library/react'
import React from 'react'

import { LOCAL_STORAGE_PROJECT_KEY } from '../../../project-configs/constants'
import koblenzConfig from '../../../project-configs/koblenz/config'
import { renderWithTranslation } from '../../../testing/render'
import CardSelfServiceActivation from '../CardSelfServiceActivation'

const downloadPdf = jest.fn()
const exampleDeepLink = 'example:deeplink'
describe('CardSelfServiceActivation', () => {
  it('should have the correct deeplink', async () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, koblenzConfig.projectId)

    const { getByText } = renderWithTranslation(
      <CardSelfServiceActivation downloadPdf={downloadPdf} deepLink={exampleDeepLink} />
    )
    expect(getByText('KoblenzPass jetzt aktivieren').getAttribute('href')).toBe(exampleDeepLink)
  })

  it('should provide a pdf download button', async () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, koblenzConfig.projectId)

    const { getByText } = renderWithTranslation(
      <CardSelfServiceActivation downloadPdf={downloadPdf} deepLink={exampleDeepLink} />
    )

    const downloadPDFButton = getByText('KoblenzPass PDF')
    fireEvent.click(downloadPDFButton)
    expect(downloadPdf).toHaveBeenCalled()
  })
})
