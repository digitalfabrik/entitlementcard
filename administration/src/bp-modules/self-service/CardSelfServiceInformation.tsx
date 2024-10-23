import React, { ReactElement } from 'react'

import { getBuildConfig } from '../../util/getBuildConfig'
import AppStoreLinks from '../components/AppStoreLinks'
import { ActionButton } from './components/ActionButton'
import { InfoText } from './components/InfoText'

type CardSelfServiceInformationProps = {
  goToActivation: () => void
}

const CardSelfServiceInformation = ({ goToActivation }: CardSelfServiceInformationProps): ReactElement => {
  const { ios, android } = getBuildConfig(window.location.hostname)
  return (
    <>
      <AppStoreLinks playStoreUrl={android.appStoreLink} appStoreUrl={ios.appStoreLink} />
      <InfoText>
        <div>
          <b>App bereits installiert?</b>
        </div>
        <div>Einfach weiter klicken.</div>
      </InfoText>
      <ActionButton onClick={goToActivation} variant='contained' size='large'>
        Zur Aktivierung
      </ActionButton>
    </>
  )
}

export default CardSelfServiceInformation
