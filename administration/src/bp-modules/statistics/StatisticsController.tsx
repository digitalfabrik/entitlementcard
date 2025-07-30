import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import {
  Region,
  Role,
  useGetCardStatisticsInProjectQuery,
  useGetCardStatisticsInRegionQuery,
} from '../../generated/graphql'
import AlertBox from '../../mui-modules/base/AlertBox'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StatisticsOverview from './StatisticsOverview'
import { defaultEndDate, defaultStartDate } from './constants'

const ViewProjectStatistics = () => {
  const { projectId } = useContext(ProjectConfigContext)
  const cardStatisticsQuery = useGetCardStatisticsInProjectQuery({
    variables: { projectId, dateEnd: defaultEndDate.toString(), dateStart: defaultStartDate.toString() },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsQuery)

  const applyFilter = (dateStart: string, dateEnd: string) => {
    cardStatisticsQuery.refetch({ projectId, dateEnd, dateStart })
  }

  if (!cardStatisticsQueryResult.successful) {
    return cardStatisticsQueryResult.component
  }
  return <StatisticsOverview onApplyFilter={applyFilter} statistics={cardStatisticsQueryResult.data.result} />
}

const ViewRegionStatistics = ({ region }: { region: Region }) => {
  const { projectId } = useContext(ProjectConfigContext)
  const cardStatisticsQuery = useGetCardStatisticsInRegionQuery({
    variables: {
      projectId,
      dateEnd: defaultEndDate.toString(),
      dateStart: defaultStartDate.toString(),
      regionId: region.id,
    },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsQuery)

  const applyFilter = (dateStart: string, dateEnd: string) => {
    cardStatisticsQuery.refetch({ projectId, dateEnd, dateStart, regionId: region.id })
  }

  if (!cardStatisticsQueryResult.successful) {
    return cardStatisticsQueryResult.component
  }
  return (
    <StatisticsOverview
      onApplyFilter={applyFilter}
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
  return <AlertBox severity='error' description={t('notAuthorizedToSeeStatistics')} title={t('notAuthorized')} />
}
export default StatisticsController
