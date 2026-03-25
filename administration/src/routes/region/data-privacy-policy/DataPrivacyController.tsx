import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import RenderGuard from '../../../components/RenderGuard'
import { GetDataPolicyDocument, Role } from '../../../graphql'
import { useWhoAmI } from '../../../provider/WhoAmIProvider'
import getQueryResult from '../../../util/getQueryResult'
import DataPrivacyOverview from './DataPrivacyOverview'

const DataPrivacyController = ({ regionId }: { regionId: number }) => {
  const [dataPolicyState, dataPolicyQuery] = useQuery({
    query: GetDataPolicyDocument,
    variables: { regionId },
  })
  const dataPolicyQueryResult = getQueryResult(dataPolicyState, dataPolicyQuery)
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
      condition={region !== null}
      error={{ description: t('notAuthorizedForDataPrivacy') }}
    >
      {region && <DataPrivacyController regionId={region.id} />}
    </RenderGuard>
  )
}

export default DataPrivacyWithRegion
