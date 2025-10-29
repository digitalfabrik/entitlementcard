import { Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const InvalidLink = (): ReactElement => {
  const { t } = useTranslation('errorTemplates')
  return (
    <>
      <Typography component='span'>{t('invalidLinkHeadline')}</Typography>
      <Typography component='ul' variant='body1'>
        <Typography component='li'>{t('browserIssue')}</Typography>
        <Typography component='li'>{t('applicationApproved')}</Typography>
        <Typography component='li'>{t('applicationRejected')}</Typography>
        <Typography component='li'>{t('applicationRequirementsNotFulfilled')}</Typography>
      </Typography>
    </>
  )
}
export default InvalidLink
