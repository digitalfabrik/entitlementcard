import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import UserEndpointSettings from './UserEndpointSettings'

const ProjectSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const ProjectSettingsController = (): ReactElement => {
  const { userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useContext(WhoAmIContext).me!

  if (role !== Role.ProjectAdmin || !userImportApiEnabled) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind für die Projekteinstellungen nicht berechtigt'
      />
    )
  }
  return (
    <ProjectSettingsContainer>
      <UserEndpointSettings />
    </ProjectSettingsContainer>
  )
}

export default ProjectSettingsController
