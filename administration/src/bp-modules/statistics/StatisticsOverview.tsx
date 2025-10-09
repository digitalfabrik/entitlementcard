import { Box, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { CardStatisticsResultModel, Region, Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import downloadDataUri from '../../util/downloadDataUri'
import { generateCsv, getCsvFileName } from './CSVStatistics'
import StatisticsBarChart from './components/StatisticsBarChart'
import StatisticsFilterBar from './components/StatisticsFilterBar'
import StatisticsLegend from './components/StatisticsLegend'
import StatisticsTotalCardsCount from './components/StatisticsTotalCardsCount'

const StatisticsOverview = ({
  statistics,
  onApplyFilter,
  region,
}: {
  statistics: CardStatisticsResultModel[]
  onApplyFilter: (dateStart: string, dateEnd: string) => void
  region?: Region
}): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  const exportCardDataToCsv = (dateStart: string, dateEnd: string) => {
    try {
      downloadDataUri(generateCsv(statistics, cardStatistics), getCsvFileName(`${dateStart}_${dateEnd}`, region))
    } catch {
      enqueueSnackbar(t('exportCsvNotPossible'), { variant: 'error' })
    }
  }
  const statisticKeys = Object.keys(statistics[0]).filter(item => item !== 'region')
  const isSingleChartView = statistics.length === 1

  return (
    <>
      <RenderGuard allowedRoles={[Role.ProjectAdmin]}>
        <StatisticsTotalCardsCount statistics={statistics} />
      </RenderGuard>
      <Stack sx={{ flexGrow: 1, overflow: 'auto', padding: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isSingleChartView ? '1fr' : '1fr 1fr',
            flexGrow: 1,
            alignItems: 'center',
            marginRight: '330px',
            gap: 6,
          }}>
          {statistics.map(statistic => (
            <StatisticsBarChart key={statistic.region} statistic={statistic} />
          ))}
        </Box>
        {cardStatistics.enabled && <StatisticsLegend items={statisticKeys} statisticsTheme={cardStatistics.theme} />}
      </Stack>
      <StatisticsFilterBar
        onApplyFilter={onApplyFilter}
        onExportCsv={exportCardDataToCsv}
        isDataAvailable={statistics.length > 0}
      />
    </>
  )
}

export default StatisticsOverview
