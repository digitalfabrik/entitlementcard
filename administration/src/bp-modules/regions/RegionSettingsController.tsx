import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSnackbar } from '../../AppSnackbar'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetRegionSettingsByIdQuery, useUpdateRegionSettingsMutation } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import RegionSettingsCard from './RegionSettingsCard'

const RegionSettingsController = ({ regionId }: { regionId: number }): ReactElement => {
  const appSnackbar = useAppSnackbar()
  const { t } = useTranslation('regionSettings')
  const regionSettingsByIdQuery = useGetRegionSettingsByIdQuery({
    variables: { regionId },
  })

  const [updateRegionSettings, { loading }] = useUpdateRegionSettingsMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appSnackbar.enqueueError(title)
    },
    onCompleted: () => {
      appSnackbar.enqueueSuccess(t('savedSettingsSuccessful'))
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
