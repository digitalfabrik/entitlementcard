import { Box, Typography, styled } from '@mui/material'
import { BarTooltipProps } from '@nivo/bar'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CardStatisticsResultModel } from '../../../generated/graphql'

export const ToolTipContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  width: 'fit-content',
  justifyContent: 'space-between',
  marginLeft: '50%',
}))

const StatisticsBarTooltip = ({
  id,
  color,
  value,
}: BarTooltipProps<CardStatisticsResultModel>): ReactElement => {
  const { t } = useTranslation('statistics')
  return (
    <ToolTipContainer>
      <Box>
        <Box sx={{ backgroundColor: color, height: 30, width: 30 }} color={color} />{' '}
      </Box>
      <Typography component='div'>{t(id.toString())}:</Typography>{' '}
      <Typography variant='body2bold' component='span'>
        {value}
      </Typography>
    </ToolTipContainer>
  )
}

export default StatisticsBarTooltip
