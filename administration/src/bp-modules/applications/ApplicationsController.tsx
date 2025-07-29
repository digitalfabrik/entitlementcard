import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Region, Role, useGetApplicationsQuery } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import ApplicationsOverview from './ApplicationsOverview'

const ApplicationsController = ({ region }: { region: Region }) => {
  const applicationsQuery = useGetApplicationsQuery({
    variables: { regionId: region.id },
    onError: error => console.error(error),
  })
  const applicationsQueryResult = getQueryResult(applicationsQuery)
  if (!applicationsQueryResult.successful) {
    return applicationsQueryResult.component
  }
  return <ApplicationsOverview applications={applicationsQueryResult.data.applications} />
}

const ControllerWithRegion = (): ReactElement => {
  const region = useWhoAmI().me.region
  const { t } = useTranslation('errors')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('notAuthorizedToSeeApplications') }}>
      <ApplicationsController region={region!} />
    </RenderGuard>
  )
}

export default ControllerWithRegion
