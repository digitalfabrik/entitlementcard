import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import AlertBox from '../../components/AlertBox'
import {
  GetCardStatisticsInProjectDocument,
  GetCardStatisticsInRegionDocument,
  Role,
  WhoAmIQuery,
} from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import getQueryResult from '../../util/getQueryResult'
import StatisticsOverview from './components/StatisticsOverview'
import { defaultStatisticsRange } from './constants'

type Region = NonNullable<WhoAmIQuery['me']['region']>

const ViewProjectStatistics = () => {
  const [dateRange, setDateRange] = useState(defaultStatisticsRange)
  const [cardStatisticsState, cardStatisticsQuery] = useQuery({
    query: GetCardStatisticsInProjectDocument,
    variables: {
      dateEnd: dateRange.end.toString(),
      dateStart: dateRange.start.toString(),
    },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsState, cardStatisticsQuery)

  if (!cardStatisticsQueryResult.successful) {
    return cardStatisticsQueryResult.component
  }
  return (
    <StatisticsOverview
      dateRange={dateRange}
      onApplyFilter={setDateRange}
      statistics={cardStatisticsQueryResult.data.result}
    />
  )
}

const ViewRegionStatistics = ({ region }: { region: Region }) => {
  const [dateRange, setDateRange] = useState(defaultStatisticsRange)
  const [cardStatisticsState, cardStatisticsQuery] = useQuery({
    query: GetCardStatisticsInRegionDocument,
    variables: {
      dateEnd: dateRange.end.toString(),
      dateStart: dateRange.start.toString(),
      regionId: region.id,
    },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsState, cardStatisticsQuery)

  return !cardStatisticsQueryResult.successful ? (
    cardStatisticsQueryResult.component
  ) : (
    <StatisticsOverview
      dateRange={dateRange}
      onApplyFilter={setDateRange}
      statistics={cardStatisticsQueryResult.data.result}
      region={region}
    />
  )
}

const StatisticsController = (): ReactElement => {
  const { role, region } = useWhoAmI().me
  const { cardStatistics } = useContext(ProjectConfigContext)
  const { t } = useTranslation('errors')

  if (role === Role.RegionAdmin && region && cardStatistics.enabled) {
    return <ViewRegionStatistics region={region} />
  }
  if (role === Role.ProjectAdmin && cardStatistics.enabled) {
    return <ViewProjectStatistics />
  }
  return (
    <AlertBox
      severity='error'
      description={t('notAuthorizedToSeeStatistics')}
      title={t('notAuthorized')}
    />
  )
}
export default StatisticsController
