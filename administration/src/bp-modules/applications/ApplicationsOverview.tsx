import { NonIdealState } from '@blueprintjs/core'
import React, { useMemo, useState } from 'react'
import FlipMove from 'react-flip-move'
import styled from 'styled-components'

import { GetApplicationsQuery } from '../../generated/graphql'
import StandaloneCenter from '../StandaloneCenter'
import ApplicationCard from './ApplicationCard'
import { VerificationStatus, getStatus } from './VerificationsView'
import usePrintApplication from './hooks/usePrintApplication'

const ApplicationListCard = styled.li`
  display: flex;
  width: 100%;
  justify-content: center;
  list-style-type: none;
`

const ApplicationList = styled(FlipMove)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
`

export type Application = GetApplicationsQuery['applications'][number]

// Necessary for FlipMove, as it cannot handle functional components
export class ApplicationViewComponent extends React.Component<React.ComponentProps<typeof ApplicationCard>> {
  render() {
    return (
      <ApplicationListCard key={this.props.application.id}>
        <ApplicationCard {...this.props} />
      </ApplicationListCard>
    )
  }
}

enum ApplicationStatus {
  fullyVerified,
  fullyRejected,
  ambiguous,
}

const sortByStatus = (a: number, b: number): number => a - b
const sortByDateAsc = (a: Date, b: Date): number => a.getTime() - b.getTime()
const getApplicationStatus = (status: number[]): ApplicationStatus => {
  if (status.every(val => val === VerificationStatus.Verified)) return ApplicationStatus.fullyVerified
  if (status.every(val => val === VerificationStatus.Rejected)) return ApplicationStatus.fullyRejected
  return ApplicationStatus.ambiguous
}

// Applications will be sorted by unique status which means fully verified/rejected and within this status by creation date asc
const sortApplications = (applications: Application[]): Application[] =>
  applications
    .map(application => ({
      ...application,
      status: getApplicationStatus(application.verifications.map(getStatus)),
    }))
    .sort((a, b) => sortByStatus(a.status, b.status) || sortByDateAsc(new Date(a.createdDate), new Date(b.createdDate)))

const ApplicationsOverview = (props: { applications: Application[] }) => {
  const [updatedApplications, setUpdatedApplications] = useState(props.applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const sortedApplications = useMemo(() => sortApplications(updatedApplications), [updatedApplications])

  return (
    <>
      {updatedApplications.length > 0 ? (
        <>
          <ApplicationList>
            {sortedApplications.map(application => (
              <ApplicationViewComponent
                isSelectedForPrint={application.id === applicationIdForPrint}
                printApplicationById={printApplicationById}
                key={application.id}
                application={application}
                onDelete={() => setUpdatedApplications(sortedApplications.filter(a => a !== application))}
                onChange={application =>
                  setUpdatedApplications(sortedApplications.map(a => (a.id === application.id ? application : a)))
                }
              />
            ))}
          </ApplicationList>
        </>
      ) : (
        <StandaloneCenter>
          <NonIdealState
            title='Keine Anträge vorhanden'
            icon='clean'
            description='Aktuell liegen keine eingehenden Anträge vor. Schauen Sie später wieder vorbei.'
          />
        </StandaloneCenter>
      )}
    </>
  )
}

export default ApplicationsOverview
