import { Box, Link, Typography } from '@mui/material'
import MUILink from '@mui/material/Link'
import { grey } from '@mui/material/colors'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import AppStoreLinks from '../../shared/components/AppStoreLinks'
import { getBuildConfig } from '../../util/getBuildConfig'

const DownloadPage = (): ReactElement => {
  const { t: regionSettingsTranslations } = useTranslation('regionSettings')
  const { t: activationTranslations } = useTranslation('activation')

  const config = useContext(ProjectConfigContext)
  const { ios, android } = getBuildConfig(window.location.hostname)

  return (
    <Box display='flex' flexDirection='column' alignItems='center' mx='auto' mt={10}>
      <Box
        component='img'
        sx={{
          height: 100,
          aspectRatio: 1,
          marginBottom: 2,
          borderRadius: '20%',
          border: 1,
          borderColor: grey[300],
        }}
        alt={`${config.name} app icon`}
        src={`/icons/${config.projectId}.png`}
        aria-hidden
      />
      <Typography variant='h5' component='h1'>
        {config.name}
      </Typography>
      <MUILink
        href='https://tuerantuer.de/digitalfabrik'
        target='_blank'
        rel='noreferrer'
        color='textPrimary'
        underline='always'>
        Tür an Tür - Digitalfabrik gGmbH
      </MUILink>
      <Typography variant='h5' component='h2' mt={6}>
        {activationTranslations('downloadNow')}
      </Typography>
      <AppStoreLinks playStoreLink={android.appStoreLink} appStoreLink={ios.appStoreLink} />
      <Box display='flex' flexWrap='wrap' justifyContent='center' gap={2}>
        <Link href='/imprint' color='textPrimary' underline='none'>
          Impressum
        </Link>
        <Link href='/data-privacy-policy' color='textPrimary' underline='none'>
          {regionSettingsTranslations('dataPrivacy')}
        </Link>
      </Box>
    </Box>
  )
}

export default DownloadPage
