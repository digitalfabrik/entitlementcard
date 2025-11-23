import { Button, Link, Typography } from '@mui/material'
import { TFunction } from 'i18next'
import { ReactElement } from 'react'
import { Trans } from 'react-i18next'

export const ActivationText = (
  applicationName: string,
  downloadLink: string,
  deepLink: string,
  t: TFunction
): ReactElement => (
  <div>
    <Typography variant='h6' marginBottom={1}>
      {t('headline')}
    </Typography>
    <Typography component='span'>
      <Trans i18nKey='activation:description' values={{ applicationName }} /> <br />{' '}
      <Button href={deepLink} variant='contained' sx={{ mt: 1.5 }} color='primary'>
        {t('activateButton')}
      </Button>
      <br /> <br />
      <b>{t('steps')}</b>
    </Typography>
    <Typography component='ol'>
      <Typography component='li'>
        <Trans i18nKey='activation:downloadApp' values={{ applicationName }} />
      </Typography>
      <Typography component='li'>
        {' '}
        {t('openOnMobileDevice')}
        <br />
        <Link href={downloadLink} target='_blank' rel='noreferrer'>
          {downloadLink}
        </Link>
      </Typography>
      <Typography component='li'>{t('explanation')} </Typography>
    </Typography>
  </div>
)
