import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ChangePasswordForm from './ChangePasswordForm'
import NotificationSettings from './NotificationSettings'

const UserSettingsController = (): ReactElement => {
  const { applicationFeature, projectId } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  return (
    <Stack
      sx={{ flexGrow: 1, justifyContent: 'safe center', alignItems: 'center', padding: 2, gap: 2, overflow: 'auto' }}>
      {applicationFeature && role !== Role.ProjectAdmin && <NotificationSettings projectId={projectId} />}
      <ChangePasswordForm />
    </Stack>
  )
}

export default UserSettingsController
