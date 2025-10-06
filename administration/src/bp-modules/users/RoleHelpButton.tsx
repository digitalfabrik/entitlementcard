import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { Role } from '../../generated/graphql'
import PopoverWrapper from '../../mui-modules/components/PopoverWrapper'
import roleToText from './utils/roleToText'

const RoleHelpButton = (): ReactElement => {
  const { t } = useTranslation('users')
  return (
    <PopoverWrapper icon={<HelpOutlinedIcon color='inherit' fontSize='small' />}>
      <Box sx={{ padding: 2 }}>
        <Typography variant='h5' sx={{ textAlign: 'center' }}>
          {t('roleRightsHeading')}
        </Typography>
        <ul>
          <li>
            <Typography variant='body2bold'>{roleToText(Role.ProjectAdmin)}:</Typography>
            <ul>
              <li>{t('projectAdminRight')}</li>
            </ul>
          </li>
          <li>
            <b>{roleToText(Role.RegionAdmin)}:</b>
            <ul>
              <li>{t('regionAdminRight1')}</li>
              <li>{t('regionAdminRight2')}</li>
              <li>{t('regionAdminRight3')}</li>
              <li>{t('regionAdminRight4')}</li>
            </ul>
            <div>
              <Typography
                color='error'
                variant='body2bold'
                component='span'
                style={{ color: 'red', fontWeight: 'bold' }}>
                {t('hint')}:{' '}
              </Typography>
              {t('regionAdminHint')}
            </div>
          </li>
          <li>
            <b>{roleToText(Role.RegionManager)}:</b>
            <ul>
              <li>{t('regionManagerRight1')}</li>
              <li>{t('regionManagerRight2')}</li>
            </ul>
          </li>
          <li>
            <b>{roleToText(Role.ExternalVerifiedApiUser)}:</b>
            <ul>
              <li>
                {t('externalVerifiedApiUser1')}
                <br />
                {t('externalVerifiedApiUser2')}
              </li>
            </ul>
          </li>
        </ul>
      </Box>
    </PopoverWrapper>
  )
}

export default RoleHelpButton
