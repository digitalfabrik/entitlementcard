import { NonIdealState } from '@blueprintjs/core'
import { ResponsiveBar } from '@nivo/bar'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CardStatisticsResultModel } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import StatisticsBarTooltip from './StatisticsBarTooltip'

const BarContainer = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  margin-bottom: 70px;
`
type StatisticsBarChartProps = {
  statistic: CardStatisticsResultModel
}

const StatisticsBarChart = ({ statistic }: StatisticsBarChartProps): ReactElement => {
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  const barHeight = 32
  const axisHeight = 90

  if (!cardStatistics.enabled) {
    return (
      <NonIdealState
        icon='warning-sign'
        title={t('noStatisticsAvailable')}
        description={t('noStatisticsAvailableDescription')}
      />
    )
  }

  const statisticKeys = Object.keys(statistic).filter(item => item !== 'region')

  return (
    <BarContainer key={statistic.region} height={barHeight * 2 + axisHeight}>
      <ResponsiveBar
        /* Bar chart starts with the first row at bottom axis, so the data has to be reversed to show alphabetically */
        data={[...[statistic]]}
        tooltip={StatisticsBarTooltip}
        keys={[statisticKeys[0], statisticKeys[1]]}
        indexBy='region'
        margin={{ top: 25, right: 50, bottom: 25, left: 50 }}
        innerPadding={2.0}
        padding={0.2}
        groupMode='grouped'
        layout='horizontal'
        colors={[cardStatistics.theme.primaryColor, cardStatistics.theme.primaryColorLight]}
        axisTop={{
          legend: statistic.region,
          tickValues: 0,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legendPosition: 'middle',
          legendOffset: 44,
        }}
        axisLeft={null}
        theme={{
          axis: { legend: { text: { fontSize: 14, fontWeight: 700 } } },
          text: { fontSize: 14 },
          labels: { text: { fontSize: 14, fontWeight: 700 } },
        }}
        role='application'
        ariaLabel='Card statistics bar chart'
        barAriaLabel={e => `${e.id}: ${e.formattedValue} ${t('inRegion')}: ${e.indexValue}`}
      />
    </BarContainer>
  )
}

export default StatisticsBarChart
