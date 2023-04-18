import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role, useGetDataPolicyQuery } from '../../generated/graphql'
import useQueryHandler from '../hooks/useQueryHandler'
import RegionOverview from './RegionOverview'

const RegionController = ({ regionId }: { regionId: number }) => {
  const dataPolicyQuery = useGetDataPolicyQuery({
    variables: { regionId: regionId },
    onError: error => console.error(error),
  })
  const dataPolicyQueryResult = useQueryHandler(dataPolicyQuery)
  if (!dataPolicyQueryResult.successful) return dataPolicyQueryResult.component

  const dataPrivacyPolicy = dataPolicyQueryResult.data.dataPolicy.dataPrivacyPolicy ?? ''
  return <RegionOverview dataPrivacyPolicy={dataPrivacyPolicy} regionId={regionId} />
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
