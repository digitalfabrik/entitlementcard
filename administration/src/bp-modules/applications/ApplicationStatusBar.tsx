import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
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

const ApplicationStatusBarItem = ({
  item,
  count,
  onSetActiveBarItem,
}: {
  item: ApplicationStatusBarItemType
  count: number
  onSetActiveBarItem: (item: ApplicationStatusBarItemType) => void
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <ToggleButton
      sx={{
        flex: 1,
        textTransform: 'uppercase',
      }}
      value={item}
      onClick={() => onSetActiveBarItem(item)}
      id={item.barItemI18nKey}>
      {t(item.barItemI18nKey)} (<span data-testid={`status-${t(item.barItemI18nKey)}-count`}>{count}</span>)
    </ToggleButton>
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
      <Typography variant='h6' sx={{ margin: 0 }}>
        {t('status')}
      </Typography>
      <ApplicationStatusHelpButton />
      <ToggleButtonGroup value={activeBarItem} sx={{ flex: 1, flexWrap: 'wrap' }} exclusive>
        {Object.values(barItems).map(item => (
          <ApplicationStatusBarItem
            key={item.barItemI18nKey}
            count={applications.reduce((count, application) => count + (item.filter(application) ? 1 : 0), 0)}
            item={item}
            onSetActiveBarItem={onSetActiveBarItem}
          />
        ))}
      </ToggleButtonGroup>
    </Container>
  )
}

export default ApplicationStatusBar
