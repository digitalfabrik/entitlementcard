import React from 'react'

import { renderWithTranslation } from '../../../../testing/render'
import { verificationsAwaiting, verificationsRejected, verificationsVerified } from '../../__mocks__/verificationData'
import VerificationListItem from '../VerificationListItem'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('VerificationListItem', () => {
  it('should show a rejected verification list item with correct content', () => {
    const { getByText } = renderWithTranslation(<VerificationListItem verification={verificationsRejected[0]} />)
    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('icon Widersprochen am 16.1.2025, 16:22:52')).toBeTruthy()
  })

  it('should show a awaiting verification list item with correct content', () => {
    const { getByText } = renderWithTranslation(<VerificationListItem verification={verificationsAwaiting[0]} />)
    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('icon Ausstehend')).toBeTruthy()
  })

  it('should show a verified verification list item with correct content', () => {
    const { getByText } = renderWithTranslation(<VerificationListItem verification={verificationsVerified[0]} />)
    expect(getByText('Organisation:')).toBeTruthy()
    expect(getByText('Verein420')).toBeTruthy()
    expect(getByText('E-Mail:')).toBeTruthy()
    expect(getByText('erika.musterfrau@posteo.de')).toBeTruthy()
    expect(getByText('Status:')).toBeTruthy()
    expect(getByText('icon Bestätigt am 16.1.2025, 16:22:52')).toBeTruthy()
  })
})
