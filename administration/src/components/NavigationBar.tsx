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
        <Icon fontSize='large'>
          <img src={entitlementIcon} alt='Entitlement card project icon' />
        </Icon>
        <Link
          href='/'
          underline='none'
          sx={{
            '&:hover': { textDecoration: 'none', color: theme.palette.common.black },
            color: theme.palette.common.black,
          }}
          marginX={1.5}
        >
          <Stack>
            <Typography component='span'>
              {config.name} {t('administration')}
            </Typography>
            <Stack direction='row' sx={{ gap: 1 }}>
              {!region ? null : (
                <Typography component='span'>
                  {region.prefix} {region.name}
                </Typography>
              )}
              <Typography component='span'>{VITE_BUILD_VERSION_NAME}</Typography>
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
