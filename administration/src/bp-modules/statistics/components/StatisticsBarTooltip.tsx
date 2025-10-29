import { Box, Typography, styled } from '@mui/material'
import { BarTooltipProps } from '@nivo/bar'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CardStatisticsResultModel } from '../../../generated/graphql'

const ToolTipContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  width: 250,
  justifyContent: 'space-between',
}))

const StatisticsBarTooltip = ({ id, color, value }: BarTooltipProps<CardStatisticsResultModel>): ReactElement => {
  const { t } = useTranslation('statistics')
  return (
    <ToolTipContainer>
      <Box sx={{ backgroundColor: color, height: 32, maxHeigh: 32, flex: '1 1 32px' }} color={color} />{' '}
      <Typography component='div'>{t(id.toString())}:</Typography>{' '}
      <Typography variant='body2bold' component='span' sx={{ flex: '0 1 60%' }}>
        {value}
      </Typography>
    </ToolTipContainer>
  )
}

export default StatisticsBarTooltip
