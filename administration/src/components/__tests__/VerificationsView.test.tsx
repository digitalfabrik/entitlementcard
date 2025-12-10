import React from 'react'

import {
  type ApplicationPublic,
  ApplicationStatus,
  ApplicationVerificationView,
} from '../../generated/graphql'
import { verificationsMixed } from '../../routes/applications/__mocks__/verificationData'
import { CustomRenderOptions, renderWithOptions } from '../../testing/render'
import { JsonField } from '../JsonFieldView'
import VerificationsView from '../VerificationsView'

const mockProvider: CustomRenderOptions = {
  translation: true,
  apollo: true,
}

describe('VerificationsView', () => {
  const renderView = (
    application: Pick<ApplicationPublic, 'status' | 'id'> & {
      verifications: Pick<
        ApplicationVerificationView,
        | 'organizationName'
        | 'contactEmailAddress'
        | 'verificationId'
        | 'rejectedDate'
        | 'verifiedDate'
      >[]
    },
  ) => renderWithOptions(<VerificationsView application={application} />, mockProvider)

  it('should show a hint if there are no verifications', () => {
    const application = {
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
    }
    const { getByText, getByRole } = renderView(application)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(getByRole('note').textContent).toBe('(keine)')
  })

  it('should render a list of verification items', () => {
    const application = {
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
    }
    const { getByText, queryAllByRole } = renderView(application)
    expect(getByText('Bestätigung(en) durch Organisationen:')).toBeTruthy()
    expect(queryAllByRole('listitem')).toHaveLength(3)
  })
})
