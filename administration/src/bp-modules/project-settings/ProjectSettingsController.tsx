import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ApiTokenSettings from './ApiTokenSettings'

const ProjectSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const ProjectSettingsController = (): ReactElement => {
  const { userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  const { t } = useTranslation('errors')
  const isProjectAdminWithUserImportApiEnabled = role === Role.ProjectAdmin && userImportApiEnabled
  const showProjectSettings = isProjectAdminWithUserImportApiEnabled || role === Role.ExternalVerifiedApiUser

  return (
    <RenderGuard condition={showProjectSettings} error={{ description: t('notAuthorizedForProjectSettings') }}>
      <ProjectSettingsContainer>
        <ApiTokenSettings showPepperSection={isProjectAdminWithUserImportApiEnabled} />
      </ProjectSettingsContainer>
    </RenderGuard>
  )
}

export default ProjectSettingsController
