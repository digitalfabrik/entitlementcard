import { styled } from '@mui/system'
import React, { ReactElement } from 'react'

import AndroidStoreIcon from '../../assets/android_appstore_icon.svg'
import AppStoreIcon from '../../assets/ios_appstore_icon.svg'

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
type AppStoreLinksProps = {
  playStoreLink: string
  appStoreLink: string
}
const AppStoreLinks = ({ appStoreLink, playStoreLink }: AppStoreLinksProps): ReactElement => (
  <LinkContainer>
    <StoreLink href={appStoreLink} target='_blank' rel='noreferrer'>
      <StoreIcon src={AppStoreIcon} alt='App Store öffnen' />
      AppStore öffnen
    </StoreLink>
    <StoreLink href={playStoreLink} target='_blank' rel='noreferrer'>
      <StoreIcon src={AndroidStoreIcon} alt='Google Play öffnen' />
      Google Play öffnen
    </StoreLink>
  </LinkContainer>
)

export default AppStoreLinks
