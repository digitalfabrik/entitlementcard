import React from 'react'
import { NonIdealState, Spinner } from '@blueprintjs/core'

import { useGetApplicationByUserAccessKeyQuery } from '../../generated/graphql'
import ErrorHandler from '../../ErrorHandler'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { ApplicationViewComponent } from './ApplicationsOverview'

const NotFound = styled(NonIdealState)`
  margin: auto;
`

const CenteredMessage = styled(NonIdealState)`
  margin: auto;
`

const ApplicationUserOverviewController = (props: { accessKey: string }) => {
  const { loading, error, data, refetch } = useGetApplicationByUserAccessKeyQuery({
    variables: { accessKey: props.accessKey },
    onError: error => console.error(error),
  })

  if (loading) return <Spinner />
  else if (error || !data) return <ErrorHandler refetch={refetch} />
  if (data.application.withdrawalDate) return <CenteredMessage title='Ihr Antrag wurde zurückgezogen' />
  else {
    return <ApplicationViewComponent application={data.application} gotDeleted={refetch} mode={'withdrawal'} />
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
