import { Stack } from '@mui/material'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import RenderGuard from '../../components/RenderGuard'
import { SettingsCardGroup } from '../../components/SettingsCard'
import { Role } from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
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
          alignItems: 'center',
          overflow: 'auto',
          padding: 4,
        }}
      >
        <SettingsCardGroup>
          <ApiTokenSettings showPepperSection={isProjectAdminWithUserImportApiEnabled} />
        </SettingsCardGroup>
      </Stack>
    </RenderGuard>
  )
}

export default ProjectSettingsController
