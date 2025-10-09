import { Button } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { getBuildConfig } from '../../util/getBuildConfig'
import AppStoreLinks from '../components/AppStoreLinks'
import { InfoText } from './components/InfoText'

type CardSelfServiceInformationProps = {
  goToActivation: () => void
}

const StyledInfoText = styled(InfoText)`
  margin-top: 48px;
  margin-bottom: 8px;
`

const CardSelfServiceInformation = ({ goToActivation }: CardSelfServiceInformationProps): ReactElement => {
  const { ios, android } = getBuildConfig(window.location.hostname)
  const { t } = useTranslation('selfService')
  return (
    <>
      <Button color='secondary' onClick={goToActivation} variant='contained' size='large' sx={{ width: 'fit-content' }}>
        {t('nextToActivation')}
      </Button>
      <StyledInfoText>
        <div>{t('appNotInstalled')}</div>
        <div>
          <b>{t('downloadApp')}</b>
        </div>
      </StyledInfoText>
      <AppStoreLinks playStoreLink={android.appStoreLink} appStoreLink={ios.appStoreLink} />
    </>
  )
}

export default CardSelfServiceInformation
