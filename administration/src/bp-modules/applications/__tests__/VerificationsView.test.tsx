import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import VerificationsView from '../VerificationsView'
import { verificationsMixed } from '../__mocks__/verificationData'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('VerificationsView', () => {
  it('should show a hint if there are no verifications', () => {
    const { getByText, getByRole } = renderWithTranslation(<VerificationsView verifications={[]} />)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(getByRole('note').textContent).toBe('(keine)')
  })

  it('should render a list of verification items', () => {
    const { getByText, queryAllByRole } = renderWithTranslation(
      <VerificationsView verifications={verificationsMixed} />
    )
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(queryAllByRole('listitem')).toHaveLength(3)
  })
})
