import { NonIdealState } from '@blueprintjs/core'
import { Alert, Box, Typography } from '@mui/material'
import { BarCustomLayerProps, ResponsiveBar } from '@nivo/bar'
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

const CHART_MARGIN = 30
const OVERLAP_HEIGHT = 10

const CustomAxisLines = ({ innerWidth, innerHeight }: BarCustomLayerProps<CardStatisticsResultModel>) => (
  <>
    {/* Bottom Axis Line */}
    <line
      x1={0}
      x2={innerWidth + OVERLAP_HEIGHT}
      y1={innerHeight}
      y2={innerHeight}
      style={{
        stroke: '#000',
        strokeWidth: 1,
      }}
    />
    {/* Left Axis Line */}
    <line
      x1={0}
      x2={0}
      y1={CHART_MARGIN - OVERLAP_HEIGHT}
      y2={innerHeight}
      style={{
        stroke: '#000',
        strokeWidth: 1,
      }}
    />
  </>
)

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
        margin={{ top: CHART_MARGIN, right: CHART_MARGIN, bottom: CHART_MARGIN, left: CHART_MARGIN }}
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
        axisBottom={{
          tickSize: 6,
          tickPadding: 8,
        }}
        axisLeft={null}
        layers={['grid', 'axes', 'bars', CustomAxisLines, 'markers', 'legends', 'annotations']}
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
