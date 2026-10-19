import { Box, Divider, Typography } from '@mui/material'
import MUILink from '@mui/material/Link'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import AppStoreLinks from '../../components/AppStoreLinks'
import PublicPageLayout from '../../components/PublicPageLayout'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import { getBuildConfig } from '../../util/getBuildConfig'

const DownloadPage = (): ReactElement => {
  const { t } = useTranslation('activation')
  const config = useContext(ProjectConfigContext)
  const { ios, android } = getBuildConfig(window.location.hostname)

  return (
    <PublicPageLayout maxWidth={600}>
      <Box sx={{ padding: { xs: 1, sm: 2 } }}>
        <Typography variant='h4' component='h2' sx={{ fontWeight: 'bold', marginBottom: 4 }}>
          {t('downloadTitle', { appName: config.name })}
        </Typography>
        <Typography>{t('downloadDescription')}</Typography>
        <Box sx={{ maxWidth: 480 }}>
          <AppStoreLinks playStoreLink={android.appStoreLink} appStoreLink={ios.appStoreLink} />
        </Box>
        <Divider sx={{ marginY: 3 }} />
        <Typography color='textSecondary'>
          {t('operatedBy')}{' '}
          <MUILink
            href='https://tuerantuer.de/digitalfabrik'
            target='_blank'
            rel='noreferrer'
            color='inherit'
            underline='always'
          >
            Tür an Tür - Digitalfabrik gGmbH
          </MUILink>
        </Typography>
      </Box>
    </PublicPageLayout>
  )
}

export default DownloadPage
