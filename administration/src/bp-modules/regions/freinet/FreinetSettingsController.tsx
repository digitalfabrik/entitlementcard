import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { useGetFreinetAgencyByRegionIdQuery, useUpdateDataTransferToFreinetMutation } from '../../../generated/graphql'
import getQueryResult from '../../../mui-modules/util/getQueryResult'
import { useAppToaster } from '../../AppToaster'
import FreinetSettingsCard from './FreinetSettingsCard'

const FreinetSettingsController = ({ regionId }: { regionId: number }): ReactElement | null => {
  const appToaster = useAppToaster()
  const { t } = useTranslation('regionSettings')
  const [dataTransferActivated, setDataTransferActivated] = useState(false)
  const freinetQuery = useGetFreinetAgencyByRegionIdQuery({
    variables: { regionId },
    onCompleted: result => {
      if (result.agency) {
        setDataTransferActivated(result.agency.dataTransferActivated)
      }
    },
  })
  const [updateFreinetDataTransfer] = useUpdateDataTransferToFreinetMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
      setDataTransferActivated(!dataTransferActivated)
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('freinetActivateDataTransferSuccessful') })
    },
  })

  const freinetQueryResult = getQueryResult(freinetQuery)
  if (!freinetQueryResult.successful) {
    return freinetQueryResult.component
  }

  if (freinetQueryResult.data.agency == null) {
    return null
  }

  const onSave = (dataTransferForFreinetActivated: boolean) => {
    updateFreinetDataTransfer({
      variables: {
        regionId,
        dataTransferActivated: dataTransferForFreinetActivated,
      },
    })
  }

  return (
    <FreinetSettingsCard
      agencyInformation={freinetQueryResult.data.agency}
      onSave={onSave}
      dataTransferActivated={dataTransferActivated}
      setDataTransferActivated={setDataTransferActivated}
    />
  )
}

export default FreinetSettingsController
