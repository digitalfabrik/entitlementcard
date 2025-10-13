import { ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
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
  const theme = useTheme()
  const { t } = useTranslation('applicationsOverview')
  return (
    <Container>
      <Typography variant='h6' sx={{ margin: 0 }}>
        {t('status')}
      </Typography>
      <ApplicationStatusHelpButton />
      <ToggleButtonGroup exclusive color='primary' value={activeBarItem} sx={{ flex: 1, flexWrap: 'wrap' }}>
        {Object.values(barItems).map(item => {
          const count = applications.reduce((count, application) => count + (item.filter(application) ? 1 : 0), 0)
          return (
            <ToggleButton
              key={item.barItemI18nKey}
              sx={{ flex: 1, textTransform: 'uppercase', color: theme.palette.text.primary }}
              value={item}
              onClick={() => onSetActiveBarItem(item)}
              id={item.barItemI18nKey}>
              {t(item.barItemI18nKey)} (<span data-testid={`status-${t(item.barItemI18nKey)}-count`}>{count}</span>)
            </ToggleButton>
          )
        })}
      </ToggleButtonGroup>
    </Container>
  )
}

export default ApplicationStatusBar
