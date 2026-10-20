import { ChevronRight } from '@mui/icons-material'
import { Box, Icon, Link, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import androidPlayStoreIcon from '../assets/android_appstore_icon.svg'
import iosAppStoreIcon from '../assets/ios_appstore_icon.svg'

const StyledStoreLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.text.primary,
  margin: theme.spacing(2, 0),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

type StoreLinkProps = {
  storeType: 'apple' | 'google'
  link: string
}

const StoreLink = ({ storeType, link }: StoreLinkProps): ReactElement => {
  const { t } = useTranslation('misc')
  const isApple = storeType === 'apple'

  return (
    <StyledStoreLink
      href={link}
      target='_blank'
      rel='noreferrer'
      sx={{
        gap: { xs: 1.5, sm: 2.5 },
        paddingX: { xs: 1.5, sm: 3 },
        paddingY: { xs: 1.5, sm: 2 },
      }}
    >
      <Icon sx={{ height: '40px', width: '130px' }} aria-hidden>
        <img
          src={isApple ? iosAppStoreIcon : androidPlayStoreIcon}
          alt={isApple ? 'iOS App Store icon' : 'Android Play Store icon'}
        />
      </Icon>
      <Typography
        variant='body1'
        sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: { xs: '12px', sm: '1rem' } }}
      >
        {t(isApple ? 'openAppStore' : 'openPlayStore')}
      </Typography>
      <ChevronRight aria-hidden />
    </StyledStoreLink>
  )
}

type AppStoreLinksProps = {
  playStoreLink: string
  appStoreLink: string
}

const AppStoreLinks = ({ appStoreLink, playStoreLink }: AppStoreLinksProps): ReactElement => (
  <Box sx={{ mb: 1 }}>
    <StoreLink storeType='apple' link={appStoreLink} />
    <StoreLink storeType='google' link={playStoreLink} />
  </Box>
)

export default AppStoreLinks
