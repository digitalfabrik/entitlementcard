import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import DataPrivacyCard from './DataPrivacyCard'
import RegionSettingsController from './RegionSettingsController'

const RegionSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const RegionController = (): ReactElement => {
  const { region, role } = useWhoAmI().me
  const { t } = useTranslation('errors')
  if (!region || role !== Role.RegionAdmin) {
    return <NonIdealState icon='cross' title={t('notAuthorized')} description={t('notAuthorizedForRegionSettings')} />
  }
  return (
    <RegionSettingsContainer>
      <DataPrivacyCard />
      <RegionSettingsController regionId={region.id} />
    </RegionSettingsContainer>
  )
}

export default RegionController
