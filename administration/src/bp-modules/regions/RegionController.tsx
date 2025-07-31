import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import DataPrivacyCard from './DataPrivacyCard'
import RegionSettingsController from './RegionSettingsController'
import ApplicationConfirmationNoteController from './application-confirmation-note/ApplicationConfirmationNoteController'
import FreinetSettingsController from './freinet/FreinetSettingsController'

const RegionController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { freinetDataTransferEnabled, projectId } = useContext(ProjectConfigContext)
  const { t } = useTranslation('errors')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('notAuthorizedForRegionSettings') }}>
      {region && (
        <Stack
          sx={{
            flexGrow: 1,
            width: '100%',
            justifyContent: 'safe center',
            alignItems: 'center',
            padding: 2,
            gap: 2,
            overflow: 'auto',
          }}>
          <DataPrivacyCard />
          <RegionSettingsController regionId={region.id} />
          <ApplicationConfirmationNoteController regionId={region.id} />
          {freinetDataTransferEnabled && <FreinetSettingsController regionId={region.id} project={projectId} />}
        </Stack>
      )}
    </RenderGuard>
  )
}

export default RegionController
