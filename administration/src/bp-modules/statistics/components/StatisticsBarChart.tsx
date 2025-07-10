import { NonIdealState } from '@blueprintjs/core'
import { Alert, Box, Typography } from '@mui/material'
import { ResponsiveBar } from '@nivo/bar'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CardStatisticsResultModel } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import StatisticsBarTooltip from './StatisticsBarTooltip'

const BarContainer = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  margin-bottom: 62px;
`
type StatisticsBarChartProps = {
  statistic: CardStatisticsResultModel
}

const StatisticsBarChart = ({ statistic }: StatisticsBarChartProps): ReactElement => {
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  const barHeight = 32
  const axisHeight = 110

  const statisticKeys = Object.keys(statistic).filter(item => item !== 'region')
  if (statistic.cardsCreated === 0) {
    return (
      <BarContainer height={barHeight * statisticKeys.length + axisHeight}>
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', ml: 2 }}>
          <Typography variant='subtitle2'>{statistic.region}</Typography>
          <Alert severity='info' variant='outlined' sx={{ alignSelf: 'baseline', mt: 2 }}>
            {t('noDataRegionInfo')}
          </Alert>
        </Box>
      </BarContainer>
    )
  }

  if (!cardStatistics.enabled) {
    return (
      <NonIdealState
        icon='warning-sign'
        title={t('noStatisticsAvailable')}
        description={t('noStatisticsAvailableDescription')}
      />
    )
  }

  return (
    <BarContainer height={barHeight * statisticKeys.length + axisHeight}>
      <ResponsiveBar
        /* Bar chart starts with the first row at bottom axis, so the data has to be reversed to show alphabetically */
        data={[...[statistic]]}
        tooltip={StatisticsBarTooltip}
        keys={statisticKeys}
        indexBy='region'
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        innerPadding={4.0}
        padding={0.2}
        enableGridY={false}
        groupMode='grouped'
        layout='horizontal'
        labelSkipWidth={40}
        colors={Object.values(cardStatistics.theme)}
        axisTop={{
          legend: statistic.region,
          tickValues: 0,
          legendPosition: 'start',
        }}
        axisBottom={
          statistic.cardsCreated !== 0
            ? {
                tickSize: 6,
                tickPadding: 8,
              }
            : null
        }
        axisLeft={null}
        theme={{
          axis: { legend: { text: { fontSize: 14, fontWeight: 500, fontFamily: 'Roboto' } } },
          text: { fontSize: 12, fontFamily: 'Roboto' },
          labels: { text: { fontSize: 14, fontWeight: 700, fontFamily: 'Roboto' } },
        }}
        role='application'
        ariaLabel='Card statistics bar chart'
        barAriaLabel={e => `${e.id}: ${e.formattedValue} ${t('inRegion')}: ${e.indexValue}`}
      />
    </BarContainer>
  )
}

export default StatisticsBarChart
