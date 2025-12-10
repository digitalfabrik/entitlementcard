import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import {
  useGetFreinetAgencyByRegionIdQuery,
  useUpdateDataTransferToFreinetMutation,
} from '../../../generated/graphql'
import getQueryResult from '../../../util/getQueryResult'
import FreinetSettingsCard from './FreinetSettingsCard'

const FreinetSettingsController = ({ regionId }: { regionId: number }): ReactElement | null => {
  const { enqueueSnackbar } = useSnackbar()
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
      enqueueSnackbar(title, { variant: 'error' })
      setDataTransferActivated(!dataTransferActivated)
    },
    onCompleted: () => {
      enqueueSnackbar(t('freinetActivateDataTransferSuccessful'), { variant: 'success' })
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
