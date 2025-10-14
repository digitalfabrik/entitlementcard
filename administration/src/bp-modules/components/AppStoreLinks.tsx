import { Link } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import AndroidStoreIcon from '../../assets/android_appstore_icon.svg'
import AppStoreIcon from '../../assets/ios_appstore_icon.svg'

const StoreLink = styled(Link)`
  display: flex;
  gap: 20px;
  align-items: center;
  text-decoration: none;
  color: black;
  margin: 24px 0;
`

const LinkContainer = styled('div')`
  margin-bottom: 8px;
  font-size: 16px;
`
type AppStoreLinksProps = {
  playStoreLink: string
  appStoreLink: string
}
const AppStoreLinks = ({ appStoreLink, playStoreLink }: AppStoreLinksProps): ReactElement => {
  const { t } = useTranslation('misc')
  return (
    <LinkContainer>
      <StoreLink href={appStoreLink} target='_blank' rel='noreferrer'>
        <AppStoreIcon height='40px' width='130px' aria-hidden />
        {t('openAppStore')}
      </StoreLink>
      <StoreLink href={playStoreLink} target='_blank' rel='noreferrer'>
        <AndroidStoreIcon height='40px' width='130px' aria-hidden />
        {t('openPlayStore')}
      </StoreLink>
    </LinkContainer>
  )
}

export default AppStoreLinks
