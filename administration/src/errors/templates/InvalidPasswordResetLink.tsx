import { Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const InvalidPasswordResetLink = (): ReactElement => {
  const { t } = useTranslation('errorTemplates')
  return (
    <>
      <Typography variant='body2' component='span'>
        {t('invalidLinkHeadline')}
      </Typography>
      <ul>
        <li>{t('browserIssue')}</li>
        <li>{t('passwordAlreadyReset')}</li>
        <li>{t('passwordLinkInvalid')}</li>
      </ul>
    </>
  )
}
export default InvalidPasswordResetLink
