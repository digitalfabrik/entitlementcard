import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { useGetFreinetAgencyByRegionIdQuery, useUpdateDataTransferToFreinetMutation } from '../../../generated/graphql'
import getQueryResult from '../../../mui-modules/util/getQueryResult'
import { useAppToaster } from '../../AppToaster'
import FreinetSettingsCard from './FreinetSettingsCard'

type FreinetSettingsControllerProps = {
  regionId: number
  project: string
}

const FreinetSettingsController = ({ regionId, project }: FreinetSettingsControllerProps): ReactElement | null => {
  const appToaster = useAppToaster()
  const { t } = useTranslation('regionSettings')
  const freinetQuery = useGetFreinetAgencyByRegionIdQuery({
    variables: { regionId, project },
  })
  const [updateFreinetDataTransfer] = useUpdateDataTransferToFreinetMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
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
        project,
        dataTransferActivated: dataTransferForFreinetActivated,
      },
    })
  }

  return <FreinetSettingsCard agencyInformation={freinetQueryResult.data.agency} onSave={onSave} />
}

export default FreinetSettingsController
