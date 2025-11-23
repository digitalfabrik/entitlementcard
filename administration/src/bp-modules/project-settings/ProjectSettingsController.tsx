import { Stack } from '@mui/material'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ApiTokenSettings from './ApiTokenSettings'

const ProjectSettingsController = (): ReactElement => {
  const { userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  const { t } = useTranslation('errors')
  const isProjectAdminWithUserImportApiEnabled = role === Role.ProjectAdmin && userImportApiEnabled
  const showProjectSettings = isProjectAdminWithUserImportApiEnabled || role === Role.ExternalVerifiedApiUser

  return (
    <RenderGuard condition={showProjectSettings} error={{ description: t('notAuthorizedForProjectSettings') }}>
      <Stack sx={{ flexGrow: 1, justifyContent: 'safe center', alignItems: 'center', overflow: 'auto', padding: 4 }}>
        <ApiTokenSettings showPepperSection={isProjectAdminWithUserImportApiEnabled} />
      </Stack>
    </RenderGuard>
  )
}

export default ProjectSettingsController
