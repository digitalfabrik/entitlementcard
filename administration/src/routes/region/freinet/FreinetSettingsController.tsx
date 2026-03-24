import { useSnackbar } from 'notistack'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import { messageFromGraphQlError } from '../../../errors'
import {
  GetFreinetAgencyByRegionIdDocument,
  UpdateDataTransferToFreinetDocument,
} from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'
import FreinetSettingsCard from './FreinetSettingsCard'

const FreinetSettingsController = ({ regionId }: { regionId: number }): ReactElement | null => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('regionSettings')
  const [dataTransferActivated, setDataTransferActivated] = useState(false)
  const [freinetAgencyState, freinetAgencyQuery] = useQuery({
    query: GetFreinetAgencyByRegionIdDocument,
    variables: { regionId },
  })

  useEffect(() => {
    if (freinetAgencyState.data?.agency) {
      setDataTransferActivated(freinetAgencyState.data.agency.dataTransferActivated)
    }
  }, [freinetAgencyState.data])

  const [, updateDataTransferMutation] = useMutation(UpdateDataTransferToFreinetDocument)

  const freinetQueryResult = getQueryResult(freinetAgencyState, freinetAgencyQuery)
  if (!freinetQueryResult.successful) {
    return freinetQueryResult.component
  }

  if (freinetQueryResult.data.agency == null) {
    return null
  }

  const onSave = async (dataTransferForFreinetActivated: boolean) => {
    const result = await updateDataTransferMutation({
      regionId,
      dataTransferActivated: dataTransferForFreinetActivated,
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
      setDataTransferActivated(!dataTransferForFreinetActivated)
    } else {
      enqueueSnackbar(t('freinetActivateDataTransferSuccessful'), { variant: 'success' })
    }
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
