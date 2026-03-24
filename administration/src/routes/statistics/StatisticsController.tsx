import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'
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
import { defaultEndDate, defaultStartDate } from './constants'

type Region = NonNullable<WhoAmIQuery['me']['region']>

const ViewProjectStatistics = () => {
  const [dateStart, setDateStart] = useState(defaultStartDate.toString())
  const [dateEnd, setDateEnd] = useState(defaultEndDate.toString())
  const [cardStatisticsState, cardStatisticsQuery] = useQuery({
    query: GetCardStatisticsInProjectDocument,
    variables: { dateEnd, dateStart },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsState, cardStatisticsQuery)

  if (!cardStatisticsQueryResult.successful) {
    return cardStatisticsQueryResult.component
  }
  return (
    <StatisticsOverview
      onApplyFilter={(newDateStart: Temporal.PlainDate, newDateEnd: Temporal.PlainDate) => {
        setDateStart(newDateStart.toString())
        setDateEnd(newDateEnd.toString())
      }}
      statistics={cardStatisticsQueryResult.data.result}
    />
  )
}

const ViewRegionStatistics = ({ region }: { region: Region }) => {
  const [dateStart, setDateStart] = useState(defaultStartDate.toString())
  const [dateEnd, setDateEnd] = useState(defaultEndDate.toString())
  const [cardStatisticsState, cardStatisticsQuery] = useQuery({
    query: GetCardStatisticsInRegionDocument,
    variables: {
      dateEnd,
      dateStart,
      regionId: region.id,
    },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsState, cardStatisticsQuery)

  return !cardStatisticsQueryResult.successful ? (
    cardStatisticsQueryResult.component
  ) : (
    <StatisticsOverview
      onApplyFilter={(newDateStart: Temporal.PlainDate, newDateEnd: Temporal.PlainDate) => {
        setDateStart(newDateStart.toString())
        setDateEnd(newDateEnd.toString())
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
