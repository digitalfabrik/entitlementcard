import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Button, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import KoblenzLogo from '../../assets/koblenz_logo.svg'
import { updateCard } from '../../cards/Card'
import BasicDialog from '../../mui-modules/application/BasicDialog'
import CenteredCircularProgress from '../../mui-modules/base/CenteredCircularProgress'
import CardSelfServiceActivation from './CardSelfServiceActivation'
import CardSelfServiceForm from './CardSelfServiceForm'
import CardSelfServiceInformation from './CardSelfServiceInformation'
import { IconTextButton } from './components/IconTextButton'
import { InfoText } from './components/InfoText'
import { DataPrivacyAcceptingStatus } from './constants'
import selfServiceStepInfo from './constants/selfServiceStepInfo'
import useCardGeneratorSelfService from './hooks/useCardGeneratorSelfService'

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

const SubHeadline = styled.h2`
  color: #131314;
  font-size: 22px;
`

const Text = styled.div`
  margin-bottom: 24px;
  font-size: 16px;
`

const StyledInfoTextButton = styled(IconTextButton)`
  margin: 0;
`

const CardSelfServiceView = (): ReactElement => {
  const { t } = useTranslation('selfService')
  const [dataPrivacyCheckbox, setDataPrivacyCheckbox] = useState(DataPrivacyAcceptingStatus.untouched)
  const [openHelpDialog, setOpenHelpDialog] = useState(false)
  const {
    cardGenerationStep,
    setCardGenerationStep,
    generateCards,
    setSelfServiceCard,
    selfServiceCard,
    code,
    downloadPdf,
  } = useCardGeneratorSelfService()

  if (cardGenerationStep === 'loading') {
    return <CenteredCircularProgress />
  }

  const totalSteps = Object.keys(selfServiceStepInfo).length

  return (
    <Container>
      <Header>
        <KoblenzLogo height='40px' />
        <StyledInfoTextButton onClick={() => setOpenHelpDialog(true)}>
          {t('help')}
          <HelpOutlineOutlinedIcon />
        </StyledInfoTextButton>
      </Header>
      <Body>
        <Step>{`${t('step')} ${selfServiceStepInfo[cardGenerationStep].stepNr}/${totalSteps}`}</Step>
        <Typography fontWeight='600' marginBottom={0} variant='h5' color='info' fontSize={20}>
          {selfServiceStepInfo[cardGenerationStep].headline}
        </Typography>
        <SubHeadline>{selfServiceStepInfo[cardGenerationStep].subHeadline}</SubHeadline>
        <Text>{selfServiceStepInfo[cardGenerationStep].text}</Text>
        {cardGenerationStep === 'input' && (
          <CardSelfServiceForm
            card={selfServiceCard}
            dataPrivacyAccepted={dataPrivacyCheckbox}
            setDataPrivacyAccepted={setDataPrivacyCheckbox}
            updateCard={updatedCard => setSelfServiceCard(updateCard(selfServiceCard, updatedCard))}
            generateCards={generateCards}
          />
        )}
        {cardGenerationStep === 'information' && (
          <CardSelfServiceInformation goToActivation={() => setCardGenerationStep('activation')} />
        )}
        {cardGenerationStep === 'activation' && code && (
          <CardSelfServiceActivation downloadPdf={downloadPdf} code={code} />
        )}
      </Body>
      <BasicDialog
        open={openHelpDialog}
        maxWidth='lg'
        onUpdateOpen={setOpenHelpDialog}
        title={t('help')}
        content={
          <>
            <InfoText>
              {t('youHaveProblemsCreatingAPass')} <br />
              {t('pleaseContactUsForHelp')}
            </InfoText>
            <Button color='secondary' size='large' variant='contained' href='mailto:koblenzpass@stadt.koblenz.de'>
              {t('sendMail')}
            </Button>
          </>
        }
      />
    </Container>
  )
}

export default CardSelfServiceView
