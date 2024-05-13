import React, { ReactElement, useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { CardStatisticsResultModel, Role } from '../../generated/graphql'
import StatisticsBarChart from './components/StatisticsBarChart'
import StatisticsFilterBar from './components/StatisticsFilterBar'
import StatisticsTotalCardsCount from './components/StatisticsTotalCardsCount'

type StatisticsOverviewProps = {
  statistics: CardStatisticsResultModel[]
  onApplyFilter: (dateStart: string, dateEnd: string) => void
}

const StatisticsOverview = ({ statistics, onApplyFilter }: StatisticsOverviewProps): ReactElement => {
  const { role } = useContext(WhoAmIContext).me!
  return (
    <>
      {role === Role.ProjectAdmin && <StatisticsTotalCardsCount statistics={statistics} />}
      <StatisticsBarChart statistics={statistics} />
      <StatisticsFilterBar onApplyFilter={onApplyFilter} />
    </>
  )
}

export default StatisticsOverview
