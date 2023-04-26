import { useContext } from 'react'
import styled from 'styled-components'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ActivityLogCard from './ActivityLogCard'
import ApplicationLinkCard from './ApplicationLinkCard'
import ChangePasswordForm from './ChangePasswordForm'
import NotificationSettings from './NotificationSettings'

const UserSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const UserSettingsController = () => {
  const { applicationFeatureEnabled, activityLogConfig, projectId } = useContext(ProjectConfigContext)

  return (
    <UserSettingsContainer>
      {applicationFeatureEnabled && <NotificationSettings projectId={projectId} />}
      <ChangePasswordForm />
      {/* TODO #897: [Application] Remove Redirect for bayern */}
      {applicationFeatureEnabled && <ApplicationLinkCard />}
      {activityLogConfig && <ActivityLogCard activityLogConfig={activityLogConfig} />}
    </UserSettingsContainer>
  )
}

export default UserSettingsController
