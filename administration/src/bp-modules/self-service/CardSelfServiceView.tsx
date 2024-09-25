import { Spinner } from '@blueprintjs/core'
import React, { ReactElement, useContext, useState } from 'react'
import styled from 'styled-components'

import KoblenzLogo from '../../assets/koblenz_logo.svg'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { CardActivationState } from '../cards/hooks/useCardGenerator'
import CardSelfServiceActivation from './CardSelfServiceActivation'
import CardSelfServiceForm from './CardSelfServiceForm'
import CardSelfServiceInformation from './CardSelfServiceInformation'
import selfServiceStepInfo from './constants/selfServiceStepInfo'
import useCardGeneratorSelfService from './hooks/useCardGeneratorSelfService'

const CenteredSpinner = styled(Spinner)`
  position: fixed;
  top: 20%;
  left: 50%;
`

const Header = styled.div`
  background-color: #f7f7f7;
  display: flex;
  justify-content: space-between;
  justify-self: center;
  padding: 12px;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`

const Container = styled.div`
  align-self: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  border: 1px solid #f7f7f7;
`

const Step = styled.div`
  color: #595959;
  font-size: 16px;
  padding: 14px;
  align-self: flex-end;
`

const Headline = styled.h1`
  color: #e2007a;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0;
`

const SubHeadline = styled.h2`
  color: #131314;
  font-size: 22px;
`

const Text = styled.div`
  margin-bottom: 24px;
  font-size: 16px;
`

const HeaderLogo = styled.img`
  height: 40px;
`

// TODO convert array to object, add tests, simplify status and steps, add android store icon, center spinner in mobile view, hilfe Icon oder, reuse styled components like StyledButton
const CardSelfServiceView = (): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [dataPrivacyAccepted, setDataPrivacyAccepted] = useState<boolean>(false)
  const { activationState, generateCards, setSelfServiceCards, selfServiceCards, deepLink, code, downloadPdf } =
    useCardGeneratorSelfService()
  const [stepNr, setStepNr] = useState<number>(0)

  const notifyUpdate = () => {
    setSelfServiceCards([...selfServiceCards])
  }

  const card = selfServiceCards[0]

  const onDownloadPdf = async () => {
    if (code) {
      await downloadPdf(code, projectConfig.name)
    }
  }

  const onGenerateCard = async () => {
    await generateCards()
    setStepNr(1)
  }

  const goToActivation = () => {
    setStepNr(2)
  }

  if (activationState === CardActivationState.loading) {
    return <CenteredSpinner />
  }

  return (
    <Container>
      <Header>
        <HeaderLogo src={KoblenzLogo} />
      </Header>
      <Body>
        <Step>{`Schritt ${stepNr + 1}/${selfServiceStepInfo.length}`}</Step>
        <Headline>{selfServiceStepInfo[stepNr].headline}</Headline>
        <SubHeadline>{selfServiceStepInfo[stepNr].subHeadline}</SubHeadline>
        <Text>{selfServiceStepInfo[stepNr].text}</Text>
        {activationState === CardActivationState.input && (
          <CardSelfServiceForm
            card={card}
            dataPrivacyAccepted={dataPrivacyAccepted}
            setDataPrivacyAccepted={setDataPrivacyAccepted}
            notifyUpdate={notifyUpdate}
            generateCards={onGenerateCard}
          />
        )}
        {activationState === CardActivationState.finished && stepNr === 1 && (
          <CardSelfServiceInformation goToActivation={goToActivation} />
        )}
        {activationState === CardActivationState.finished && stepNr === 2 && (
          <CardSelfServiceActivation downloadPdf={onDownloadPdf} deepLink={deepLink} />
        )}
      </Body>
    </Container>
  )
}

export default CardSelfServiceView
