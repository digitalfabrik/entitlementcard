import React, { useContext } from 'react'
import { NonIdealState, Spinner } from '@blueprintjs/core'

import { useGetApplicationQuery } from '../../generated/graphql'
import ErrorHandler from '../../ErrorHandler'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import JsonFieldView from './JsonFieldView'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const NotFound = styled(NonIdealState)`
  margin: auto;
`
const ApplicationUserOverviewController = (props: { accessKey: string }) => {
  const config = useContext(ProjectConfigContext)
  const { loading, error, data, refetch } = useGetApplicationQuery({
    variables: { accessKey: props.accessKey },
    onError: error => console.error(error),
  })

  if (loading) return <Spinner />
  else if (error || !data) return <ErrorHandler refetch={refetch} />
  else {
    const { jsonValue, id } = data.application
    const jsonField = JSON.parse(jsonValue)
    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${config.projectId}/${id}`
    return <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} hierarchyIndex={0} />
  }
}

const ApplicationUserController = () => {
  const { accessKey } = useParams()

  if (!accessKey) {
    return <NotFound title='Nicht gefunden' description='Diese Seite konnte nicht gefunden werden.' />
  } else {
    return <ApplicationUserOverviewController accessKey={accessKey} />
  }
}

export default ApplicationUserController
