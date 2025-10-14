import { Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const InvalidLink = (): ReactElement => {
  const { t } = useTranslation('errorTemplates')
  return (
    <>
      <Typography variant='body2' component='span'>
        {t('invalidLinkHeadline')}
      </Typography>
      <Typography component='ul'>
        <Typography component='li' variant='body2'>
          {t('browserIssue')}
        </Typography>
        <Typography component='li' variant='body2'>
          {t('applicationApproved')}
        </Typography>
        <Typography component='li' variant='body2'>
          {t('applicationRejected')}
        </Typography>
        <Typography component='li' variant='body2'>
          {t('applicationRequirementsNotFulfilled')}
        </Typography>
      </Typography>
    </>
  )
}
export default InvalidLink
