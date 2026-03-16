import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'

import AlertBox from '../../components/AlertBox'
import {
  Region,
  Role,
  useGetCardStatisticsInProjectQuery,
  useGetCardStatisticsInRegionQuery,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import getQueryResult from '../../util/getQueryResult'
import StatisticsOverview from './components/StatisticsOverview'
import { defaultEndDate, defaultStartDate } from './constants'

const ViewProjectStatistics = () => {
  const cardStatisticsQuery = useGetCardStatisticsInProjectQuery({
    variables: { dateEnd: defaultEndDate.toString(), dateStart: defaultStartDate.toString() },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsQuery)

  if (!cardStatisticsQueryResult.successful) {
    return cardStatisticsQueryResult.component
  }
  return (
    <StatisticsOverview
      onApplyFilter={(dateStart: Temporal.PlainDate, dateEnd: Temporal.PlainDate) => {
        cardStatisticsQuery.refetch({
          dateStart: dateStart.toString(),
          dateEnd: dateEnd.toString(),
        })
      }}
      statistics={cardStatisticsQueryResult.data.result}
    />
  )
}

const ViewRegionStatistics = ({ region }: { region: Region }) => {
  const cardStatisticsQuery = useGetCardStatisticsInRegionQuery({
    variables: {
      dateEnd: defaultEndDate.toString(),
      dateStart: defaultStartDate.toString(),
      regionId: region.id,
    },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsQuery)

  if (!cardStatisticsQueryResult.successful) {
    return cardStatisticsQueryResult.component
  }
  return (
    <StatisticsOverview
      onApplyFilter={(dateStart: Temporal.PlainDate, dateEnd: Temporal.PlainDate) => {
        cardStatisticsQuery.refetch({
          dateStart: dateStart.toString(),
          dateEnd: dateEnd.toString(),
          regionId: region.id,
        })
      }}
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
