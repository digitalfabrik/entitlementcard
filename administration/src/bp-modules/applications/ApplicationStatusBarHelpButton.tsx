import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import PopoverWrapper from '../../mui-modules/components/PopoverWrapper'

const ApplicationStatusHelpButton = (): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <PopoverWrapper icon={<HelpOutlinedIcon color='inherit' />}>
      <Box sx={{ padding: 2 }}>
        <Typography variant='h5' textAlign='center'>
          {t('whichStatusMeansWhat')}
        </Typography>
        <Typography component='ul' marginY={0.5}>
          <Typography component='li' variant='body2bold'>
            {t('statusBarAccepted')}:
            <Typography component='ul' marginY={0.5}>
              {t('acceptedDescription')}
              <br />
              {t('cardCouldBeCreated')}
            </Typography>
          </Typography>
          <Typography component='li' variant='body2bold'>
            {t('statusBarRejected')}:
            <Typography component='ul' marginY={0.5}>
              {t('rejectedDescription')}
              <br />
              {t('applicationCouldBeDeleted')}
            </Typography>
          </Typography>
          <Typography component='li' variant='body2bold'>
            {t('statusBarWithdrawn')}:
            <Typography component='ul' marginY={0.5}>
              {t('withdrawnDescription')}
              <br />
              {t('applicationCouldBeDeleted')}
            </Typography>
          </Typography>
          <Typography component='li' variant='body2bold'>
            {t('statusBarOpen')}:
            <Typography component='ul' marginY={0.5}>
              {t('pendingDescription')}
              <br />
              {t('cardShouldNotYetBeCreated')}
            </Typography>
          </Typography>
        </Typography>
      </Box>
    </PopoverWrapper>
  )
}

export default ApplicationStatusHelpButton
