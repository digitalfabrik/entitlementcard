import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
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
  const { region, role } = useWhoAmI().me
  const { freinetDataTransferEnabled, projectId } = useContext(ProjectConfigContext)
  const { t } = useTranslation('errors')
  if (!region || role !== Role.RegionAdmin) {
    return <NonIdealState icon='cross' title={t('notAuthorized')} description={t('notAuthorizedForRegionSettings')} />
  }
  return (
    <RegionSettingsContainer>
      <DataPrivacyCard />
      <RegionSettingsController regionId={region.id} />
      <ApplicationConfirmationNoteController regionId={region.id} />
      {freinetDataTransferEnabled && <FreinetSettingsController regionId={region.id} project={projectId} />}
    </RegionSettingsContainer>
  )
}

export default RegionController
