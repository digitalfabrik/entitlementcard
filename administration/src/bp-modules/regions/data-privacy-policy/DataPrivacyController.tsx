import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { WhoAmIContext } from '../../../WhoAmIProvider'
import { Role, useGetDataPolicyQuery } from '../../../generated/graphql'
import getQueryResult from '../../util/getQueryResult'
import DataPrivacyOverview from './DataPrivacyOverview'

const DataPrivacyController = ({ regionId }: { regionId: number }) => {
  const dataPolicyQuery = useGetDataPolicyQuery({
    variables: { regionId },
    onError: error => console.error(error),
  })
  const dataPolicyQueryResult = getQueryResult(dataPolicyQuery)
  if (!dataPolicyQueryResult.successful) {
    return dataPolicyQueryResult.component
  }

  const dataPrivacyPolicy = dataPolicyQueryResult.data.dataPolicy.dataPrivacyPolicy ?? ''

  return <DataPrivacyOverview dataPrivacyPolicy={dataPrivacyPolicy} regionId={regionId} />
}

const DataPrivacyWithRegion = (): ReactElement => {
  const { region, role } = useContext(WhoAmIContext).me!
  if (!region || role !== Role.RegionAdmin) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Änderungen an der Datenschutzerklärung der Region vorzunehmen.'
      />
    )
  }
  return <DataPrivacyController regionId={region.id} />
}

export default DataPrivacyWithRegion
