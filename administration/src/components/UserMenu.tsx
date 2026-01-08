import { EditSquare, Logout, Settings } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, IconButton, Menu, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Role } from '../generated/graphql'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import { useWhoAmI } from '../provider/WhoAmIProvider'
import roleToText from '../routes/users/utils/roleToText'
import RenderGuard from './RenderGuard'

const UserMenu = (): ReactElement => {
  const { role, email } = useWhoAmI().me
  const { t } = useTranslation('misc')
  const projectConfig = useContext(ProjectConfigContext)
  const navigate = useNavigate()
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <Box
      sx={theme => ({
        flexGrow: 0,
        [theme.breakpoints.down('lg')]: {
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        },
      })}
    >
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar alt={email} />
      </IconButton>
      <Menu
        sx={{
          mt: '45px',
          '& .MuiList-root': {
            padding: 1,
          },
        }}
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
        onClose={handleCloseUserMenu}
      >
        <>
          <Box sx={{ paddingX: 1, marginY: 1 }}>
            <Typography noWrap fontWeight='500'>
              {email}
            </Typography>
            <Typography>Rolle: {roleToText(role)}</Typography>
          </Box>
          <Divider sx={{ my: 1, width: '100%' }} />
          <Button
            href='/user-settings'
            fullWidth
            variant='text'
            sx={{ justifyContent: 'flex-start' }}
            startIcon={<Settings />}
            onClick={handleCloseUserMenu}
          >
            {t('userSettings')}
          </Button>
          <RenderGuard
            condition={projectConfig.activityLogConfig !== undefined}
            allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
          >
            <Button
              href='/activity-log'
              fullWidth
              variant='text'
              startIcon={<EditSquare />}
              sx={{ justifyContent: 'flex-start' }}
              onClick={handleCloseUserMenu}
            >
              {t('activityLog')}
            </Button>
          </RenderGuard>
          <Button
            sx={{ justifyContent: 'flex-start' }}
            fullWidth
            variant='text'
            startIcon={<Logout />}
            onClick={() => navigate('/logout')}
          >
            {t('logout')}
          </Button>
        </>
      </Menu>
    </Box>
  )
}

export default UserMenu
