import React, { act } from 'react'

import { renderWithTranslation } from '../../../testing/render'
import VerificationQuickIndicator from '../VerificationsQuickIndicator'
import { VerificationStatus } from '../VerificationsView'
import {
  verificationsAwaiting,
  verificationsMixed,
  verificationsRejected,
  verificationsVerified,
} from '../__mocks__/verificationData'

describe('VerificiationQuickIndicator', () => {
  it('should show only awaiting verifications', async () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsAwaiting} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Awaiting}`).textContent).toBe(': 2')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 0')
  })

  it('should show only mixed verifications', async () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsMixed} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 1')
    expect(getByTestId(`indicator-${VerificationStatus.Awaiting}`).textContent).toBe(': 1')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 1')
  })

  it('should show only rejected verifications', async () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsRejected} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Awaiting}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 2')
  })

  it('should show only verified verifications', async () => {
    const { getByTestId } = renderWithTranslation(<VerificationQuickIndicator verifications={verificationsVerified} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId(`indicator-${VerificationStatus.Verified}`).textContent).toBe(': 2')
    expect(getByTestId(`indicator-${VerificationStatus.Awaiting}`).textContent).toBe(': 0')
    expect(getByTestId(`indicator-${VerificationStatus.Rejected}`).textContent).toBe(': 0')
  })
})
