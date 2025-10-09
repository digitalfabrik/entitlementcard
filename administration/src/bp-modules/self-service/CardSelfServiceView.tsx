import { Close } from '@mui/icons-material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import KoblenzLogo from '../../assets/koblenz_logo.svg'
import { updateCard } from '../../cards/Card'
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
        <Typography variant='h6' color='accent' component='h1'>
          {selfServiceStepInfo[cardGenerationStep].headline}
        </Typography>
        <Typography variant='h5' component='h2'>
          {selfServiceStepInfo[cardGenerationStep].subHeadline}
        </Typography><Text>{selfServiceStepInfo[cardGenerationStep].text}</Text>
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
      <Dialog open={openHelpDialog} aria-describedby='help-dialog' fullWidth onClose={() => setOpenHelpDialog(false)}>
        <DialogTitle>{t('help')}</DialogTitle>
        <DialogContent id='help-dialog'>
          <InfoText>
            {t('youHaveProblemsCreatingAPass')} <br />
            {t('pleaseContactUsForHelp')}
          </InfoText>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
          <Button onClick={() => setOpenHelpDialog(false)} variant='outlined' startIcon={<Close />}>
            {t('misc:cancel')}
          </Button>
          <Button color='secondary' variant='contained' href='mailto:koblenzpass@stadt.koblenz.de'>
            {t('sendMail')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CardSelfServiceView
