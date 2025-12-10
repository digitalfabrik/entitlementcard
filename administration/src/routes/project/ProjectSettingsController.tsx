import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import RenderGuard from '../../components/RenderGuard'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import ApiTokenSettings from './components/ApiTokenSettings'

const ProjectSettingsController = (): ReactElement => {
  const { userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  const { t } = useTranslation('errors')
  const isProjectAdminWithUserImportApiEnabled = role === Role.ProjectAdmin && userImportApiEnabled
  const showProjectSettings =
    isProjectAdminWithUserImportApiEnabled || role === Role.ExternalVerifiedApiUser

  return (
    <RenderGuard
      condition={showProjectSettings}
      error={{ description: t('notAuthorizedForProjectSettings') }}
    >
      <Stack
        sx={{
          flexGrow: 1,
          justifyContent: 'safe center',
          alignItems: 'center',
          overflow: 'auto',
          padding: 4,
        }}
      >
        <ApiTokenSettings showPepperSection={isProjectAdminWithUserImportApiEnabled} />
      </Stack>
    </RenderGuard>
  )
}

export default ProjectSettingsController
