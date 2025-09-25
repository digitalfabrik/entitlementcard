import { Close } from '@mui/icons-material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Button } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import KoblenzLogo from '../../assets/koblenz_logo.svg'
import { updateCard } from '../../cards/Card'
import CenteredCircularProgress from '../../mui-modules/base/CenteredCircularProgress'
import CustomDialog from '../components/CustomDialog'
import CardSelfServiceActivation from './CardSelfServiceActivation'
import CardSelfServiceForm from './CardSelfServiceForm'
import CardSelfServiceInformation from './CardSelfServiceInformation'
import { ActionButton } from './components/ActionButton'
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
        <Headline>{selfServiceStepInfo[cardGenerationStep].headline}</Headline>
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
      <CustomDialog
        open={openHelpDialog}
        title={t('help')}
        id='help-dialog'
        onClose={() => setOpenHelpDialog(false)}
        onCancelAction={
          <Button onClick={() => setOpenHelpDialog(false)} variant='outlined' startIcon={<Close />}>
            {t('misc:cancel')}
          </Button>
        }
        onConfirmAction={<ActionButton href='mailto:koblenzpass@stadt.koblenz.de'>{t('sendMail')}</ActionButton>}>
        <InfoText>
          {t('youHaveProblemsCreatingAPass')} <br />
          {t('pleaseContactUsForHelp')}
        </InfoText>
      </CustomDialog>
    </Container>
  )
}

export default CardSelfServiceView
