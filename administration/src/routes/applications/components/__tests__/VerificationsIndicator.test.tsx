import React from 'react'

import { renderWithOptions } from '../../../../testing/render'
import { VerificationStatus } from '../../../../util/verifications'
import {
  verificationsAwaiting,
  verificationsMixed,
  verificationsRejected,
  verificationsVerified,
} from '../../__mocks__/verificationData'
import {
  PreVerifiedEntitlementType,
  preVerifiedEntitlements,
} from '../../utils/preVerifiedEntitlements'
import { PreVerifiedIndicator, VerificationIndicator } from '../VerificationsIndicator'

describe('VerificationQuickIndicator', () => {
  it('should show only awaiting verifications', () => {
    const { getByTestId } = renderWithOptions(
      <VerificationIndicator verifications={verificationsAwaiting} />,
      {
        translation: true,
      },
    )
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe(': 2')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 0')
  })

  it('should show mixed verifications', () => {
    const { getByTestId } = renderWithOptions(
      <VerificationIndicator verifications={verificationsMixed} />,
      {
        translation: true,
      },
    )
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 1')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe(': 1')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 1')
  })

  it('should show only rejected verifications', () => {
    const { getByTestId } = renderWithOptions(
      <VerificationIndicator verifications={verificationsRejected} />,
      {
        translation: true,
      },
    )
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Pending}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 2')
  })

  it('should show only verified verifications', () => {
    const { getByTestId } = renderWithOptions(
      <VerificationIndicator verifications={verificationsVerified} />,
      {
        translation: true,
      },
    )
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
    const { getByText } = renderWithOptions(<PreVerifiedIndicator type={type} />, {
      translation: true,
    })
    expect(getByText(expectedLabel)).toBeTruthy()
  })
})
