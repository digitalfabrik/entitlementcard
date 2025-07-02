import { NonIdealState } from '@blueprintjs/core'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import DataPrivacyCard from './DataPrivacyCard'
import RegionSettingsController from './RegionSettingsController'
import ApplicationConfirmationNoteController from './application-confirmation-note/ApplicationConfirmationNoteController'
import FreinetSettingsController from './freinet/FreinetSettingsController'

const RegionController = (): ReactElement => {
  const { region, role } = useWhoAmI().me
  const { freinetDataTransferEnabled, projectId } = useContext(ProjectConfigContext)
  const { t } = useTranslation('errors')
  if (!region || role !== Role.RegionAdmin) {
    return <NonIdealState icon='cross' title={t('notAuthorized')} description={t('notAuthorizedForRegionSettings')} />
  }
  return (
    <Stack
      sx={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center', padding: 2, gap: 2, overflow: 'auto' }}>
      <DataPrivacyCard />
      <RegionSettingsController regionId={region.id} />
      <ApplicationConfirmationNoteController regionId={region.id} />
      {freinetDataTransferEnabled && <FreinetSettingsController regionId={region.id} project={projectId} />}
    </Stack>
  )
}

export default RegionController
