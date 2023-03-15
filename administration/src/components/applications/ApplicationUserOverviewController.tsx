import React, { useContext } from 'react'
import { Button, Card, H1, NonIdealState, Spinner } from '@blueprintjs/core'

import { useGetApplicationQuery, useWithdrawApplicationMutation } from '../../generated/graphql'
import ErrorHandler from '../../ErrorHandler'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import JsonFieldView from './JsonFieldView'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const NotFound = styled(NonIdealState)`
  margin: auto;
`
const ApplicationViewCard = styled(Card)`
  width: 800px;
  margin: 10px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 20px;
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

const ApplicationUserOverviewController = (props: { accessKey: string }) => {
  const config = useContext(ProjectConfigContext)
  const { loading, error, data, refetch } = useGetApplicationQuery({
    variables: { accessKey: props.accessKey },
    onError: error => console.error(error),
  })

  const [withdrawApplication, { loading: withdrawalLoading }] = useWithdrawApplicationMutation()

  const submitWithdrawal = () => {
    withdrawApplication({
      variables: {
        accessKey: props.accessKey,
      },
    })
  }

  console.log(data?.application)

  if (loading) return <Spinner />
  else if (error || !data) return <ErrorHandler refetch={refetch} />
  if (data.application.withdrawalDate !== 'null')
    return <CenteredMessage title='Dieser Antrag wurde bereits zurückgezogen' />
  else {
    const { jsonValue, id } = data.application
    const jsonField = JSON.parse(jsonValue)
    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${config.projectId}/${id}`
    return (
      <Container>
        <H1>{config.name}</H1>
        <span>Möchten Sie ihren Antrag mit diesen Angaben zurückziehen?</span>
        <ApplicationViewCard>
          <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} hierarchyIndex={0} />
        </ApplicationViewCard>
        <ButtonContainer>
          <Button icon='cross' loading={withdrawalLoading} onClick={submitWithdrawal}>
            Withdraw
          </Button>
        </ButtonContainer>
      </Container>
    )
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
