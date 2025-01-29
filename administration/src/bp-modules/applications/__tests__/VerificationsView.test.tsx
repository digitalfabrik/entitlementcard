import React, { act } from 'react'

import { renderWithTranslation } from '../../../testing/render'
import VerificationsView from '../VerificationsView'
import { verificationsMixed } from '../__mocks__/verificationData'

describe('VerificationsView', () => {
  it('should show a hint if there are no verifications', async () => {
    const { getByTestId, getByText } = renderWithTranslation(<VerificationsView verifications={[]} />)
    await act(async () => null) // Blueprint5.Icon update
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(getByTestId('no-verifications-hint').textContent).toBe('(keine)')
  })

  it('should render a list of verification items', async () => {
    const { getAllByTestId, getByText } = renderWithTranslation(
      <VerificationsView verifications={verificationsMixed} />
    )
    await act(async () => null) // Blueprint5.Icon update
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(getAllByTestId('verification-list-item')).toHaveLength(3)
  })
})
