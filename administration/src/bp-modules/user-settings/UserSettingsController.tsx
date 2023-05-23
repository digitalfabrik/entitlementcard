import { useContext } from 'react'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
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
  const { role } = useContext(WhoAmIContext).me!
  return (
    <UserSettingsContainer>
      {applicationFeatureEnabled && role !== Role.ProjectAdmin && <NotificationSettings projectId={projectId} />}
      <ChangePasswordForm />
      {/* TODO #897: [Application] Remove Redirect for bayern */}
      {applicationFeatureEnabled && <ApplicationLinkCard />}
      {activityLogConfig && <ActivityLogCard activityLogConfig={activityLogConfig} />}
    </UserSettingsContainer>
  )
}

export default UserSettingsController
