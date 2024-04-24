import React, { ReactElement, useContext } from 'react'

import { CardStatisticsResultModel, Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import downloadDataUri from '../../util/downloadDataUri'
import { useAppToaster } from '../AppToaster'
import { CsvStatisticsError, generateCsv, getCsvFileName } from './CSVStatistics'
import StatisticsBarChart from './components/StatisticsBarChart'
import StatisticsFilterBar from './components/StatisticsFilterBar'

type StatisticsOverviewProps = {
  statistics: CardStatisticsResultModel[]
  onApplyFilter: (dateStart: string, dateEnd: string) => void
  region?: Region
}

const StatisticsOverview = ({ statistics, onApplyFilter, region }: StatisticsOverviewProps): ReactElement => {
  const appToaster = useAppToaster()
  const { cardStatistics } = useContext(ProjectConfigContext)
  const exportCardDataToCsv = (dateStart: string, dateEnd: string) => {
    try {
      downloadDataUri(generateCsv(statistics, cardStatistics), getCsvFileName(`${dateStart}_${dateEnd}`, region))
    } catch (error) {
      if (error instanceof CsvStatisticsError) {
        appToaster?.show({
          message: 'Etwas ist schiefgegangen beim Export der CSV.',
          intent: 'danger',
        })
      }
    }
  }

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
