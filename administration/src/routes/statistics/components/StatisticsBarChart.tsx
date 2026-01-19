import { Alert, Typography, styled } from '@mui/material'
import { BarCustomLayerProps, ResponsiveBar } from '@nivo/bar'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import AlertBox from '../../../components/AlertBox'
import { CardStatisticsResultModel } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import StatisticsBarTooltip from './StatisticsBarTooltip'

const BarContainer = styled('div')<{ height: number }>`
  height: ${props => props.height}px;
  display: flex;
  flex-direction: column;
`

const StyledLine = styled('line')(({ theme }) => ({
  stroke: theme.palette.common.black,
  strokeWidth: 1,
}))

const OVERLAP_HEIGHT = 10

const CustomAxisLines = ({
  innerWidth,
  innerHeight,
}: BarCustomLayerProps<CardStatisticsResultModel>) => (
  <>
    {/* Bottom Axis Line */}
    <StyledLine x1={0} x2={innerWidth + OVERLAP_HEIGHT} y1={innerHeight} y2={innerHeight} />
    {/* Left Axis Line */}
    <StyledLine x1={0} x2={0} y1={-OVERLAP_HEIGHT} y2={innerHeight} />
  </>
)

const StatisticsBarChart = ({
  statistic,
}: {
  statistic: CardStatisticsResultModel
}): ReactElement => {
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  const barHeight = 32
  const axisHeight = 110
  const statisticKeys = Object.keys(statistic).filter(item => item !== 'region')

  if (!cardStatistics.enabled) {
    return (
      <AlertBox
        severity='warning'
        title={t('noStatisticsAvailable')}
        description={t('noStatisticsAvailableDescription')}
      />
    )
  }

  if (statistic.cardsCreated === 0) {
    return (
      <BarContainer height={barHeight * statisticKeys.length + axisHeight}>
        <Typography variant='subtitle2'>{statistic.region}</Typography>
        <Alert severity='info' variant='outlined' sx={{ alignSelf: 'baseline', mt: 2 }}>
          {t('noDataRegionInfo')}
        </Alert>
      </BarContainer>
    )
  }

  return (
    <BarContainer height={barHeight * statisticKeys.length + axisHeight}>
      <Typography variant='subtitle2'>{statistic.region}</Typography>
      <ResponsiveBar
        /* Bar chart starts with the first row at bottom axis, so the data has to be reversed to show alphabetically */
        data={[...[statistic]]}
        tooltip={StatisticsBarTooltip}
        keys={statisticKeys}
        indexBy='region'
        margin={{ top: 20, right: 16, bottom: 40, left: 16 }}
        innerPadding={4.0}
        padding={0.2}
        enableGridY={false}
        groupMode='grouped'
        layout='horizontal'
        labelSkipWidth={40}
        colors={Object.values(cardStatistics.theme)}
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
