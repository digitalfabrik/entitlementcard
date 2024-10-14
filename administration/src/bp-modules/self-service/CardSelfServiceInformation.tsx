import { styled } from '@mui/material'
import React, { ReactElement } from 'react'

import AndroidStoreIcon from '../../assets/android_appstore_icon.svg'
import AppleStoreIcon from '../../assets/ios_appstore_icon.svg'
import { ActionButton } from './components/ActionButton'
import { InfoText } from './components/InfoText'

type CardSelfServiceInformationProps = {
  goToActivation: () => void
}

const StoreLink = styled('a')`
  display: flex;
  gap: 20px;
  align-items: center;
  text-decoration: none;
  color: black;
  margin: 24px 0;
`

const StoreIcon = styled('img')`
  height: 40px;
  width: 130px;
`

const LinkContainer = styled('div')`
  margin-bottom: 8px;
  font-size: 16px;
`
// TODO 1647 provide store links
const CardSelfServiceInformation = ({ goToActivation }: CardSelfServiceInformationProps): ReactElement => (
  <>
    <LinkContainer>
      <StoreLink href='https://apple.com' target='_blank' rel='noreferrer'>
        <StoreIcon src={AppleStoreIcon} alt='AppStore öffnen' />
        AppStore öffnen
      </StoreLink>
      <StoreLink href='https://google.com' target='_blank' rel='noreferrer'>
        <StoreIcon src={AndroidStoreIcon} alt='Google Play öffnen' />
        Google Play öffnen
      </StoreLink>
    </LinkContainer>
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

export default CardSelfServiceInformation
