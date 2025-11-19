import React from 'react'

import { ApplicationVerificationView } from '../../../../generated/graphql'
import VerificationListItem from '../../../../shared/components/VerificationListItem'
import { CustomRenderOptions, renderWithOptions } from '../../../../testing/render'
import { verificationsAwaiting, verificationsRejected, verificationsVerified } from '../../__mocks__/verificationData'

const mockProvider: CustomRenderOptions = {
  translation: true,
  apollo: true,
}

describe('VerificationListItem', () => {
  const renderListItem = (
    verification: Pick<
      ApplicationVerificationView,
      'organizationName' | 'contactEmailAddress' | 'verificationId' | 'rejectedDate' | 'verifiedDate'
    >
  ) =>
    renderWithOptions(
      <VerificationListItem verification={verification} applicationId={1} showResendApprovalEmailButton />,
      mockProvider
    )

  it('should show a rejected verification list item with correct content', () => {
    const { getByText, queryByText } = renderListItem(verificationsRejected[0])

    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('Widersprochen am 16.1.2025, 16:22:52')).toBeTruthy()
    expect(queryByText('Anfrage erneut senden')).toBeTruthy()
  })

  it('should show a awaiting verification list item with correct content', () => {
    const { getByText } = renderListItem(verificationsAwaiting[0])

    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('Ausstehend')).toBeTruthy()

    const sendApprovalEmailButton = getByText('Anfrage erneut senden')
    expect(sendApprovalEmailButton).toBeInTheDocument()
    expect(sendApprovalEmailButton).toBeEnabled()
  })

  it('should show a verified verification list item with correct content', () => {
    const { getByText, queryByText } = renderListItem(verificationsVerified[0])

    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('Bestätigt am 16.1.2025, 16:22:52')).toBeTruthy()
    expect(queryByText('Anfrage erneut senden')).toBeTruthy()
  })

  it('should show a resend email button when `showResendApprovalEmailButton` prop is true', () => {
    const { queryByText } = renderWithOptions(
      <VerificationListItem verification={verificationsVerified[0]} applicationId={1} showResendApprovalEmailButton />,
      mockProvider
    )
    expect(queryByText('Anfrage erneut senden')).toBeTruthy()
  })

  it('should not show a resend email button when `showResendApprovalEmailButton` prop is omitted', () => {
    const { queryByText } = renderWithOptions(
      <VerificationListItem
        verification={verificationsVerified[0]}
        applicationId={1}
        showResendApprovalEmailButton={false}
      />,
      mockProvider
    )
    expect(queryByText('Anfrage erneut senden')).toBeNull()
  })
})
