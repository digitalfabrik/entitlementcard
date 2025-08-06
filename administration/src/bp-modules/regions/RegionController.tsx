import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import DataPrivacyCard from './DataPrivacyCard'
import RegionSettingsController from './RegionSettingsController'
import ApplicationConfirmationNoteController from './application-confirmation-note/ApplicationConfirmationNoteController'
import FreinetSettingsController from './freinet/FreinetSettingsController'

const RegionSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const RegionController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { freinetDataTransferEnabled } = useContext(ProjectConfigContext)
  const { t } = useTranslation('errors')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('notAuthorizedForRegionSettings') }}>
      {region && (
        <RegionSettingsContainer>
          <DataPrivacyCard />
          <RegionSettingsController regionId={region.id} />
          <ApplicationConfirmationNoteController regionId={region.id} />
          {freinetDataTransferEnabled && <FreinetSettingsController regionId={region.id} />}
        </RegionSettingsContainer>
      )}
    </RenderGuard>
  )
}

export default RegionController
