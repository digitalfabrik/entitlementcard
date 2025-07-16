import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../../WhoAmIProvider'
import { Role, useGetDataPolicyQuery } from '../../../generated/graphql'
import RenderGuard from '../../../mui-modules/components/RenderGuard'
import getQueryResult from '../../../mui-modules/util/getQueryResult'
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
  const { region } = useWhoAmI().me
  const { t } = useTranslation('errors')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('notAuthorizedForDataPrivacy') }}>
      <DataPrivacyController regionId={region!.id} />
    </RenderGuard>
  )
}

export default DataPrivacyWithRegion
