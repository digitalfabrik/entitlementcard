import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import PreVerifiedQuickIndicator, { PreVerifiedQuickIndicatorType } from '../PreVerifiedQuickIndicator'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('PreVerifiedQuickIndicator', () => {
  it('should show juleica logo if the particular type was set', async () => {
    const { getByAltText } = renderWithTranslation(
      <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Juleica} />
    )
    expect(getByAltText(PreVerifiedQuickIndicatorType.Juleica.toString())).toBeTruthy()
  })

  it('should show verein360 logo if the particular type was set', async () => {
    const { getByAltText } = renderWithTranslation(
      <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Verein360} />
    )
    expect(getByAltText(PreVerifiedQuickIndicatorType.Verein360.toString())).toBeTruthy()
  })
})
