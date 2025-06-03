import { AutoAwesome } from '@mui/icons-material'
import { Container } from '@mui/material'
import { TFunction } from 'i18next'
import React, { ReactElement, useMemo, useState } from 'react'
import FlipMove from 'react-flip-move'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { GetApplicationsQuery } from '../../generated/graphql'
import NonIdealState from '../../mui-modules/NonIdealState'
import StandaloneCenter from '../StandaloneCenter'
import ApplicationCard from './ApplicationCard'
import type { ApplicationCardProps } from './ApplicationCard'
import ApplicationStatusBar from './ApplicationStatusBar'
import { ApplicationStatusBarItemType, barItems } from './constants'
import usePrintApplication from './hooks/usePrintApplication'
import { getApplicationStatus, getVerificationStatus } from './utils'

const ApplicationList = styled(FlipMove)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
  gap: 16px;
`
export type Application = GetApplicationsQuery['applications'][number]

// Necessary for FlipMove, as it cannot handle functional components
// eslint-disable-next-line react/prefer-stateless-function
export class ApplicationViewComponent extends React.Component<ApplicationCardProps> {
  render(): ReactElement {
    const { application } = this.props
    return <ApplicationCard key={application.id} {...this.props} />
  }
}

const sortByStatus = (a: number, b: number): number => a - b
const sortByDateAsc = (a: Date, b: Date): number => a.getTime() - b.getTime()

// Applications will be sorted by status f.e. fullyVerified/fullyRejected/withdrawed/ambiguous and within this status by creation date asc
const sortApplications = (applications: Application[]): Application[] =>
  applications
    .map(application => ({
      ...application,
      status: getApplicationStatus(application.verifications.map(getVerificationStatus), !!application.withdrawalDate),
    }))
    .sort((a, b) => sortByStatus(a.status, b.status) || sortByDateAsc(new Date(a.createdDate), new Date(b.createdDate)))

const getEmptyApplicationsListStatusDescription = (activeBarItem: ApplicationStatusBarItemType, t: TFunction): string =>
  activeBarItem.status !== undefined ? `${t(activeBarItem.title).toLowerCase()}en` : ''

const ApplicationsOverview = ({ applications }: { applications: Application[] }): ReactElement => {
  const [updatedApplications, setUpdatedApplications] = useState(applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const [activeBarItem, setActiveBarItem] = useState<ApplicationStatusBarItemType>(barItems[0])
  const { t } = useTranslation('applicationsOverview')
  const sortedApplications: Application[] = useMemo(() => sortApplications(updatedApplications), [updatedApplications])
  const filteredApplications: Application[] = useMemo(
    () =>
      sortedApplications.filter(
        application =>
          activeBarItem.status === undefined ||
          getApplicationStatus(application.verifications.map(getVerificationStatus), !!application.withdrawalDate) ===
            activeBarItem.status
      ),
    [activeBarItem, sortedApplications]
  )

  return (
    <Container
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '90%',
        width: '1000px',
      }}>
      <ApplicationStatusBar
        applications={updatedApplications}
        activeBarItem={activeBarItem}
        setActiveBarItem={setActiveBarItem}
        barItems={barItems}
      />
      {filteredApplications.length > 0 ? (
        <ApplicationList>
          {filteredApplications.map(application => (
            <ApplicationViewComponent
              isSelectedForPrint={application.id === applicationIdForPrint}
              key={application.id}
              application={application}
              onPrintApplicationById={printApplicationById}
              onDelete={() => setUpdatedApplications(sortedApplications.filter(a => a !== application))}
              onChange={application =>
                setUpdatedApplications(sortedApplications.map(a => (a.id === application.id ? application : a)))
              }
            />
          ))}
        </ApplicationList>
      ) : (
        <StandaloneCenter>
          <NonIdealState
            title={t('noApplicationsOfType', { status: getEmptyApplicationsListStatusDescription(activeBarItem, t) })}
            icon={<AutoAwesome fontSize='large' />}
            description={t('noApplicationsOfTypeDescription', {
              status: getEmptyApplicationsListStatusDescription(activeBarItem, t),
            })}
          />
        </StandaloneCenter>
      )}
    </Container>
  )
}

export default ApplicationsOverview
