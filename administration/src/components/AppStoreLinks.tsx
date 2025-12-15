import { Box, Link, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { AndroidPlayStoreIcon } from '../icons/AndroidPlayStoreIcon'
import { IosAppStoreIcon } from '../icons/IosAppStoreIcon'

const StoreLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.text.primary,
  margin: theme.spacing(3, 0),
}))

type AppStoreLinksProps = {
  playStoreLink: string
  appStoreLink: string
}
const AppStoreLinks = ({ appStoreLink, playStoreLink }: AppStoreLinksProps): ReactElement => {
  const { t } = useTranslation('misc')
  return (
    <Box sx={{ mb: 1 }}>
      <StoreLink href={appStoreLink} target='_blank' rel='noreferrer'>
        <IosAppStoreIcon sx={{ height: '40px', width: '130px' }} aria-hidden />
        <Typography variant='body1'>{t('openAppStore')}</Typography>
      </StoreLink>
      <StoreLink href={playStoreLink} target='_blank' rel='noreferrer'>
        <AndroidPlayStoreIcon sx={{ height: '40px', width: '130px' }} aria-hidden />
        <Typography variant='body1'>{t('openPlayStore')}</Typography>
      </StoreLink>
    </Box>
  )
}

export default AppStoreLinks
