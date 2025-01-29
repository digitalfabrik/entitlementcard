import React, { act } from 'react'

import { renderWithTranslation } from '../../../../testing/render'
import { verificationsAwaiting, verificationsRejected, verificationsVerified } from '../../__mocks__/verificationData'
import VerificationListItem from '../VerificationListItem'

describe('VerificationListItem', () => {
  it('should show a rejected verification list item with correct content', async () => {
    const { getByTestId } = renderWithTranslation(<VerificationListItem verification={verificationsRejected[0]} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId('item-organisation-label').textContent).toBe('Organisation:')
    expect(getByTestId('item-organisation-content').textContent).toBe('Verein420')
    expect(getByTestId('item-mail-label').textContent).toBe('E-Mail:')
    expect(getByTestId('item-mail-content').textContent).toBe('erika.musterfrau@posteo.de')
    expect(getByTestId('item-status-label').textContent).toBe('Status:')
    expect(getByTestId('item-status-content').textContent).toBe(' Widersprochen am 16.1.2025, 16:22:52')
  })

  it('should show a awaiting verification list item with correct content', async () => {
    const { getByTestId } = renderWithTranslation(<VerificationListItem verification={verificationsAwaiting[0]} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId('item-organisation-label').textContent).toBe('Organisation:')
    expect(getByTestId('item-organisation-content').textContent).toBe('Verein420')
    expect(getByTestId('item-mail-label').textContent).toBe('E-Mail:')
    expect(getByTestId('item-mail-content').textContent).toBe('erika.musterfrau@posteo.de')
    expect(getByTestId('item-status-label').textContent).toBe('Status:')
    expect(getByTestId('item-status-content').textContent).toBe(' Ausstehend')
  })

  it('should show a verified verification list item with correct content', async () => {
    const { getByTestId } = renderWithTranslation(<VerificationListItem verification={verificationsVerified[0]} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByTestId('item-organisation-label').textContent).toBe('Organisation:')
    expect(getByTestId('item-organisation-content').textContent).toBe('Verein420')
    expect(getByTestId('item-mail-label').textContent).toBe('E-Mail:')
    expect(getByTestId('item-mail-content').textContent).toBe('erika.musterfrau@posteo.de')
    expect(getByTestId('item-status-label').textContent).toBe('Status:')
    expect(getByTestId('item-status-content').textContent).toBe(' Bestätigt am 16.1.2025, 16:22:52')
  })
})
