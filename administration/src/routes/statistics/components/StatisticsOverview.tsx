import { Box, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import RenderGuard from '../../../components/RenderGuard'
import { CardStatisticsResultModel, Role } from '../../../graphql'
import { ProjectConfigContext } from '../../../provider/ProjectConfigContext'
import { WhoAmIContextType } from '../../../provider/WhoAmIProvider'
import downloadDataUri from '../../../util/downloadDataUri'
import { type StatisticsRange } from '../constants'
import { csvFileName, generateCsv } from '../utils/csvStatistics'
import StatisticsBarChart from './StatisticsBarChart'
import StatisticsFilterBar from './StatisticsFilterBar'
import StatisticsLegend from './StatisticsLegend'
import StatisticsTotalCardsCount from './StatisticsTotalCardsCount'

const StatisticsOverview = ({
  dateRange,
  statistics,
  onApplyFilter,
  region,
}: {
  dateRange: StatisticsRange
  statistics: readonly CardStatisticsResultModel[]
  onApplyFilter: (range: StatisticsRange) => void
  region?: NonNullable<NonNullable<WhoAmIContextType['me']>['region']>
}): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('statistics')
  // TODO Devise another way to derive these keys
  const statisticKeys = Object.keys(statistics[0]).filter(
    item => item !== 'region' && item !== '__typename',
  )
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
          }}
        >
          {statistics.map(statistic => (
            <StatisticsBarChart key={statistic.region} statistic={statistic} />
          ))}
        </Box>
        {cardStatistics.enabled && (
          <StatisticsLegend items={statisticKeys} statisticsTheme={cardStatistics.theme} />
        )}
      </Stack>

      <StatisticsFilterBar
        dateRange={dateRange}
        onApplyFilter={onApplyFilter}
        onExportCsv={range => {
          try {
            downloadDataUri(
              generateCsv(statistics, cardStatistics),
              csvFileName(range.start, range.end, region),
            )
          } catch {
            enqueueSnackbar(t('exportCsvNotPossible'), { variant: 'error' })
          }
        }}
        isDataAvailable={statistics.length > 0}
      />
    </>
  )
}

export default StatisticsOverview
