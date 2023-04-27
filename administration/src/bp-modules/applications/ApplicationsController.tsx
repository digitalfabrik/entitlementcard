import { NonIdealState } from '@blueprintjs/core'
import React, { useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Region, useGetApplicationsQuery } from '../../generated/graphql'
import useQueryHandler from '../hooks/useQueryHandler'
import ApplicationsOverview from './ApplicationsOverview'

const ApplicationsController = (props: { region: Region }) => {
  const applicationsQuery = useGetApplicationsQuery({
    variables: { regionId: props.region.id },
    onError: error => console.error(error),
  })
  const applicationsQueryResult = useQueryHandler(applicationsQuery)
  if (!applicationsQueryResult.successful) return applicationsQueryResult.component
  else return <ApplicationsOverview applications={applicationsQueryResult.data.applications} />
}

const ControllerWithRegion = () => {
  const region = useContext(WhoAmIContext).me!.region

  if (!region) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Anträge einzusehen.'
      />
    )
  } else {
    return <ApplicationsController region={region} />
  }
}

export default ControllerWithRegion
