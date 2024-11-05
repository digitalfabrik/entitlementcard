import { Spinner } from '@blueprintjs/core'
import React, { ReactElement, useContext, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import KoblenzLogo from '../../assets/koblenz_logo.svg'
import { updateCard } from '../../cards/Card'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import CardSelfServiceActivation from './CardSelfServiceActivation'
import CardSelfServiceForm from './CardSelfServiceForm'
import CardSelfServiceInformation from './CardSelfServiceInformation'
import selfServiceStepInfo from './constants/selfServiceStepInfo'
import useCardGeneratorSelfService, { CardSelfServiceStep } from './hooks/useCardGeneratorSelfService'

const CenteredSpinner = styled(Spinner)`
  position: absolute;
  top: 45vh;
  left: 45vw;
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
  font-family: Roboto Roboto, Helvetica, Arial, sans-serif;
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

// TODO 1646 Add tests for CardSelfService
const CardSelfServiceView = (): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [queryParams] = useSearchParams()
  const [dataPrivacyAccepted, setDataPrivacyAccepted] = useState<boolean>(false)
  const {
    selfServiceState,
    setSelfServiceState,
    isLoading,
    generateCards,
    setSelfServiceCard,
    selfServiceCard,
    deepLink,
    code,
    downloadPdf,
  } = useCardGeneratorSelfService()

  const onDownloadPdf = async () => {
    if (code) {
      await downloadPdf(code, projectConfig.name)
    }
  }

  const goToActivation = () => {
    setSelfServiceState(CardSelfServiceStep.activation)
  }

  if (isLoading) {
    return <CenteredSpinner />
  }

  return (
    <Container>
      <Header>
        <HeaderLogo src={KoblenzLogo} />
      </Header>
      <Body>
        <Step>{`Schritt ${selfServiceStepInfo[selfServiceState].stepNr}/${selfServiceStepInfo.length}`}</Step>
        <Headline>{selfServiceStepInfo[selfServiceState].headline}</Headline>
        <SubHeadline>{selfServiceStepInfo[selfServiceState].subHeadline}</SubHeadline>
        <Text>{selfServiceStepInfo[selfServiceState].text}</Text>
        {selfServiceState === CardSelfServiceStep.form && (
          <CardSelfServiceForm
            card={selfServiceCard}
            cardQueryParams={queryParams}
            dataPrivacyAccepted={dataPrivacyAccepted}
            setDataPrivacyAccepted={setDataPrivacyAccepted}
            updateCard={updatedCard => setSelfServiceCard(updateCard(selfServiceCard, updatedCard))}
            generateCards={generateCards}
          />
        )}
        {selfServiceState === CardSelfServiceStep.information && (
          <CardSelfServiceInformation goToActivation={goToActivation} />
        )}
        {selfServiceState === CardSelfServiceStep.activation && (
          <CardSelfServiceActivation downloadPdf={onDownloadPdf} deepLink={deepLink} />
        )}
      </Body>
    </Container>
  )
}

export default CardSelfServiceView
