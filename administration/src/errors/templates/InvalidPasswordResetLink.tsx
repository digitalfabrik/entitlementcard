import { Typography } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const InvalidPasswordResetLink = (): ReactElement => {
  const { t } = useTranslation('errorTemplates')
  return (
    <>
      <Typography component='span'>{t('invalidLinkHeadline')}</Typography>
      <Typography variant='body1' component='ul'>
        <Typography component='li'>{t('browserIssue')}</Typography>
        <Typography component='li'>{t('passwordAlreadyReset')}</Typography>
        <Typography component='li'>{t('passwordLinkInvalid')}</Typography>
      </Typography>
    </>
  )
}
export default InvalidPasswordResetLink
