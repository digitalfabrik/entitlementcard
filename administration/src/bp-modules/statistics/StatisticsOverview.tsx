import React, { ReactElement } from 'react'

import { CardStatisticsResultModel } from '../../generated/graphql'
import StatisticsBarChart from './components/StatisticsBarChart'
import StatisticsFilterBar from './components/StatisticsFilterBar'

type StatisticsOverviewProps = {
  statistics: CardStatisticsResultModel[]
  onApplyFilter: (dateStart: string, dateEnd: string) => void

}

const exportCardDataToCsv = () => {

}

const StatisticsOverview = ({ statistics, onApplyFilter}: StatisticsOverviewProps): ReactElement => {

  return (
    <>
      <StatisticsBarChart statistics={statistics} />
      <StatisticsFilterBar onApplyFilter={onApplyFilter} onExportCsv={exportCardDataToCsv} isDataAvailable={statistics.length>0}/>
    </>
  )
}

export default StatisticsOverview
