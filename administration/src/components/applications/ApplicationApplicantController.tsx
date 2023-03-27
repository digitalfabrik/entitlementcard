import React, { useState } from 'react'

import ErrorHandler from '../../ErrorHandler'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useGetApplicationByApplicantQuery } from '../../generated/graphql'
import ApplicationApplicantView from './ApplicationApplicantView'
import { Alert, CircularProgress } from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'
import getMessageFromApolloError from '../getMessageFromApolloError'

const CenteredMessage = styled(Alert)`
  margin: auto;
`

const ApplicationApplicantController = (props: { providedKey: string }) => {
  const [withdrawed, setWithdrawed] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const { loading, error, data, refetch } = useGetApplicationByApplicantQuery({
    variables: { accessKey: props.providedKey },
    onError: error => {
      console.error(error)
      enqueueSnackbar('Etwas ist schief gelaufen.', { variant: 'error' })
    },
  })

  if (loading) return <CircularProgress style={{ margin: 'auto' }} />
  else if (error) {
    const { title, description } = getMessageFromApolloError(error)
    return <ErrorHandler title={title} description={description} refetch={refetch} />
  } else if (!data) return <ErrorHandler refetch={refetch} />
  if (data.application.withdrawalDate) return <CenteredMessage>Ihr Antrag wurde bereits zurückgezogen.</CenteredMessage>
  if (withdrawed) return <CenteredMessage>Ihr Antrag wurde zurückgezogen.</CenteredMessage>
  else {
    return (
      <ApplicationApplicantView
        application={data.application}
        gotWithdrawed={() => setWithdrawed(true)}
        providedKey={props.providedKey}
      />
    )
  }
}

const ControllerWithAccessKey = () => {
  const { accessKey } = useParams()

  if (!accessKey) {
    return null
  } else {
    return (
      <SnackbarProvider>
        <ApplicationApplicantController providedKey={accessKey} />
      </SnackbarProvider>
    )
  }
}

export default ControllerWithAccessKey
