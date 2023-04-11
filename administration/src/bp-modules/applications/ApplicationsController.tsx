import { NonIdealState, Spinner } from '@blueprintjs/core'
import React, { useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Region, useGetApplicationsQuery } from '../../generated/graphql'
import ErrorHandler from '../ErrorHandler'
import ApplicationsOverview from './ApplicationsOverview'

const ApplicationsController = (props: { region: Region }) => {
  const { loading, error, data, refetch } = useGetApplicationsQuery({
    variables: { regionId: props.region.id },
    onError: error => console.error(error),
  })
  if (loading) return <Spinner />
  else if (error || !data) return <ErrorHandler refetch={refetch} />
  else return <ApplicationsOverview applications={data.applications} />
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
