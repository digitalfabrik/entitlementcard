import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ApplicationStatusHelpButton from './ApplicationStatusBarHelpButton'
import type { Application, ApplicationStatusBarItemType } from './types'

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

const ItemContainer = styled.button<{ $active: boolean }>`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 12px;
  text-transform: uppercase;
  border: none;
  background-color: transparent;
  font-weight: bold;
  cursor: pointer;

  :hover {
    background: #8f99a826;
  }

  ${props => (props.$active ? 'background:#8f99a84d' : '')};
`

const ApplicationStatusBarItem = ({
  item,
  active,
  count,
  onSetActiveBarItem,
}: {
  item: ApplicationStatusBarItemType
  active: boolean
  count: number
  onSetActiveBarItem: (item: ApplicationStatusBarItemType) => void
}): ReactElement => {
  const { i18nKey } = item
  const { t } = useTranslation('applicationsOverview')

  return (
    <ItemContainer onClick={() => onSetActiveBarItem(item)} id={i18nKey} $active={active}>
      {t(i18nKey)}(<span data-testid={`status-${t(i18nKey)}-count`}>{count}</span>)
    </ItemContainer>
  )
}

const ApplicationStatusBar = ({
  applications,
  activeBarItem,
  barItems,
  onSetActiveBarItem,
}: {
  applications: Application[]
  barItems: ApplicationStatusBarItemType[]
  activeBarItem: ApplicationStatusBarItemType
  onSetActiveBarItem: (item: ApplicationStatusBarItemType) => void
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  return (
    <Container>
      <Title>{t('status')}</Title>
      <ApplicationStatusHelpButton />
      <BarItemContainer>
        {barItems.map(item => (
          <ApplicationStatusBarItem
            key={item.i18nKey}
            count={applications.reduce((count, application) => count + (item.filter(application) ? 1 : 0), 0)}
            item={item}
            active={item === activeBarItem}
            onSetActiveBarItem={onSetActiveBarItem}
          />
        ))}
      </BarItemContainer>
    </Container>
  )
}

export default ApplicationStatusBar
