import { Alert } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { useGetApplicationByApplicantQuery } from '../../generated/graphql'
import useQueryHandler from '../hooks/useQueryHandler'
import ApplicationApplicantView from './ApplicationApplicantView'

const CenteredMessage = styled(Alert)`
  margin: auto;
`

const ApplicationApplicantController = (props: { providedKey: string }) => {
  const [withdrawed, setWithdrawed] = useState<boolean>(false)
  const applicationQuery = useGetApplicationByApplicantQuery({
    variables: { accessKey: props.providedKey },
  })
  const applicationQueryHandler = useQueryHandler(applicationQuery)
  if (!applicationQueryHandler.successful) return applicationQueryHandler.component
  const application = applicationQueryHandler.data.application

  if (application.withdrawalDate) return <CenteredMessage>Ihr Antrag wurde bereits zurückgezogen.</CenteredMessage>
  if (withdrawed) return <CenteredMessage>Ihr Antrag wurde zurückgezogen.</CenteredMessage>
  else {
    return (
      <ApplicationApplicantView
        application={application}
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
