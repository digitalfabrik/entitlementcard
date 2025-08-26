import { Stack } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Region, Role, useGetApplicationsQuery } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { parseApplication } from '../../shared/application'
import ApplicationsOverview from './ApplicationsOverview'

const ApplicationsController = ({ region }: { region: Region }) => {
  const applicationsQuery = useGetApplicationsQuery({
    variables: { regionId: region.id },
    onError: error => console.error(error),
  })
  const applicationsQueryResult = getQueryResult(applicationsQuery)

  return !applicationsQueryResult.successful ? (
    applicationsQueryResult.component
  ) : (
    <ApplicationsOverview applications={applicationsQueryResult.data.applications.map(parseApplication)} />
  )
}

const ControllerWithRegion = (): ReactElement => {
  const region = useWhoAmI().me.region
  const { t } = useTranslation('errors')

  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: 'safe center',
        alignItems: 'center',
        padding: 2,
        overflow: 'auto',
        '@media print': { overflow: 'visible' },
      }}>
      <RenderGuard
        allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
        condition={region !== undefined}
        error={{ description: t('notAuthorizedToSeeApplications') }}>
        <ApplicationsController region={region!} />
      </RenderGuard>
    </Stack>
  )
}

export default ControllerWithRegion
