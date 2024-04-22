import { ResponsiveBar } from '@nivo/bar'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CardStatisticsResultModel } from '../../generated/graphql'
import StatisticsFilterBar from './components/StatisticsFilterBar'

const OverviewContainer = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  margin-bottom: 70px;
`

type StatisticsOverviewProps = {
  statistics: CardStatisticsResultModel[]
  onApplyFilter: (dateStart: string, dateEnd: string) => void
}

const StatisticsOverview = ({ statistics, onApplyFilter }: StatisticsOverviewProps): ReactElement => {
  // TODO create own bar component with fixed height and adjusted labels, same for legend, show message for empty list
  const barHeight = 50
  const axisHeight = 90
  return (
    <OverviewContainer height={statistics.length * barHeight + axisHeight}>
      <ResponsiveBar
        data={statistics}
        keys={['Erstellte_Karten', 'Aktivierte_Karten']}
        indexBy='region'
        margin={{ top: 20, right: 200, bottom: 50, left: 270 }}
        innerPadding={2.0}
        padding={0.2}
        groupMode='grouped'
        layout='horizontal'
        colors={['#8377A9', '#c6c0d8']}
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
      <StatisticsFilterBar onApplyFilter={onApplyFilter} />
    </OverviewContainer>
  )
}

export default StatisticsOverview
