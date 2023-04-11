import React, { useContext } from 'react'
import { NonIdealState, Spinner } from '@blueprintjs/core'
import { WhoAmIContext } from '../../WhoAmIProvider'
import ApplicationsOverview from './ApplicationsOverview'
import { Region, useGetApplicationsQuery } from '../../generated/graphql'
import ErrorHandler from '../ErrorHandler'

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