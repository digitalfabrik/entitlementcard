import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'

import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import ChangePasswordForm from './components/ChangePasswordForm'
import NotificationSettings from './components/NotificationSettings'

const UserSettingsController = (): ReactElement => {
  const { applicationFeature } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  return (
    <Stack
      sx={{ flexGrow: 1, justifyContent: 'safe center', alignItems: 'center', padding: 2, gap: 2, overflow: 'auto' }}>
      {applicationFeature && role !== Role.ProjectAdmin && <NotificationSettings />}
      <ChangePasswordForm />
    </Stack>
  )
}

export default UserSettingsController
