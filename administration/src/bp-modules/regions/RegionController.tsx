import { NonIdealState, Spinner } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Role, useGetDataPolicyQuery } from '../../generated/graphql'
import ErrorHandler from '../ErrorHandler'
import RegionOverview from './RegionOverview'

const RegionController = ({ regionId }: { regionId: number }) => {
  const { loading, error, data, refetch } = useGetDataPolicyQuery({
    variables: { regionId: regionId },
    onError: error => console.error(error),
  })
  if (loading) return <Spinner />
  else if (error || !data) return <ErrorHandler refetch={refetch} />
  else return <RegionOverview dataPrivacyPolicy={data.dataPolicy.dataPrivacyPolicy ?? ''} regionId={regionId} />
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
