import { NonIdealState } from '@blueprintjs/core'
import React, { useMemo, useState } from 'react'
import FlipMove from 'react-flip-move'
import styled from 'styled-components'

import { GetApplicationsQuery } from '../../generated/graphql'
import StandaloneCenter from '../StandaloneCenter'
import ApplicationCard from './ApplicationCard'
import ApplicationStatusBar from './ApplicationStatusBar'
import { getStatus } from './VerificationsView'
import { ApplicationStatusBarItemType, barItems } from './constants'
import usePrintApplication from './hooks/usePrintApplication'
import { getApplicationStatus } from './utils'

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

const sortByStatus = (a: number, b: number): number => a - b
const sortByDateAsc = (a: Date, b: Date): number => a.getTime() - b.getTime()

// Applications will be sorted by status f.e. fullyVerified/fullyRejected/withdrawed/ambiguous and within this status by creation date asc
const sortApplications = (applications: Application[]): Application[] =>
  applications
    .map(application => ({
      ...application,
      status: getApplicationStatus(application.verifications.map(getStatus), !!application.withdrawalDate),
    }))
    .sort((a, b) => sortByStatus(a.status, b.status) || sortByDateAsc(new Date(a.createdDate), new Date(b.createdDate)))

const ApplicationsOverview = (props: { applications: Application[] }) => {
  const [updatedApplications, setUpdatedApplications] = useState(props.applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const [activeBarItem, setActiveBarItem] = useState<ApplicationStatusBarItemType>(barItems[0])
  const sortedApplications: Application[] = useMemo(() => sortApplications(updatedApplications), [updatedApplications])
  const filteredApplications: Application[] = useMemo(
    () =>
      sortedApplications.filter(application => {
        if (activeBarItem.status === undefined) return application
        return (
          getApplicationStatus(application.verifications.map(getStatus), !!application.withdrawalDate) ===
          activeBarItem.status
        )
      }),
    [activeBarItem, sortedApplications]
  )

  return (
    <>
      <ApplicationStatusBar
        applications={updatedApplications}
        activeBarItem={activeBarItem}
        setActiveBarItem={setActiveBarItem}
        barItems={barItems}
      />
      {filteredApplications.length > 0 ? (
        <>
          <ApplicationList>
            {filteredApplications.map(application => (
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
