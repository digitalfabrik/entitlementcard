import { Button, styled } from '@mui/material'
import React, { ReactElement } from 'react'

import AppleStoreIcon from '../../assets/ios_appstore_icon.svg'

type CardSelfServiceInformationProps = {
  goToActivation: () => void
}

const StyledButton = styled(Button)`
  margin-top: 24px;
  background-color: #922224;
  width: fit-content;
  :hover {
    color: white;
    background-color: #922224;
  }
`

const StoreLink = styled('a')`
  display: flex;
  gap: 20px;
  align-items: center;
  text-decoration: none;
  color: black;
  margin: 16px 0;
`

const InfoText = styled('div')`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
`

const LinkContainer = styled('div')`
  margin-bottom: 8px;
  font-size: 16px;
`

const CardSelfServiceInformation = ({ goToActivation }: CardSelfServiceInformationProps): ReactElement => {
  return (
    <>
      <LinkContainer>
        <StoreLink href='https://apple.com'>
          <img src={AppleStoreIcon} height='40' alt='AppStore öffnen' />
          AppStore öffnen
        </StoreLink>
        <StoreLink href='https://google.com'>
          <img src={AppleStoreIcon} height='40' alt='AppStore öffnen' />
          AppStore öffnen
        </StoreLink>
      </LinkContainer>
      <InfoText>
        <span>
          <b>App bereits installiert?</b>
        </span>
        <span>Einfach weiter klicken.</span>
      </InfoText>
      <StyledButton onClick={goToActivation} variant='contained' size='large'>
        Zur Aktivierung
      </StyledButton>
    </>
  )
}

export default CardSelfServiceInformation
