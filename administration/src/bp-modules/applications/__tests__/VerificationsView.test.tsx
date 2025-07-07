import { MockedProvider } from '@apollo/client/testing'
import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import VerificationsView, { Application } from '../VerificationsView'
import { verificationsMixed } from '../__mocks__/verificationData'

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Icon: () => 'icon',
}))

describe('VerificationsView', () => {
  const renderView = (application: Application) =>
    renderWithTranslation(
      <MockedProvider>
        <VerificationsView application={application} showResendApprovalEmailButton />
      </MockedProvider>
    )

  it('should show a hint if there are no verifications', () => {
    const application = {
      createdDate: '2024-05-15T09:20:23.350015Z',
      id: 1,
      jsonValue: '',
      note: 'neu',
      verifications: [],
    }
    const { getByText, getByRole } = renderView(application)
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
    }
    const { getByText, queryAllByRole } = renderView(application)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(queryAllByRole('listitem')).toHaveLength(3)
  })
})
