import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { useGetFreinetAgencyByRegionIdQuery, useUpdateDataTransferToFreinetMutation } from '../../../generated/graphql'
import { useAppToaster } from '../../AppToaster'
import getQueryResult from '../../util/getQueryResult'
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
      const { title } = getMessageFromApolloError(error, t)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('freinetActivateDataTransferSuccessful') })
    },
  })

  const freinetQueryResult = getQueryResult(freinetQuery, t)
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
