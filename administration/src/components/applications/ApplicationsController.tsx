import React, { useContext } from 'react'
import { Button, Card, H3, Spinner } from '@blueprintjs/core'
import { useQuery } from '@apollo/client'
import { RegionContext } from '../../RegionProvider'
import ApplicationsOverview from './ApplicationsOverview'
import {
  GetApplicationsDocument,
  GetApplicationsQuery,
  GetApplicationsQueryVariables,
  Region,
} from '../../generated/graphql'

const ApplicationsController = (props: { region: Region; token: string }) => {
  const { loading, error, data, refetch } = useQuery<GetApplicationsQuery, GetApplicationsQueryVariables>(
    GetApplicationsDocument,
    { variables: { regionId: props.region.id }, onError: error => console.error(error) }
  )
  if (loading) return <Spinner />
  else if (error || !data)
    return (
      <Card>
        <H3>Ein Fehler ist aufgetreten.</H3>
        <Button intent='primary' onClick={() => refetch()}>
          Erneut versuchen
        </Button>
      </Card>
    )
  else return <ApplicationsOverview applications={data.applications} token={props.token} />
}

const ControllerWithRegion = (props: { token: string }) => {
  const region = useContext(RegionContext)

  if (region === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Sie sind nicht berechtigt, Anträge einzusehen.</p>
      </div>
    )
  } else {
    return <ApplicationsController region={region} token={props.token} />
  }
}

export default ControllerWithRegion
