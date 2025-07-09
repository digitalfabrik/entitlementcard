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
  margin-bottom: 62px;
`
type StatisticsBarChartProps = {
  statistic: CardStatisticsResultModel
}

const StatisticsBarChart = ({ statistic }: StatisticsBarChartProps): ReactElement | null => {
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  const barHeight = 32
  const axisHeight = 110

  if (statistic.cardsCreated === 0) {
    return null
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

  const statisticKeys = Object.keys(statistic).filter(item => item !== 'region')

  return (
    <BarContainer height={barHeight * statisticKeys.length + axisHeight}>
      <ResponsiveBar
        /* Bar chart starts with the first row at bottom axis, so the data has to be reversed to show alphabetically */
        data={[...[statistic]]}
        tooltip={StatisticsBarTooltip}
        keys={statisticKeys}
        indexBy='region'
        margin={{ top: 25, right: 50, bottom: 25, left: 50 }}
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
          axis: { legend: { text: { fontSize: 14, fontWeight: 700 } } },
          text: { fontSize: 12 },
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
