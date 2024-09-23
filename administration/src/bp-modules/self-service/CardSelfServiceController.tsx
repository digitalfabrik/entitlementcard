import { Card, Spinner } from '@blueprintjs/core'
import { Typography } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import styled from 'styled-components'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { CardActivationState } from '../cards/hooks/useCardGenerator'
import useCardGeneratorSelfService from '../cards/hooks/useCardGeneratorSelfService'
import CardSelfServiceActivation from './CardSelfServiceActivation'
import CardSelfServiceButtonBar from './CardSelfServiceButtonBar'
import CardSelfServiceForm from './CardSelfServiceForm'

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 500px;
`

const Container = styled.div`
  padding: 8px;
  justify-content: center;
  display: flex;
`

const CenteredSpinner = styled(Spinner)`
  position: fixed;
  top: 20%;
  left: 50%;
`

// TODO convert array to object, cleanup useCardGenerator, add tests, add proper error handling
const CardSelfServiceController = (): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [dataPrivacyAccepted, setDataPrivacyAccepted] = useState<boolean>(false)
  const { state, generateCards, setCardBlueprint, cardBlueprint, deepLink, code, region, downloadPdf } =
    useCardGeneratorSelfService()

  const notifyUpdate = () => {
    // TODO fix reassigning functions when using object instead array
    setCardBlueprint([...cardBlueprint])
  }

  const card = cardBlueprint[0]

  const onDownloadPdf = async () => {
    if (code && region) {
      await downloadPdf(code, region, projectConfig.name)
    }
  }

  if (state === CardActivationState.loading) {
    return <CenteredSpinner />
  }

  return (
    <Container>
      <StyledCard>
        <Typography variant='h5' mb={3}>
          {projectConfig.name} {state === CardActivationState.input ? 'Beantragung' : 'Aktivierung'}
        </Typography>
        {state === CardActivationState.input && (
          <CardSelfServiceForm
            card={card}
            dataPrivacyAccepted={dataPrivacyAccepted}
            setDataPrivacyAccepted={setDataPrivacyAccepted}
            notifyUpdate={notifyUpdate}
          />
        )}
        {state === CardActivationState.finished && <CardSelfServiceActivation />}
        <CardSelfServiceButtonBar
          downloadPdf={onDownloadPdf}
          generateCards={generateCards}
          cardBlueprint={card}
          dataPrivacyAccepted={dataPrivacyAccepted}
          deepLink={deepLink}
          activationState={state}
        />
      </StyledCard>
    </Container>
  )
}

export default CardSelfServiceController
