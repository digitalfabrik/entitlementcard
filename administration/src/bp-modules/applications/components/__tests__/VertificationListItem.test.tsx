import { MockedProvider } from '@apollo/client/testing'
import React from 'react'

import { AuthContext } from '../../../../AuthProvider'
import { renderWithTranslation } from '../../../../testing/render'
import { verificationsAwaiting, verificationsRejected, verificationsVerified } from '../../__mocks__/verificationData'
import VerificationListItem, { Verification } from '../VerificationListItem'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('VerificationListItem', () => {
  const mockTokenPayload = {
    token: 'dummy',
    expiry: new Date('2099-01-01'),
    adminId: 123,
  }

  const mockAuthContext = {
    data: mockTokenPayload,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }

  const renderListItem = (verification: Verification) =>
    renderWithTranslation(
      <MockedProvider>
        <AuthContext.Provider value={mockAuthContext}>
          <VerificationListItem verification={verification} applicationId={1} />
        </AuthContext.Provider>
      </MockedProvider>
    )

  it('should show a rejected verification list item with correct content', () => {
    const { getByText, queryByText } = renderListItem(verificationsRejected[0])

    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('icon Widersprochen am 16.1.2025, 16:22:52')).toBeTruthy()

    expect(queryByText('Anfrage erneut senden')).toBeNull()
  })

  it('should show a awaiting verification list item with correct content', () => {
    const { getByText } = renderListItem(verificationsAwaiting[0])

    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('icon Ausstehend')).toBeTruthy()

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
    expect(getByText('icon Bestätigt am 16.1.2025, 16:22:52')).toBeTruthy()

    expect(queryByText('Anfrage erneut senden')).toBeNull()
  })
})
