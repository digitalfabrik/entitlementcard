import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ApplicationStatusHelpButton from './ApplicationStatusBarHelpButton'
import ApplicationStatusBarItem from './ApplicationStatusBarItem'
import { ApplicationStatusBarItemType, ApplicationVerificationStatus, GetApplicationsType } from './types'
import { applicationEffectiveStatus } from './utils'

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
  @media print {
    display: none;
  }
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

const applicationsWithStatusCount = (
  applications: GetApplicationsType[],
  status?: ApplicationVerificationStatus
): number =>
  status === undefined
    ? applications.length
    : applications.reduce((count, a) => count + (applicationEffectiveStatus(a) === status ? 1 : 0), 0)

type ApplicationStatusBarProps = {
  applications: GetApplicationsType[]
  barItems: ApplicationStatusBarItemType[]
  activeBarItem: ApplicationStatusBarItemType
  setActiveBarItem: (item: ApplicationStatusBarItemType) => void
}

const ApplicationStatusBar = ({
  applications,
  activeBarItem,
  barItems,
  setActiveBarItem,
}: ApplicationStatusBarProps): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  return (
    <Container>
      <Title>{t('status')}</Title>
      <ApplicationStatusHelpButton />
      <BarItemContainer>
        {barItems.map(item => (
          <ApplicationStatusBarItem
            key={item.title}
            count={applicationsWithStatusCount(applications, item.status)}
            item={item}
            setActiveBarItem={setActiveBarItem}
            active={item === activeBarItem}
          />
        ))}
      </BarItemContainer>
    </Container>
  )
}

export default ApplicationStatusBar
