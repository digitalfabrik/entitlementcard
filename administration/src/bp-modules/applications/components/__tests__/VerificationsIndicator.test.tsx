import React from 'react'

import { renderWithTranslation } from '../../../../testing/render'
import {
  verificationsAwaiting,
  verificationsMixed,
  verificationsRejected,
  verificationsVerified,
} from '../../__mocks__/verificationData'
import { PreVerifiedEntitlementType, preVerifiedEntitlements } from '../../preVerifiedEntitlements'
import { VerificationStatus } from '../../types'
import { PreVerifiedIndicator, VerificationIndicator } from '../VerificationsIndicator'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('VerificationQuickIndicator', () => {
  it('should show only awaiting verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationIndicator verifications={verificationsAwaiting} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe(': 2')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 0')
  })

  it('should show mixed verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationIndicator verifications={verificationsMixed} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 1')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe(': 1')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 1')
  })

  it('should show only rejected verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationIndicator verifications={verificationsRejected} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 2')
  })

  it('should show only verified verifications', () => {
    const { getByTestId } = renderWithTranslation(<VerificationIndicator verifications={verificationsVerified} />)
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 2')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 0')
  })
})

describe('PreVerifiedQuickIndicator', () => {
  const cases: [string, PreVerifiedEntitlementType][] = [
    ['Juleica', preVerifiedEntitlements.Juleica],
    ['Verein360', preVerifiedEntitlements.Verein360],
    ['Ehrenzeichen', preVerifiedEntitlements.HonoredByMinisterPresident],
  ]

  it.each(cases)('should show %s label when type is %s', (expectedLabel, type) => {
    const { getByText } = renderWithTranslation(<PreVerifiedIndicator type={type} />)
    expect(getByText(expectedLabel)).toBeTruthy()
  })
})
