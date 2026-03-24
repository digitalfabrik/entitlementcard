import React from 'react'

import { ApplicationStatus } from '../graphql'
import { verificationsMixed } from '../routes/applications/__mocks__/verificationData'
import { Application } from '../routes/applications/types/types'
import { CustomRenderOptions, renderWithOptions } from '../testing/render'
import { JsonField } from './JsonFieldView'
import VerificationsView from './VerificationsView'

const mockProvider: CustomRenderOptions = {
  translation: true,
  graphQlProvider: true,
}

describe('VerificationsView', () => {
  const renderView = (application: Application) =>
    renderWithOptions(<VerificationsView application={application} />, mockProvider)

  it('should show a hint if there are no verifications', () => {
    const application: Application = {
      createdDate: '2024-05-15T09:20:23.350015Z',
      id: 1,
      jsonValue: {
        name: 'application',
        type: 'Array',
        value: [],
      } as JsonField<'Array'>,
      status: ApplicationStatus.Pending,
      note: 'neu',
      verifications: [],
      statusResolvedDate: null,
      rejectionMessage: null,
    }
    const { getByText, getByRole } = renderView(application)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(getByRole('note').textContent).toBe('(keine)')
  })

  it('should render a list of verification items', () => {
    const application: Application = {
      createdDate: '2024-05-15T09:20:23.350015Z',
      id: 2,
      jsonValue: {
        name: 'application',
        type: 'Array',
        value: [],
      } as JsonField<'Array'>,
      status: ApplicationStatus.Pending,
      note: 'neu',
      verifications: verificationsMixed,
      statusResolvedDate: null,
      rejectionMessage: null,
    }
    const { getByText, queryAllByRole } = renderView(application)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(queryAllByRole('listitem')).toHaveLength(3)
  })
})
