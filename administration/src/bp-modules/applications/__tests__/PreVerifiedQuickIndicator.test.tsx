import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import { PreVerifiedEntitlementType, preVerifiedEntitlements } from '../PreVerifiedEntitlementType'
import PreVerifiedQuickIndicator from '../PreVerifiedQuickIndicator'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('PreVerifiedQuickIndicator', () => {
  const cases: [string, PreVerifiedEntitlementType][] = [
    ['Juleica', preVerifiedEntitlements.Juleica],
    ['Verein360', preVerifiedEntitlements.Verein360],
    ['Ehrenzeichen', preVerifiedEntitlements.HonoredByMinisterPresident],
  ]

  it.each(cases)('should show %s label when type is %s', (expectedLabel, type) => {
    const { getByText } = renderWithTranslation(<PreVerifiedQuickIndicator type={type} />)
    expect(getByText(expectedLabel)).toBeInTheDocument()
  })
})
