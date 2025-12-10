import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import AppStoreLinks from '../../../components/AppStoreLinks'
import { getBuildConfig } from '../../../util/getBuildConfig'

type CardSelfServiceInformationProps = {
  goToActivation: () => void
}

const CardSelfServiceInformation = ({
  goToActivation,
}: CardSelfServiceInformationProps): ReactElement => {
  const { ios, android } = getBuildConfig(window.location.hostname)
  const { t } = useTranslation('selfService')
  return (
    <>
      <Button
        color='secondary'
        onClick={goToActivation}
        variant='contained'
        size='large'
        sx={{ width: 'fit-content' }}
      >
        {t('nextToActivation')}
      </Button>
      <Box sx={{ marginTop: 6, marginBottom: 1 }}>
        <Typography variant='body1'>{t('appNotInstalled')}</Typography>
        <Typography variant='body1' fontWeight='bold'>
          {t('downloadApp')}
        </Typography>
      </Box>
      <AppStoreLinks playStoreLink={android.appStoreLink} appStoreLink={ios.appStoreLink} />
    </>
  )
}

export default CardSelfServiceInformation
