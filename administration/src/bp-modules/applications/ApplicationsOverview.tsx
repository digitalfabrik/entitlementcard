import { AutoAwesome } from '@mui/icons-material'
import { Container } from '@mui/material'
import { TFunction } from 'i18next'
import React, { ReactElement, useMemo, useState } from 'react'
import FlipMove from 'react-flip-move'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import NonIdealState from '../../mui-modules/NonIdealState'
import StandaloneCenter from '../StandaloneCenter'
import ApplicationCard from './ApplicationCard'
import type { ApplicationCardProps } from './ApplicationCard'
import ApplicationStatusBar from './ApplicationStatusBar'
import usePrintApplication from './hooks/usePrintApplication'
import { ApplicationStatus, ApplicationStatusBarItemType, GetApplicationsType } from './types'
import { getApplicationStatus } from './utils'

export const barItems: ApplicationStatusBarItemType[] = [
  {
    title: 'allApplications',
    status: undefined,
  },
  {
    title: 'accepted',
    status: ApplicationStatus.fullyVerified,
  },
  {
    title: 'rejected',
    status: ApplicationStatus.fullyRejected,
  },
  {
    title: 'withdrawed',
    status: ApplicationStatus.withdrawed,
  },
  {
    title: 'open',
    status: ApplicationStatus.ambiguous,
  },
]

const ApplicationList = styled(FlipMove)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
  gap: 16px;
`

// Necessary for FlipMove, as it cannot handle functional components
// eslint-disable-next-line react/prefer-stateless-function
export class ApplicationViewComponent extends React.Component<ApplicationCardProps> {
  render(): ReactElement {
    const { application } = this.props
    return <ApplicationCard key={application.id} {...this.props} />
  }
}

/** Sort Applications by status creation date ascending. */
const sortApplications = (a: GetApplicationsType, b: GetApplicationsType): number =>
  // Sort by status
  getApplicationStatus(a) - getApplicationStatus(b) ||
  // If status is equal, sort by date
  new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()

const getEmptyApplicationsListStatusDescription = (activeBarItem: ApplicationStatusBarItemType, t: TFunction): string =>
  activeBarItem.status !== undefined ? `${t(activeBarItem.title).toLowerCase()}en` : ''

const ApplicationsOverview = ({ applications }: { applications: GetApplicationsType[] }): ReactElement => {
  const [updatedApplications, setUpdatedApplications] = useState(applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const [activeBarItem, setActiveBarItem] = useState<ApplicationStatusBarItemType>(barItems[0])
  const { t } = useTranslation('applicationsOverview')
  const sortedApplications: GetApplicationsType[] = useMemo(
    () => updatedApplications.toSorted(sortApplications),
    [updatedApplications]
  )
  const filteredApplications: GetApplicationsType[] = useMemo(
    () =>
      sortedApplications.filter(
        application => activeBarItem.status === undefined || getApplicationStatus(application) === activeBarItem.status
      ),
    [activeBarItem, sortedApplications]
  )

  return (
    <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', maxWidth: '90%', width: '1000px' }}>
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
