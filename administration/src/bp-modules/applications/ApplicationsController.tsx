import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Region, useGetApplicationsQuery } from '../../generated/graphql'
import getQueryResult from '../util/getQueryResult'
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
  const region = useContext(WhoAmIContext).me!.region

  if (!region) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Anträge einzusehen.'
      />
    )
  }
  return <ApplicationsController region={region} />
}

export default ControllerWithRegion
