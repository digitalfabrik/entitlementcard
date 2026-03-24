import { useSnackbar } from 'notistack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import messageFromGraphQlError from '../../errors/getMessageFromApolloError'
import { GetRegionSettingsByIdDocument, UpdateRegionSettingsDocument } from '../../graphql'
import getQueryResult from '../../util/getQueryResult'
import RegionSettingsCard from './components/RegionSettingsCard'

const RegionSettingsController = ({ regionId }: { regionId: number }): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('regionSettings')
  const [regionSettingsState, regionSettingsQuery] = useQuery({
    query: GetRegionSettingsByIdDocument,
    variables: { regionId },
  })

  const [updateRegionSettingsState, updateRegionSettingsMutation] = useMutation(
    UpdateRegionSettingsDocument,
  )
  const regionSettingsByIdQueryResult = getQueryResult(regionSettingsState, regionSettingsQuery)

  if (!regionSettingsByIdQueryResult.successful) {
    return regionSettingsByIdQueryResult.component
  }

  const onSave = async (
    activatedForApplication: boolean,
    activatedForConfirmationMail: boolean,
  ) => {
    const result = await updateRegionSettingsMutation({
      regionId,
      activatedForApplication,
      activatedForConfirmationMail,
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else {
      enqueueSnackbar(t('savedSettingsSuccessful'), { variant: 'success' })
    }
  }

  const { activatedForApplication, activatedForCardConfirmationMail } =
    regionSettingsByIdQueryResult.data.result

  return (
    <RegionSettingsCard
      onSave={onSave}
      loading={updateRegionSettingsState.fetching}
      defaultApplicationActivation={activatedForApplication}
      defaultConfirmationMailActivation={activatedForCardConfirmationMail}
    />
  )
}

export default RegionSettingsController
