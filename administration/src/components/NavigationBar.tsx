import { AppBar, Divider, Icon, Link, Stack, Toolbar, Typography, useTheme } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import entitlementIcon from '../assets/icons/entitlement_icon_outline.svg'
import { ProjectConfigContext } from '../provider/ProjectConfigContext'
import { useWhoAmI } from '../provider/WhoAmIProvider'
import NavigationItems from './NavigationItems'
import UserMenu from './UserMenu'

const NavigationBar = (): ReactElement => {
  const { t } = useTranslation('misc')
  const theme = useTheme()
  const config = useContext(ProjectConfigContext)
  const { region } = useWhoAmI().me

  return (
    <AppBar position='sticky' sx={{ backgroundColor: theme.palette.common.white }}>
      <Toolbar
        sx={theme => ({
          flexWrap: 'wrap',
          [theme.breakpoints.down('lg')]: {
            padding: 1.5,
          },
        })}
      >
        <Link
          href='/'
          underline='none'
          sx={{
            '&:hover': { textDecoration: 'none', color: theme.palette.common.black },
            color: theme.palette.common.black,
            marginY: 1.5,
          }}
        >
          <Stack direction='row' sx={{ alignItems: 'center' }}>
            <Icon fontSize='large'>
              <img src={entitlementIcon} alt='Entitlement card project icon' />
            </Icon>
            <Stack sx={{ paddingX: 1 }}>
              <Typography component='span'>
                {config.name} {t('administration')}
              </Typography>
              <Typography component='span'>
                {region ? `${region.prefix} ${region.name} ` : undefined}
                {VITE_BUILD_VERSION_NAME}
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
