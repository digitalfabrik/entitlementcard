import { Alert } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { useGetApplicationByApplicantQuery } from '../../generated/graphql'
import getQueryResult from '../util/getQueryResult'
import ApplicationApplicantView from './ApplicationApplicantView'

const CenteredMessage = styled(Alert)`
  margin: auto;
`

const ApplicationApplicantController = (props: { providedKey: string }) => {
  const [isWithdrawed, setIsWithdrawed] = useState<boolean>(false)
  const applicationQuery = useGetApplicationByApplicantQuery({
    variables: { accessKey: props.providedKey },
  })
  const applicationQueryHandler = getQueryResult(applicationQuery)
  if (!applicationQueryHandler.successful) return applicationQueryHandler.component
  const application = applicationQueryHandler.data.application

  if (application.withdrawalDate) return <CenteredMessage>Ihr Antrag wurde bereits zurückgezogen.</CenteredMessage>
  if (isWithdrawed) return <CenteredMessage>Ihr Antrag wurde zurückgezogen.</CenteredMessage>
  else {
    return (
      <ApplicationApplicantView
        application={application}
        gotWithdrawed={() => setIsWithdrawed(true)}
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
