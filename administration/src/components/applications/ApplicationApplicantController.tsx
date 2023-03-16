import React, { useState } from 'react'
import { NonIdealState } from '@blueprintjs/core'

import ErrorHandler from '../../ErrorHandler'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useGetApplicationByApplicantQuery } from '../../generated/graphql'
import ApplicationApplicantView from './ApplicationApplicantView'
import { CircularProgress } from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'

const CenteredMessage = styled(NonIdealState)`
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
  else if (error || !data) return <ErrorHandler refetch={refetch} />
  if (data.application.withdrawalDate) return <CenteredMessage title='Ihr Antrag wurde bereits zurückgezogen' />
  if (withdrawed) return <CenteredMessage title='Ihr Antrag wurde zurückgezogen' />
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
