import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import PreVerifiedQuickIndicator, { PreVerifiedQuickIndicatorType } from '../PreVerifiedQuickIndicator'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('PreVerifiedQuickIndicator', () => {
  it('should show juleica label if the particular type was set', async () => {
    const { getByText } = renderWithTranslation(
      <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Juleica} />
    )
    expect(getByText('Juleica')).toBeTruthy()
  })

  it('should show verein360 label if the particular type was set', async () => {
    const { getByText } = renderWithTranslation(
      <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Verein360} />
    )

    expect(getByText('Verein360')).toBeTruthy()
  })
})
