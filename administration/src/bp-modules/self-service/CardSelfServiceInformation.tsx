import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { getBuildConfig } from '../../util/getBuildConfig'
import AppStoreLinks from '../components/AppStoreLinks'
import { ActionButton } from './components/ActionButton'
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
  return (
    <>
      <ActionButton onClick={goToActivation} variant='contained' size='large'>
        Weiter zur Aktivierung
      </ActionButton>
      <StyledInfoText>
        <div>Haben sie die App noch nicht?</div>
        <div>
          <b>Laden Sie sie jetzt herunter, um fortzufahren.</b>
        </div>
      </StyledInfoText>
      <AppStoreLinks playStoreLink={android.appStoreLink} appStoreLink={ios.appStoreLink} />
    </>
  )
}

export default CardSelfServiceInformation
