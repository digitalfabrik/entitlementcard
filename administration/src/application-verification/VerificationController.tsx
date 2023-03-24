import { Button, Card, H1, H4, NonIdealState, Spinner } from '@blueprintjs/core'
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import JsonFieldView from '../components/applications/JsonFieldView'
import ErrorHandler from '../ErrorHandler'
import {
  useGetApplicationByApplicationVerificationAccessKeyQuery,
  useVerifyOrRejectApplicationVerificationMutation,
} from '../generated/graphql'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import { useAppToaster } from '../components/AppToaster'
import { CARD_PADDING } from '../components/applications/ApplicationsOverview'
import { format } from 'date-fns'
import InvalidLink from '../components/InvalidLink'
import getMessageFromApolloError from '../components/getMessageFromApolloError'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: auto;
  justify-content: center;
  padding: ${CARD_PADDING}px;
`

const CenteredMessage = styled(NonIdealState)`
  margin: auto;
`

const ButtonContainer = styled.div`
  display: flex;
  width: inherit;
  flex-direction: row;
  justify-content: space-around;
`

const Text = styled.p`
  margin: 20px 0 10px 0;
`

const Info = styled.aside`
  background-color: #f8f8f8;
  width: inherit;
  border-left: solid 3px;
  border-color: gray;
  padding: 5px;
  margin: 10px;
`

type ApplicationVerificationProps = {
  applicationVerificationAccessKey: string
}

const ApplicationVerification = ({ applicationVerificationAccessKey }: ApplicationVerificationProps) => {
  const [verificationFinised, setVerificationFinished] = useState(false)
  const config = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const showErrorToaster = () => appToaster?.show({ intent: 'danger', message: 'Etwas ist schief gelaufen.' })
  const [verifyOrRejectApplicationVerification, { loading: verificationLoading }] =
    useVerifyOrRejectApplicationVerificationMutation({
      onError: error => {
        console.error(error)
        showErrorToaster()
      },
      onCompleted: ({ result }) => {
        if (!result) {
          console.error('Verify operation returned false.')
          showErrorToaster()
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

  // TODO handle two error messages of graphQL queries

  if (loading) return <Spinner />
  else if (error)
    return (
      <InvalidLink
        title={getMessageFromApolloError(error).title}
        description={getMessageFromApolloError(error).description}
      />
    )
  else if (!data) return <ErrorHandler refetch={refetch} />
  if (data.verification.rejectedDate || data.verification.verifiedDate)
    return <CenteredMessage title='Sie haben diesen Antrag bereits bearbeitet.' />
  if (verificationFinised)
    return (
      <CenteredMessage
        title={'Ihre Eingaben wurden erfolgreich gespeichert.'}
        description='Vielen Dank für Ihre Mithilfe. Sie können das Fenster jetzt schließen.'
      />
    )

  const { jsonValue, createdDate: createdDateString, id } = data.application
  const createdDate = new Date(createdDateString)
  const jsonField = JSON.parse(jsonValue)
  const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${config.projectId}/${id}`
  return (
    <Container>
      <H1>{config.name}</H1>
      <Text>
        Guten Tag {data.verification.contactName},
        <br />
        <br />
        Sie wurden gebeten, die Angaben eines Antrags auf Ehrenamtskarte zu bestätigen. Die Antragsstellerin oder der
        Antragssteller hat Sie als Kontaktperson der Organisation {data.verification.organizationName} angegeben. Im
        Folgenden können Sie den zugehörigen Antrag einsehen. Wir bitten Sie, die enthaltenen Angaben, welche die
        Organisation {data.verification.organizationName} betreffen, zu bestätigen. Falls Sie denken, die Angaben wurden
        fälschlicherweise gemacht, bitten wir Sie, den Angaben zu widersprechen.
      </Text>
      <Card>
        <H4>Antrag vom {format(createdDate, 'dd.MM.yyyy, HH:mm')}</H4>
        <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} hierarchyIndex={0} />
      </Card>
      <Text>
        Können Sie die Angaben, welche die Organisation <b>{data.verification.organizationName}</b> betreffen,
        bestätigen?
      </Text>
      <Info>
        <b>Wichtig!</b> Die Eingabe kann nicht rückgängig gemacht werden.
      </Info>
      <ButtonContainer>
        <Button icon='cross' loading={verificationLoading} onClick={() => submitApplicationVerification(false)}>
          Widersprechen
        </Button>
        <Button icon='tick' loading={verificationLoading} onClick={() => submitApplicationVerification(true)}>
          Bestätigen
        </Button>
      </ButtonContainer>
    </Container>
  )
}

const ApplicationVerificationController = () => {
  const { applicationVerificationAccessKey } = useParams()

  if (!applicationVerificationAccessKey) {
    return <CenteredMessage title='Nicht gefunden' description='Die Seite konnte nicht gefunden werden.' />
  }

  return <ApplicationVerification applicationVerificationAccessKey={applicationVerificationAccessKey} />
}

export default ApplicationVerificationController
