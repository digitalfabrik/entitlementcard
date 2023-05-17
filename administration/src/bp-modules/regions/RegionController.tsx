import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import ActivatedForApplicationCard from './ActivatedForApplicationCard'
import DataPrivacyCard from './DataPrivacyCard'

const RegionSettingsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const RegionController = ({ regionId }: { regionId: number }) => {
  return (
    <RegionSettingsContainer>
      <DataPrivacyCard />
      <ActivatedForApplicationCard regionId={regionId} />
    </RegionSettingsContainer>
  )
}

const ControllerWithRegion = (): ReactElement => {
  const { region, role } = useContext(WhoAmIContext).me!
  if (!region || role !== Role.RegionAdmin) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Änderungen an der Region vorzunehmen.'
      />
    )
  } else {
    return <RegionController regionId={region.id} />
  }
}

export default ControllerWithRegion
