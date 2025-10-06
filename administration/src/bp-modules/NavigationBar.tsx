import { AppBar, Divider, Stack, SvgIcon, Toolbar, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useWhoAmI } from '../WhoAmIProvider'
import EntitlementIcon from '../assets/icons/entitlement_icon_outline.svg'
import NavigationItems from '../mui-modules/navigation/NavigationItems'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import UserMenu from './UserMenu'

const NavigationBar = (): ReactElement => {
  const { t } = useTranslation('misc')
  const config = useContext(ProjectConfigContext)
  const { region } = useWhoAmI().me

  return (
    <AppBar position='sticky' color='transparent'>
      <Stack>
        <Toolbar
          sx={theme => ({
            flexWrap: 'wrap',
            [theme.breakpoints.down('lg')]: {
              padding: 1.5,
            },
          })}>
          <SvgIcon fontSize='large'>
            <EntitlementIcon />
          </SvgIcon>
          <NavLink to='/' style={{ color: 'inherit', textDecoration: 'none', margin: '0 12px' }}>
            <Stack>
              <Typography>
                {config.name} {t('administration')}
              </Typography>
              {!region ? null : (
                <Typography>
                  {region.prefix} {region.name} {`(${process.env.REACT_APP_VERSION})`}
                </Typography>
              )}
            </Stack>
          </NavLink>
          <Divider orientation='vertical' variant='middle' flexItem />
          <Stack direction='row' sx={{ flexGrow: 1, gap: 1, paddingX: 1 }}>
            <NavigationItems variant='text' />
          </Stack>
          <UserMenu />
        </Toolbar>
      </Stack>
    </AppBar>
  )
}

export default NavigationBar
