import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ActivityLogCard from './ActivityLogCard'
import ChangePasswordForm from './ChangePasswordForm'
import NotificationSettings from './NotificationSettings'

const UserSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const UserSettingsController = (): ReactElement => {
  const { applicationFeature, activityLogConfig, projectId } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  return (
    <UserSettingsContainer>
      {applicationFeature && role !== Role.ProjectAdmin && <NotificationSettings projectId={projectId} />}
      <ChangePasswordForm />
      {activityLogConfig && <ActivityLogCard activityLogConfig={activityLogConfig} />}
    </UserSettingsContainer>
  )
}

export default UserSettingsController
