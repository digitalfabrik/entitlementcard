import { NonIdealState } from '@blueprintjs/core'
import { ResponsiveBar } from '@nivo/bar'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import { CardStatisticsResultModel } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'

const BarContainer = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  margin-bottom: 70px;
`
type StatisticsBarChartProps = {
  statistics: CardStatisticsResultModel[]
}

const StatisticsBarChart = ({ statistics }: StatisticsBarChartProps): ReactElement => {
  const { cardStatistics } = useContext(ProjectConfigContext)
  const barHeight = 50
  const axisHeight = 90

  if (statistics.length === 0 || !cardStatistics.enabled) {
    return (
      <NonIdealState
        icon='warning-sign'
        title='Keine Statistiken vorhanden'
        description='Es wurden keine Statistiken für Sie gefunden.'
      />
    )
  }

  const statisticKeys = Object.keys(statistics[0])
  return (
    <BarContainer height={statistics.length * barHeight + axisHeight}>
      <ResponsiveBar
        data={statistics}
        keys={[statisticKeys[1], statisticKeys[2]]}
        indexBy='region'
        margin={{ top: 20, right: 300, bottom: 50, left: 300 }}
        innerPadding={2.0}
        padding={0.2}
        groupMode='grouped'
        layout='horizontal'
        colors={[cardStatistics.theme.primaryColor, cardStatistics.theme.primaryColorLight]}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Anzahl',
          legendPosition: 'middle',
          legendOffset: 44,
        }}
        axisLeft={{
          tickSize: 10,
          tickPadding: 5,
          legend: 'Region',
          legendOffset: -180,
          legendPosition: 'middle',
        }}
        theme={{
          axis: { legend: { text: { fontSize: 14, fontWeight: 700 } } },
          text: { fontSize: 14 },
          labels: { text: { fontSize: 14, fontWeight: 700 } },
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 140,
            translateY: 54,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 30,
            itemDirection: 'left-to-right',
            symbolSize: 20,
          },
        ]}
        role='application'
        ariaLabel='Card statistics bar chart'
        barAriaLabel={e => `${e.id}: ${e.formattedValue} in Region: ${e.indexValue}`}
      />
    </BarContainer>
  )
}

export default StatisticsBarChart
