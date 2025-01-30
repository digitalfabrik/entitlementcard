import React, { act } from 'react'

import { renderWithTranslation } from '../../../testing/render'
import PreVerifiedQuickIndicator, { PreVerifiedQuickIndicatorType } from '../PreVerifiedQuickIndicator'

describe('PreVerifiedQuickIndicator', () => {
  it('should show juleica logo if the particular type was set', async () => {
    const { getByTestId } = renderWithTranslation(
      <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Juleica} />
    )
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId('quick-indicator-logo').getAttribute('alt')).toBe(
      PreVerifiedQuickIndicatorType.Juleica.toString()
    )
  })

  it('should show verein360 logo if the particular type was set', async () => {
    const { getByTestId } = renderWithTranslation(
      <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Verein360} />
    )
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId('quick-indicator-logo').getAttribute('alt')).toBe(
      PreVerifiedQuickIndicatorType.Verein360.toString()
    )
  })
})
