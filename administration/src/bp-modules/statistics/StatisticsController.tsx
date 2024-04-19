import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role, useGetCardStatisticsInProjectByRegionQuery } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import PlainDate from '../../util/PlainDate'
import getQueryResult from '../util/getQueryResult'
import StatisticsOverview from './StatisticsOverview'

export const defaultStartDate = PlainDate.fromLocalDate(
  new Date(new Date().setFullYear(new Date().getFullYear() - 1))
).toString()
const StatisticsController = (): ReactElement => {
  const { role } = useContext(WhoAmIContext).me!
  const { projectId } = useContext(ProjectConfigContext)
  const cardStatisticsQuery = useGetCardStatisticsInProjectByRegionQuery({
    variables: { projectId, dateEnd: PlainDate.fromLocalDate(new Date()).toString(), dateStart: defaultStartDate },
  })
  const cardStatisticsQueryResult = getQueryResult(cardStatisticsQuery)

  const applyFilter = (dateStart: string, dateEnd: string) => {
    cardStatisticsQuery.refetch({ projectId, dateEnd, dateStart })
  }

  if (!cardStatisticsQueryResult.successful) return cardStatisticsQueryResult.component
  else if (role === Role.RegionAdmin || role === Role.ProjectAdmin) {
    return <StatisticsOverview onApplyFilter={applyFilter} statistics={cardStatisticsQueryResult.data.result} />
  } else {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Statistiken einzusehen.'
      />
    )
  }
}

export default StatisticsController
