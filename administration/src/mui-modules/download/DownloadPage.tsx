import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import AppStoreLinks from '../../bp-modules/components/AppStoreLinks'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { getBuildConfig } from '../../util/getBuildConfig'

const AppIcon = styled('img')({
  height: 100,
  width: 100,
  border: '1px solid rgba(0, 0, 0, 0.2)',
  borderRadius: '20%',
  marginBottom: '1rem',
})

const linkStyle = {
  color: 'inherit',
  textDecoration: 'none',
  fontSize: '1rem',
}

const StyledAnchorLink = styled('a')({
  ...linkStyle,
  textDecoration: 'underline',
})

const StyledLink = styled(Link)({
  ...linkStyle,
})

const DownloadPage = (): ReactElement => {
  const { t: regionSettingsTranslations } = useTranslation('regionSettings')
  const { t: activationTranslations } = useTranslation('activation')

  const config = useContext(ProjectConfigContext)
  const { ios, android } = getBuildConfig(window.location.hostname)

  return (
    <Box display='flex' flexDirection='column' alignItems='center' mx='auto' mt={10}>
      <AppIcon alt={`${config.name} app icon`} src={`/icons/${config.projectId}.png`} aria-hidden />
      <Typography variant='h5' component='h1'>
        {config.name}
      </Typography>
      <StyledAnchorLink href='https://tuerantuer.de/digitalfabrik'>Tür an Tür - Digitalfabrik gGmbH</StyledAnchorLink>
      <Typography variant='h6' component='h2' mt={6}>
        {activationTranslations('downloadNow')}
      </Typography>
      <AppStoreLinks playStoreLink={android.appStoreLink} appStoreLink={ios.appStoreLink} />
      <Box display='flex' flexWrap='wrap' justifyContent='center' gap={2}>
        <StyledLink to='/imprint'>Impressum</StyledLink>
        <StyledLink to='/data-privacy-policy'>{regionSettingsTranslations('dataPrivacy')}</StyledLink>
      </Box>
    </Box>
  )
}

export default DownloadPage
