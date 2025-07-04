import { NonIdealState } from '@blueprintjs/core'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ApiTokenSettings from './ApiTokenSettings'

const ProjectSettingsController = (): ReactElement => {
  const { userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  const { t } = useTranslation('errors')

  if ((role !== Role.ProjectAdmin || !userImportApiEnabled) && role !== Role.ExternalVerifiedApiUser) {
    return <NonIdealState icon='cross' title={t('notAuthorized')} description={t('notAuthorizedForProjectSettings')} />
  }
  return (
    <Stack sx={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', overflow: 'auto' }}>
      <ApiTokenSettings showPepperSection={role === Role.ProjectAdmin && userImportApiEnabled} />
    </Stack>
  )
}

export default ProjectSettingsController
