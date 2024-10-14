import React, { ReactElement } from 'react'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetRegionSettingsByIdQuery, useUpdateRegionSettingsMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import getQueryResult from '../util/getQueryResult'
import RegionSettingsCard from './RegionSettingsCard'

const RegionSettingsController = ({ regionId }: { regionId: number }): ReactElement => {
  const appToaster = useAppToaster()
  const regionSettingsByIdQuery = useGetRegionSettingsByIdQuery({
    variables: { regionId },
  })

  const [updateRegionSettings, { loading }] = useUpdateRegionSettingsMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Einstellungen wurden erfolgreich geändert.' })
    },
  })

  const regionSettingsByIdQueryResult = getQueryResult(regionSettingsByIdQuery)
  if (!regionSettingsByIdQueryResult.successful) {
    return regionSettingsByIdQueryResult.component
  }

  const onSave = (activatedForApplication: boolean, activatedForConfirmationMail: boolean) => {
    updateRegionSettings({
      variables: {
        regionId,
        activatedForApplication,
        activatedForConfirmationMail,
      },
    })
  }

  const { activatedForApplication, activatedForCardConfirmationMail } = regionSettingsByIdQueryResult.data.result

  return (
    <RegionSettingsCard
      onSave={onSave}
      loading={loading}
      defaultApplicationActivation={activatedForApplication}
      defaultConfirmationMailActivation={activatedForCardConfirmationMail}
    />
  )
}

export default RegionSettingsController
