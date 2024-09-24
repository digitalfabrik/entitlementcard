import { Card, Spinner } from '@blueprintjs/core'
import { Typography } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import styled from 'styled-components'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { CardActivationState } from '../cards/hooks/useCardGenerator'
import CardSelfServiceActivation from './CardSelfServiceActivation'
import CardSelfServiceButtonBar from './CardSelfServiceButtonBar'
import CardSelfServiceForm from './CardSelfServiceForm'
import useCardGeneratorSelfService from './hooks/useCardGeneratorSelfService'

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

// TODO convert array to object, add tests
const CardSelfServiceController = (): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [dataPrivacyAccepted, setDataPrivacyAccepted] = useState<boolean>(false)
  const { activationState, generateCards, setSelfServiceCards, selfServiceCards, deepLink, code, downloadPdf } =
    useCardGeneratorSelfService()

  const notifyUpdate = () => {
    setSelfServiceCards([...selfServiceCards])
  }

  const card = selfServiceCards[0]

  const onDownloadPdf = async () => {
    if (code) {
      await downloadPdf(code, projectConfig.name)
    }
  }

  if (activationState === CardActivationState.loading) {
    return <CenteredSpinner />
  }

  return (
    <Container>
      <StyledCard>
        <Typography variant='h5' mb={3}>
          {projectConfig.name} {activationState === CardActivationState.input ? 'Beantragung' : 'Aktivierung'}
        </Typography>
        {activationState === CardActivationState.input && (
          <CardSelfServiceForm
            card={card}
            dataPrivacyAccepted={dataPrivacyAccepted}
            setDataPrivacyAccepted={setDataPrivacyAccepted}
            notifyUpdate={notifyUpdate}
          />
        )}
        {activationState === CardActivationState.finished && <CardSelfServiceActivation />}
        <CardSelfServiceButtonBar
          downloadPdf={onDownloadPdf}
          generateCards={generateCards}
          cardBlueprint={card}
          dataPrivacyAccepted={dataPrivacyAccepted}
          deepLink={deepLink}
          activationState={activationState}
        />
      </StyledCard>
    </Container>
  )
}

export default CardSelfServiceController
