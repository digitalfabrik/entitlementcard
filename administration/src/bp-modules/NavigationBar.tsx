import { AppBar, Divider, Link, Stack, SvgIcon, Toolbar, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

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
        <Link
          color='inherit'
          href='/'
          underline='none'
          sx={{ '&:hover': { textDecoration: 'none', color: 'inherit' } }}
          marginX={1.5}>
          <Stack>
            <Typography variant='body2' component='span'>
              {config.name} {t('administration')}
            </Typography>
            <Stack direction='row' sx={{ gap: 1 }}>
              {!region ? null : (
                <Typography variant='body2' component='span'>
                  {region.prefix} {region.name}
                </Typography>
              )}
              <Typography variant='body2' component='span'>
                {`(${process.env.REACT_APP_VERSION})`}
              </Typography>
            </Stack>
          </Stack>
        </Link>
        <Divider orientation='vertical' variant='middle' flexItem />
        <Stack direction='row' sx={{ flexGrow: 1, gap: 1, paddingX: 1 }}>
          <NavigationItems variant='text' />
        </Stack>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}

export default NavigationBar
