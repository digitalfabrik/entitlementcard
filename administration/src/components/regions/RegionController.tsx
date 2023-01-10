import React, { ReactElement, useContext } from 'react'
import { WhoAmIContext } from '../../WhoAmIProvider'
import RegionOverview from './RegionOverview'
import { Role, useGetDataPolicyQuery } from '../../generated/graphql'
import ErrorHandler from '../../ErrorHandler'
import { Spinner } from '@blueprintjs/core'

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
  const { regionId, role } = useContext(WhoAmIContext).me!
  if (regionId === null || regionId === undefined || role !== Role.RegionAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Sie sind nicht berechtigt diese Seite aufzurufen.</p>
      </div>
    )
  } else {
    return <RegionController regionId={regionId} />
  }
}

export default ControllerWithRegion
