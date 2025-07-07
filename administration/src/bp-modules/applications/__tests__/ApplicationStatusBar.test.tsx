import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import ApplicationStatusBar from '../ApplicationStatusBar'
import { barItems } from '../ApplicationsOverview'
import { GetApplicationsType } from '../types'

const applications: GetApplicationsType[] = [
  {
    createdDate: '2024-05-15T09:20:23.350015Z',
    id: 1,
    jsonValue: '',
    note: 'neu',
    verifications: [
      {
        verificationId: 1,
        contactEmailAddress: 'example@test.de',
        organizationName: 'TürAnTürn',
        rejectedDate: null,
        verifiedDate: '2024-05-15T13:54:11.010430Z',
      },
    ],
  },
  {
    createdDate: '2024-05-15T09:20:23.350015Z',
    id: 2,
    jsonValue: '',
    note: 'neu',
    verifications: [
      {
        verificationId: 2,
        contactEmailAddress: 'example@test.de',
        organizationName: 'TürAnTürn',
        rejectedDate: null,
        verifiedDate: '2024-05-15T13:54:11.010430Z',
      },
    ],
  },
  {
    createdDate: '2024-05-15T09:20:23.350015Z',
    id: 3,
    jsonValue: '',
    note: 'test',
    verifications: [
      {
        verificationId: 3,
        contactEmailAddress: 'example@test.de',
        organizationName: 'TürAnTürn',
        rejectedDate: null,
        verifiedDate: null,
      },
    ],
  },
  {
    createdDate: '2024-05-15T09:20:23.350015Z',
    id: 4,
    jsonValue: '',
    note: 'test',
    verifications: [
      {
        verificationId: 4,
        contactEmailAddress: 'example@test.de',
        organizationName: 'TürAnTürn',
        rejectedDate: null,
        verifiedDate: null,
      },
    ],
    statusResolvedDate: '2024-05-15T09:20:23.350015Z',
  },
]

jest.mock('@blueprintjs/core', () => ({
  ...jest.requireActual('@blueprintjs/core'),
  Button: () => 'button',
}))

describe('ApplicationStatusBar', () => {
  const setActiveBarItem = jest.fn()

  it('Should show the correct count for all applications', () => {
    const { getByTestId } = renderWithTranslation(
      <ApplicationStatusBar
        applications={applications}
        setActiveBarItem={setActiveBarItem}
        barItems={barItems}
        activeBarItem={barItems[0]}
      />
    )
    const allApplicationsCount = getByTestId('status-Alle Anträge-count')
    expect(allApplicationsCount).toHaveTextContent('4')
  })
  it('Should show the correct count for open applications', () => {
    const { getByTestId } = renderWithTranslation(
      <ApplicationStatusBar
        applications={applications}
        setActiveBarItem={setActiveBarItem}
        barItems={barItems}
        activeBarItem={barItems[0]}
      />
    )
    const openApplicationsCount = getByTestId('status-Offen-count')
    expect(openApplicationsCount).toHaveTextContent('1')
  })
  it('Should show the correct count for withdrawn applications', () => {
    const { getByTestId } = renderWithTranslation(
      <ApplicationStatusBar
        applications={applications}
        setActiveBarItem={setActiveBarItem}
        barItems={barItems}
        activeBarItem={barItems[0]}
      />
    )
    const withdrawnApplicationsCount = getByTestId('status-Zurückgezogen-count')
    expect(withdrawnApplicationsCount).toHaveTextContent('1')
  })
  it('Should show the correct count for rejected applications', () => {
    const { getByTestId } = renderWithTranslation(
      <ApplicationStatusBar
        applications={applications}
        setActiveBarItem={setActiveBarItem}
        barItems={barItems}
        activeBarItem={barItems[0]}
      />
    )
    const rejectedApplicationsCount = getByTestId('status-Abgelehnt-count')
    expect(rejectedApplicationsCount).toHaveTextContent('0')
  })
  it('Should show the correct count for accepted applications', () => {
    const { getByTestId } = renderWithTranslation(
      <ApplicationStatusBar
        applications={applications}
        setActiveBarItem={setActiveBarItem}
        barItems={barItems}
        activeBarItem={barItems[0]}
      />
    )
    const acceptedApplicationsCount = getByTestId('status-Akzeptiert-count')
    expect(acceptedApplicationsCount).toHaveTextContent('2')
  })
})
