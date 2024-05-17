import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import ApplicationStatusHelpButton from './ApplicationStatusBarHelpButton'
import ApplicationStatusBarItem from './ApplicationStatusBarItem'
import { Application } from './ApplicationsOverview'
import { getStatus } from './VerificationsView'
import { ApplicationStatus } from './constants'
import { getApplicationStatus } from './utils'

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  max-width: 90%;
  width: 1000px;
  align-self: center;
`
const BarItemContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-evenly;
  border: 1px solid #8f99a84d;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(17, 20, 24, 0.1), 0 1px 1px rgba(17, 20, 24, 0.2);

  > * {
    &:not(:first-child) {
      border-left: 1px solid #585858;
    }
  }
`
const Title = styled.span`
  font-size: 20px;
  font-weight: bold;
`

export type ApplicationStatusBarItemType = {
  title: string
  status?: ApplicationStatus
}

const barItems: ApplicationStatusBarItemType[] = [
  {
    title: 'Alle Anträge',
    status: undefined,
  },
  {
    title: 'Offen',
    status: ApplicationStatus.ambiguous,
  },
  {
    title: 'Akzeptiert',
    status: ApplicationStatus.fullyVerified,
  },
  {
    title: 'Abgelehnt',
    status: ApplicationStatus.fullyRejected,
  },
  {
    title: 'Zurückgezogen',
    status: ApplicationStatus.withdrawed,
  },
]

type ApplicationStatusBarProps = {
  applications: Application[]
  filterApplications: (status?: ApplicationStatus) => void
}

const getApplicationCount = (applications: Application[], status?: ApplicationStatus): number => {
  if (status === undefined) {
    return applications.length
  }
  return applications.filter(
    application =>
      getApplicationStatus(application.verifications.map(getStatus), !!application.withdrawalDate) === status
  ).length
}

const ApplicationStatusBar = ({ applications, filterApplications }: ApplicationStatusBarProps): ReactElement => {
  const defaultActiveBarItem = barItems[0]
  const [activeBarItem, setActiveBarItem] = useState<ApplicationStatusBarItemType>(defaultActiveBarItem)

  return (
    <Container>
      <Title>Status</Title>
      <ApplicationStatusHelpButton />
      <BarItemContainer>
        {barItems.map(item => (
          <ApplicationStatusBarItem
            count={getApplicationCount(applications, item.status)}
            item={item}
            filterApplications={filterApplications}
            setActiveBarItem={setActiveBarItem}
            active={item === activeBarItem}
          />
        ))}
      </BarItemContainer>
    </Container>
  )
}

export default ApplicationStatusBar
