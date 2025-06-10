import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import { PreVerifiedEntitlementType, preVerifiedEntitlements } from '../PreVerifiedEntitlementType'
import { PreVerifiedQuickIndicator, VerificationQuickIndicator } from '../VerificationsIndicator'
import {
  verificationsAwaiting,
  verificationsMixed,
  verificationsRejected,
  verificationsVerified,
} from '../__mocks__/verificationData'
import { VerificationStatus } from '../types'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('VerificationQuickIndicator', () => {
  it('should show only awaiting verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsAwaiting} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe('icon: 0')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe('icon: 2')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe('icon: 0')
  })

  it('should show mixed verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsMixed} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe('icon: 1')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe('icon: 1')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe('icon: 1')
  })

  it('should show only rejected verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsRejected} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe('icon: 0')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe('icon: 0')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe('icon: 2')
  })

  it('should show only verified verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsVerified} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe('icon: 2')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe('icon: 0')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe('icon: 0')
  })
})

describe('PreVerifiedQuickIndicator', () => {
  const cases: [string, PreVerifiedEntitlementType][] = [
    ['Juleica', preVerifiedEntitlements.Juleica],
    ['Verein360', preVerifiedEntitlements.Verein360],
    ['Ehrenzeichen', preVerifiedEntitlements.HonoredByMinisterPresident],
  ]

  it.each(cases)('should show %s label when type is %s', (expectedLabel, type) => {
    const { getByText } = renderWithTranslation(<PreVerifiedQuickIndicator type={type} />)
    expect(getByText(expectedLabel)).toBeTruthy()
  })
})
