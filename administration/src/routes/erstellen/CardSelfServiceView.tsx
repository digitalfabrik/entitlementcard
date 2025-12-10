import { Close } from '@mui/icons-material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import KoblenzLogo from '../../assets/koblenz_logo.svg'
import { updateCard } from '../../cards/Card'
import CenteredCircularProgress from '../../components/CenteredCircularProgress'
import CardSelfServiceActivation from './components/CardSelfServiceActivation'
import CardSelfServiceForm from './components/CardSelfServiceForm'
import CardSelfServiceInformation from './components/CardSelfServiceInformation'
import { DataPrivacyAcceptingStatus } from './constants'
import selfServiceStepInfo from './constants/selfServiceStepInfo'
import useCardGeneratorSelfService from './hooks/useCardGeneratorSelfService'

const Container = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: theme.breakpoints.values.sm,
  border: `1px solid ${theme.palette.divider}`,
}))

const CardSelfServiceView = (): ReactElement => {
  const { t } = useTranslation('selfService')
  const [dataPrivacyCheckbox, setDataPrivacyCheckbox] = useState(
    DataPrivacyAcceptingStatus.untouched,
  )
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
      <Box
        sx={{
          backgroundColor: grey[100],
          padding: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <KoblenzLogo height='40px' />
        <Button
          color='inherit'
          variant='text'
          size='large'
          onClick={() => setOpenHelpDialog(true)}
          endIcon={<HelpOutlineOutlinedIcon />}
        >
          {' '}
          {t('help')}
        </Button>
      </Box>
      <Stack padding={2}>
        <Typography
          component='div'
          variant='body1'
          color='inherit'
          sx={{ p: 2, alignSelf: 'flex-end' }}
        >{`${t('step')} ${
          selfServiceStepInfo[cardGenerationStep].stepNr
        }/${totalSteps}`}</Typography>
        <Typography variant='h6' color='accent' component='h1'>
          {selfServiceStepInfo[cardGenerationStep].headline}
        </Typography>
        <Typography variant='h5' component='h2'>
          {selfServiceStepInfo[cardGenerationStep].subHeadline}
        </Typography>
        <Typography variant='body1' marginBottom={3}>
          {selfServiceStepInfo[cardGenerationStep].text}
        </Typography>
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
      </Stack>
      <Dialog
        open={openHelpDialog}
        aria-describedby='help-dialog'
        fullWidth
        onClose={() => setOpenHelpDialog(false)}
      >
        <DialogTitle>{t('help')}</DialogTitle>
        <DialogContent id='help-dialog'>
          <Typography marginTop={1.5} marginBottom={3}>
            {t('youHaveProblemsCreatingAPass')} <br />
            {t('pleaseContactUsForHelp')}
          </Typography>
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
