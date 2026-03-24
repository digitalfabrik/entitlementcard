import { Stack } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import RenderGuard from '../../components/RenderGuard'
import { GetApplicationsDocument, Role, WhoAmIQuery } from '../../graphql'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import getQueryResult from '../../util/getQueryResult'
import ApplicationsOverview from './ApplicationsOverview'
import { parseApplication } from './utils/application'

type Region = NonNullable<WhoAmIQuery['me']['region']>

const ApplicationsController = ({ region }: { region: Region }) => {
  const [applicationsState, reexecuteApplications] = useQuery({
    query: GetApplicationsDocument,
    variables: { regionId: region.id },
  })
  const applicationsQueryResult = getQueryResult(applicationsState, reexecuteApplications)

  return !applicationsQueryResult.successful ? (
    applicationsQueryResult.component
  ) : (
    <ApplicationsOverview
      applications={applicationsQueryResult.data.applications.map(parseApplication)}
    />
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
      }}
    >
      <RenderGuard
        allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
        condition={region !== null}
        error={{ description: t('notAuthorizedToSeeApplications') }}
      >
        <ApplicationsController region={region!} />
      </RenderGuard>
    </Stack>
  )
}

export default ControllerWithRegion
