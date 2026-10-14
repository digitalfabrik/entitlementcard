import { ChevronRight } from '@mui/icons-material'
import { Box, Icon, Link, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import androidPlayStoreIcon from '../assets/android_appstore_icon.svg'
import iosAppStoreIcon from '../assets/ios_appstore_icon.svg'

const StoreLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.text.primary,
  margin: theme.spacing(2, 0),
  padding: theme.spacing(2, 3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

type AppStoreLinksProps = {
  playStoreLink: string
  appStoreLink: string
}

const AppStoreLinks = ({ appStoreLink, playStoreLink }: AppStoreLinksProps): ReactElement => {
  const { t } = useTranslation('misc')
  const stores = [
    {
      href: appStoreLink,
      icon: iosAppStoreIcon,
      alt: 'iOS App Store icon',
      label: t('openAppStore'),
    },
    {
      href: playStoreLink,
      icon: androidPlayStoreIcon,
      alt: 'Android Play Store icon',
      label: t('openPlayStore'),
    },
  ]

  return (
    <Box sx={{ mb: 1 }}>
      {stores.map(({ href, icon, alt, label }) => (
        <StoreLink key={href} href={href} target='_blank' rel='noreferrer'>
          <Icon sx={{ height: '40px', width: '130px' }} aria-hidden>
            <img src={icon} alt={alt} />
          </Icon>
          <Typography variant='body1' sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {label}
          </Typography>
          <ChevronRight aria-hidden />
        </StoreLink>
      ))}
    </Box>
  )
}

export default AppStoreLinks
