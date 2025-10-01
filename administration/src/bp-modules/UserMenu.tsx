import { EditSquare, Logout, Settings } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, IconButton, Menu, Stack, Tooltip, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router'

import { useWhoAmI } from '../WhoAmIProvider'
import { Role } from '../generated/graphql'
import RenderGuard from '../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import roleToText from './users/utils/roleToText'
import { AuthContext } from '../AuthProvider'


const UserMenu = (): ReactElement => {
  const { role, email } = useWhoAmI().me
  const { signOut } = useContext(AuthContext)
  const { t } = useTranslation('misc')
  const projectConfig = useContext(ProjectConfigContext)
  const navigate = useNavigate()
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const signOutAndRedirect = () => {
    signOut()
    navigate('/')
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title='Open settings'>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={email} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}>
        <Stack sx={{ padding: 1, alignItems: 'baseline' }}>
          <Box sx={{ paddingX: 1, marginBottom: 1 }}>
            <Typography noWrap fontWeight='500' variant='body2'>
              {email}
            </Typography>
            <Typography variant='body2'>Rolle: {roleToText(role)}</Typography>
          </Box>
          <Divider sx={{ my: 1, width: '100%' }} />
          <NavLink to='/user-settings' style={{ width: '100%' }}>
            <Button fullWidth variant='text' startIcon={<Settings />} sx={{ justifyContent: 'flex-start' }}>
              {t('userSettings')}
            </Button>
          </NavLink>
          <RenderGuard
            condition={projectConfig.activityLogConfig !== undefined}
            allowedRoles={[Role.RegionManager, Role.RegionAdmin]}>
            <NavLink to='/activity-log'>
              <Button fullWidth variant='text' startIcon={<EditSquare />}>
                {t('activityLog')}
              </Button>
            </NavLink>
          </RenderGuard>
          <Button
            sx={{ justifyContent: 'flex-start' }}
            fullWidth
            variant='text'
            startIcon={<Logout />}
            onClick={signOutAndRedirect}>
            {t('logout')}
          </Button>
        </Stack>
      </Menu>
    </Box>
  )
}

export default UserMenu
