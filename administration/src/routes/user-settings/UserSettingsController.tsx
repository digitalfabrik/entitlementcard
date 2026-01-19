import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'

import RenderGuard from '../../components/RenderGuard'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ChangePasswordForm from './components/ChangePasswordForm'
import NotificationSettings from './components/NotificationSettings'

const UserSettingsController = (): ReactElement => {
  const { applicationFeature } = useContext(ProjectConfigContext)
  return (
    <Stack
      sx={{
        flexGrow: 1,
        justifyContent: 'safe center',
        alignItems: 'center',
        padding: 2,
        gap: 2,
        overflow: 'auto'
    }}
    >
      <RenderGuard allowedRoles={[Role.RegionAdmin, Role.RegionManager]} condition={!!applicationFeature}>
        <NotificationSettings />
      </RenderGuard>
      <ChangePasswordForm />
    </Stack>
  )
}

export default UserSettingsController
