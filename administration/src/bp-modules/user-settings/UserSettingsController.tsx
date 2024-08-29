import { useContext } from 'react'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ActivityLogCard from './ActivityLogCard'
import ChangePasswordForm from './ChangePasswordForm'
import NotificationSettings from './NotificationSettings'
import UserUploadApiTokenSettings from './UserUploadApiTokenSettings'

const UserSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const UserSettingsController = () => {
  const { applicationFeature, activityLogConfig, projectId, userUploadApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useContext(WhoAmIContext).me!
  return (
    <UserSettingsContainer>
      {applicationFeature && role !== Role.ProjectAdmin && <NotificationSettings projectId={projectId} />}
      {userUploadApiEnabled && role == Role.ProjectAdmin && <UserUploadApiTokenSettings />}
      <ChangePasswordForm />
      {activityLogConfig && <ActivityLogCard activityLogConfig={activityLogConfig} />}
    </UserSettingsContainer>
  )
}

export default UserSettingsController
