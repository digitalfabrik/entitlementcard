import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import JsonFieldView from '../components/applications/JsonFieldView'
import ErrorHandler from '../ErrorHandler'
import {
  useGetApplicationByApplicationVerificationAccessKeyQuery,
  useVerifyOrRejectApplicationVerificationMutation,
} from '../generated/graphql'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { Alert, AlertTitle, Button, Card, CircularProgress, Divider, styled, Typography } from '@mui/material'
import { Close, Check } from '@mui/icons-material'
import getMessageFromApolloError from '../components/errors/getMessageFromApolloError'
import formatDateWithTimezone from '../util/formatDate'
import getApiBaseUrl from '../util/getApiBaseUrl'

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
  const showErrorSnackbar = () => enqueueSnackbar('Etwas ist schief gelaufen.', { variant: 'error' })
  const [verifyOrRejectApplicationVerification] = useVerifyOrRejectApplicationVerificationMutation({
    onError: error => {
      console.error(error)
      showErrorSnackbar()
    },
    onCompleted: ({ result }) => {
      if (!result) {
        console.error('Verify operation returned false.')
        showErrorSnackbar()
      } else {
        setVerificationFinished(true)
      }
    },
  })

  const submitApplicationVerification = (verified: boolean) => {
    verifyOrRejectApplicationVerification({
      variables: {
        accessKey: applicationVerificationAccessKey,
        verified,
      },
    })
  }

  const { loading, error, data, refetch } = useGetApplicationByApplicationVerificationAccessKeyQuery({
    variables: { applicationVerificationAccessKey },
  })

  if (loading) return <CircularProgress style={{ margin: 'auto' }} />
  else if (error) {
    const { title, description } = getMessageFromApolloError(error)
    return <ErrorHandler title={title} description={description} refetch={refetch} />
  } else if (!data) return <ErrorHandler refetch={refetch} />
  if (data.verification.rejectedDate || data.verification.verifiedDate)
    return <CenteredMessage>Sie haben diesen Antrag bereits bearbeitet.</CenteredMessage>
  if (data.application.withdrawalDate)
    return (
      <CenteredMessage
        title={`Der Antrag wurde vom Antragssteller am ${formatDateWithTimezone(
          data.application.withdrawalDate,
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

  const { jsonValue, createdDate: createdDateString, id } = data.application
  const jsonField = JSON.parse(jsonValue)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${id}`
  return (
    <ApplicationViewCard elevation={2}>
      <div style={{ overflow: 'visible', padding: '20px' }}>
        <Typography mb='12px' variant='h4'>
          {config.name}
        </Typography>
        <Typography my='8px' variant='body1'>
          Guten Tag {data.verification.contactName},
          <br />
          <br />
          Sie wurden gebeten, die Angaben eines Antrags auf Ehrenamtskarte zu bestätigen. Die Antragsstellerin oder der
          Antragssteller hat Sie als Kontaktperson der Organisation {data.verification.organizationName} angegeben. Im
          Folgenden können Sie den zugehörigen Antrag einsehen. Wir bitten Sie, die enthaltenen Angaben, welche die
          Organisation {data.verification.organizationName} betreffen, zu bestätigen. Falls Sie denken, die Angaben
          wurden fälschlicherweise gemacht, bitten wir Sie, den Angaben zu widersprechen.
        </Typography>
        <Divider style={{ margin: '24px 0px' }} />
        <Typography variant='h6' mb='8px'>
          Antrag vom {formatDateWithTimezone(createdDateString, config.timezone)}
        </Typography>
        <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} hierarchyIndex={0} attachmentAccessible={false} />
        <Divider style={{ margin: '24px 0px' }} />
        <Typography mt='8px' variant='body1'>
          Können Sie die Angaben, welche die Organisation <b>{data.verification.organizationName}</b> betreffen,
          bestätigen?
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
