import { Stack } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { StatisticsTheme } from '../../../project-configs/getProjectConfig'

const ColorIndicator = styled('div')(props => ({
  backgroundColor: props.color,
  flexShrink: 0,
  width: 30,
  height: 30,
}))

const StatisticsLegend = ({
  items,
  statisticsTheme,
}: {
  items: string[]
  statisticsTheme: StatisticsTheme
}): ReactElement | null => {
  const { t } = useTranslation('statistics')
  const indicatorColors = Object.values(statisticsTheme)

  return (
    <Stack sx={{ width: 280, gap: 2, position: 'fixed', right: 32, bottom: 96 }}>
      {items.map((item, index) => (
        <Stack key={item} sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <ColorIndicator color={indicatorColors[index]} />
          {t(item)}
        </Stack>
      ))}
    </Stack>
  )
}

export default StatisticsLegend
