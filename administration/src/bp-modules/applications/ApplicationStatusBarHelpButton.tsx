import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import PopoverWrapper from '../../mui-modules/components/PopoverWrapper'

const Description = styled.ul`
  margin: 4px 0;
`

const ApplicationStatusHelpButton = (): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <PopoverWrapper icon={<HelpOutlinedIcon color='inherit' />}>
      <Box sx={{ padding: 2 }}>
        <Typography variant='h5' textAlign='center'>
          {t('whichStatusMeansWhat')}
        </Typography>
        <Description>
          <li>
            <b>{t('statusBarAccepted')}:</b>
            <Description>
              {t('acceptedDescription')}
              <br />
              {t('cardCouldBeCreated')}
            </Description>
          </li>
          <li>
            <b>{t('statusBarRejected')}:</b>
            <Description>
              {t('rejectedDescription')}
              <br />
              {t('applicationCouldBeDeleted')}
            </Description>
          </li>
          <li>
            <b>{t('statusBarWithdrawn')}:</b>
            <Description>
              {t('withdrawnDescription')}
              <br />
              {t('applicationCouldBeDeleted')}
            </Description>
          </li>
          <li>
            <b>{t('statusBarOpen')}:</b>
            <Description>
              {t('pendingDescription')}
              <br />
              {t('cardShouldNotYetBeCreated')}
            </Description>
          </li>
        </Description>
      </Box>
    </PopoverWrapper>
  )
}

export default ApplicationStatusHelpButton
