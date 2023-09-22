import { Check, Close } from '@mui/icons-material'
import { Alert, AlertTitle, Button, Card, Divider, Typography, styled } from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

import JsonFieldView from '../../bp-modules/applications/JsonFieldView'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  useGetApplicationByApplicationVerificationAccessKeyQuery,
  useVerifyOrRejectApplicationVerificationMutation,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import getQueryResult from '../util/getQueryResult'

const ApplicationViewCard = styled(Card)`
  max-width: 800px;
  margin: 10px;
  align-self: center;
`

const StyledAlert = styled(Alert)`
  margin: 20px 0;
`

const CenteredMessage = styled(Alert)`
  margin: auto;
`

const ButtonContainer = styled('div')`
  display: flex;
  width: inherit;
  flex-direction: row;
  justify-content: space-around;
`

type ApplicationVerificationProps = {
  applicationVerificationAccessKey: string
}

const ApplicationVerification = ({ applicationVerificationAccessKey }: ApplicationVerificationProps) => {
  const [verificationFinised, setVerificationFinished] = useState(false)
  const config = useContext(ProjectConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const [verifyOrRejectApplicationVerification] = useVerifyOrRejectApplicationVerificationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: ({ result }) => {
      if (!result) {
        console.error('Verify operation returned false.')
        enqueueSnackbar('Etwas ist schief gelaufen.', { variant: 'error' })
      } else {
        setVerificationFinished(true)
      }
    },
  })

  const submitApplicationVerification = (verified: boolean) => {
    verifyOrRejectApplicationVerification({
      variables: {
        project: config.projectId,
        accessKey: applicationVerificationAccessKey,
        verified,
      },
    })
  }

  const applicationQuery = useGetApplicationByApplicationVerificationAccessKeyQuery({
    variables: { applicationVerificationAccessKey },
  })

  const applicationQueryHandler = getQueryResult(applicationQuery)
  if (!applicationQueryHandler.successful) return applicationQueryHandler.component

  const { verification, application } = applicationQueryHandler.data

  if (verification.rejectedDate || verification.verifiedDate)
    return <CenteredMessage>Sie haben diesen Antrag bereits bearbeitet.</CenteredMessage>
  if (application.withdrawalDate)
    return (
      <CenteredMessage
        title={`Der Antrag wurde vom Antragssteller am ${formatDateWithTimezone(
          application.withdrawalDate,
          config.timezone
        )} zurückgezogen.`}
      />
    )
  if (verificationFinised)
    return (
      <CenteredMessage>
        <AlertTitle>Ihre Eingaben wurden erfolgreich gespeichert.</AlertTitle>
        Vielen Dank für Ihre Mithilfe. Sie können das Fenster jetzt schließen.
      </CenteredMessage>
    )

  const { jsonValue, createdDate: createdDateString, id } = application
  const jsonField = JSON.parse(jsonValue)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${id}`
  return (
    <ApplicationViewCard elevation={2}>
      <div style={{ overflow: 'visible', padding: '20px' }}>
        <Typography mb='12px' variant='h4'>
          {config.name}
        </Typography>
        <Typography my='8px' variant='body1'>
          Guten Tag {verification.contactName},
          <br />
          <br />
          Sie wurden gebeten, die Angaben eines Antrags auf Ehrenamtskarte zu bestätigen. Die Antragsstellerin oder der
          Antragssteller hat Sie als Kontaktperson der Organisation {verification.organizationName} angegeben. Im
          Folgenden können Sie den zugehörigen Antrag einsehen. Wir bitten Sie, die enthaltenen Angaben, welche die
          Organisation {verification.organizationName} betreffen, zu bestätigen. Falls Sie denken, die Angaben wurden
          fälschlicherweise gemacht, bitten wir Sie, den Angaben zu widersprechen.
        </Typography>
        <Divider style={{ margin: '24px 0px' }} />
        <Typography variant='h6' mb='8px'>
          Antrag vom {formatDateWithTimezone(createdDateString, config.timezone)}
        </Typography>
        <JsonFieldView
          jsonField={jsonField}
          baseUrl={baseUrl}
          hierarchyIndex={0}
          attachmentAccessible={false}
          expandedRoot
        />
        <Divider style={{ margin: '24px 0px' }} />
        <Typography mt='8px' variant='body1'>
          Können Sie die Angaben, welche die Organisation <b>{verification.organizationName}</b> betreffen, bestätigen?
        </Typography>
        <StyledAlert severity='warning'>
          <b>Wichtig!</b> Die Eingabe kann nicht rückgängig gemacht werden.
        </StyledAlert>
        <ButtonContainer>
          <Button
            variant='contained'
            color='error'
            endIcon={<Close />}
            onClick={() => submitApplicationVerification(false)}>
            Widersprechen
          </Button>
          <Button
            variant='contained'
            color='success'
            endIcon={<Check />}
            onClick={() => submitApplicationVerification(true)}>
            Bestätigen
          </Button>
        </ButtonContainer>
      </div>
    </ApplicationViewCard>
  )
}

const ApplicationVerificationController = () => {
  const { applicationVerificationAccessKey } = useParams()

  if (!applicationVerificationAccessKey) {
    return (
      <CenteredMessage>
        <AlertTitle>Nicht gefunden</AlertTitle>
        Die Seite konnte nicht gefunden werden.
      </CenteredMessage>
    )
  }

  return (
    <SnackbarProvider>
      <ApplicationVerification applicationVerificationAccessKey={applicationVerificationAccessKey} />
    </SnackbarProvider>
  )
}

export default ApplicationVerificationController
