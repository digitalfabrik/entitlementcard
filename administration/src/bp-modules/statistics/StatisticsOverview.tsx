import React, { ReactElement } from 'react'

import { CardStatisticsResultModel, Region } from '../../generated/graphql'
import downloadDataUri from '../../util/downloadDataUri'
import { generateCsv, getCsvFileName } from './CSVStatistics'
import StatisticsBarChart from './components/StatisticsBarChart'
import StatisticsFilterBar from './components/StatisticsFilterBar'

type StatisticsOverviewProps = {
  statistics: CardStatisticsResultModel[]
  onApplyFilter: (dateStart: string, dateEnd: string) => void
  region?: Region
}

const StatisticsOverview = ({ statistics, onApplyFilter, region }: StatisticsOverviewProps): ReactElement => {
  const exportCardDataToCsv = (dateStart: string, dateEnd: string) =>
    downloadDataUri(generateCsv(statistics), getCsvFileName(`${dateStart}_${dateEnd}`, region))

  return (
    <>
      <StatisticsBarChart statistics={statistics} />
      <StatisticsFilterBar
        onApplyFilter={onApplyFilter}
        onExportCsv={exportCardDataToCsv}
        isDataAvailable={statistics.length > 0}
      />
    </>
  )
}

export default StatisticsOverview
