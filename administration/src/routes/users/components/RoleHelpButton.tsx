import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import PopoverWrapper from '../../../components/PopoverWrapper'
import { Role } from '../../../generated/graphql'
import roleToText from '../utils/roleToText'

const RoleHelpButton = (): ReactElement => {
  const { t } = useTranslation('users')
  return (
    <PopoverWrapper icon={<HelpOutlinedIcon color='inherit' fontSize='small' />}>
      <Box sx={{ padding: 2 }}>
        <Typography variant='h5' sx={{ textAlign: 'center' }}>
          {t('roleRightsHeading')}
        </Typography>
        <Typography variant='body1' component='ul'>
          <Typography variant='body2bold' component='li'>
            {roleToText(Role.ProjectAdmin)}:
            <Typography variant='body1' component='ul'>
              <Typography component='li'>{t('projectAdminRight')}</Typography>
            </Typography>
          </Typography>
          <Typography variant='body1' component='li'>
            <Typography variant='body2bold'>{roleToText(Role.RegionAdmin)}:</Typography>
            <Typography variant='body1' component='ul'>
              <Typography component='li'>{t('regionAdminRight1')}</Typography>
              <Typography component='li'>{t('regionAdminRight2')}</Typography>
              <Typography component='li'>{t('regionAdminRight3')}</Typography>
              <Typography component='li'>{t('regionAdminRight4')}</Typography>
            </Typography>
            <div>
              <Typography color='error' variant='body2bold'>
                {t('hint')}:{' '}
              </Typography>
              <Typography component='span'> {t('regionAdminHint')}</Typography>
            </div>
          </Typography>
          <Typography variant='body1' component='li'>
            <Typography variant='body2bold'>{roleToText(Role.RegionManager)}:</Typography>
            <Typography variant='body1' component='ul'>
              <Typography component='li'>{t('regionManagerRight1')}</Typography>
              <Typography component='li'>{t('regionManagerRight2')}</Typography>
            </Typography>
          </Typography>
          <Typography component='li' variant='body2bold'>
            {roleToText(Role.ExternalVerifiedApiUser)}:
            <Typography variant='body1' component='ul'>
              <Typography component='li'>
                {t('externalVerifiedApiUser1')}
                <br />
                {t('externalVerifiedApiUser2')}
              </Typography>
            </Typography>
          </Typography>
        </Typography>
      </Box>
    </PopoverWrapper>
  )
}

export default RoleHelpButton
