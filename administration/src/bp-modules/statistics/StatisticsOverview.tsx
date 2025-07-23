import { Box, styled } from '@mui/system'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { CardStatisticsResultModel, Region, Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import downloadDataUri from '../../util/downloadDataUri'
import { useAppToaster } from '../AppToaster'
import { generateCsv, getCsvFileName } from './CSVStatistics'
import StatisticsBarChart from './components/StatisticsBarChart'
import StatisticsFilterBar from './components/StatisticsFilterBar'
import StatisticsLegend from './components/StatisticsLegend'
import StatisticsTotalCardsCount from './components/StatisticsTotalCardsCount'

type StatisticsOverviewProps = {
  statistics: CardStatisticsResultModel[]
  onApplyFilter: (dateStart: string, dateEnd: string) => void
  region?: Region
}

const OuterGrid = styled('div')`
  display: grid;
  grid-template-columns: 3fr 1fr;
`

const StatisticsOverview = ({ statistics, onApplyFilter, region }: StatisticsOverviewProps): ReactElement => {
  const appToaster = useAppToaster()
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  const exportCardDataToCsv = (dateStart: string, dateEnd: string) => {
    try {
      downloadDataUri(generateCsv(statistics, cardStatistics), getCsvFileName(`${dateStart}_${dateEnd}`, region))
    } catch {
      appToaster?.show({
        message: t('exportCsvNotPossible'),
        intent: 'danger',
      })
    }
  }

  const statisticKeys = Object.keys(statistics[0]).filter(item => item !== 'region')
  const isSingleChartView = statistics.length === 1

  return (
    <>
      <RenderGuard allowedRoles={[Role.ProjectAdmin]}>
        <StatisticsTotalCardsCount statistics={statistics} />
      </RenderGuard>
      <OuterGrid>
        <Box sx={{ display: 'grid', gridTemplateColumns: isSingleChartView ? '1fr' : '1fr 1fr' }}>
          {statistics.map(statistic => (
            <StatisticsBarChart key={statistic.region} statistic={statistic} />
          ))}
        </Box>
        <StatisticsLegend items={statisticKeys} />
      </OuterGrid>
      <StatisticsFilterBar
        onApplyFilter={onApplyFilter}
        onExportCsv={exportCardDataToCsv}
        isDataAvailable={statistics.length > 0}
      />
    </>
  )
}

export default StatisticsOverview
