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
    const application = {
      createdDate: '2024-05-15T09:20:23.350015Z',
      id: 1,
      jsonValue: '',
      note: 'neu',
      verifications: [],
      withdrawalDate: null,
    }
    const { getByText, getByRole } = renderWithTranslation(<VerificationsView application={application} />)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(getByRole('note').textContent).toBe('(keine)')
  })

  it('should render a list of verification items', () => {
    const application = {
      createdDate: '2024-05-15T09:20:23.350015Z',
      id: 2,
      jsonValue: '',
      note: 'neu',
      verifications: verificationsMixed,
      withdrawalDate: null,
    }
    const { getByText, queryAllByRole } = renderWithTranslation(<VerificationsView application={application} />)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(queryAllByRole('listitem')).toHaveLength(3)
  })
})
