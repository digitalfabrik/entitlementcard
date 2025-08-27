import { CircularProgress, styled } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Role, useImportAcceptingStoresMutation } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { StoresFieldConfig } from '../../project-configs/getProjectConfig'
import downloadDataUri from '../../util/downloadDataUri'
import { useAppToaster } from '../AppToaster'
import { AcceptingStoresEntry } from './AcceptingStoresEntry'
import { generateCsv } from './StoreCSVOutput'
import StoresButtonBar from './StoresButtonBar'
import StoresCSVInput from './StoresCSVInput'
import StoresImportResult from './StoresImportResult'
import StoresTable from './StoresTable'

const CenteredSpinner = styled(CircularProgress)`
  z-index: 999;
  top: 50%;
  left: 50%;
  position: fixed;
`

type StoreImportProps = {
  fields: StoresFieldConfig[]
}

const StoresImport = ({ fields }: StoreImportProps): ReactElement => {
  const { t } = useTranslation('stores')
  const navigate = useNavigate()
  const appToaster = useAppToaster()
  const [acceptingStores, setAcceptingStores] = useState<AcceptingStoresEntry[]>([])
  const [dryRun, setDryRun] = useState<boolean>(false)
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false)
  const [importStores, { loading: isApplyingStoreTransaction }] = useImportAcceptingStoresMutation({
    onCompleted: ({ result }) => {
      appToaster?.show({
        intent: 'none',
        timeout: 0,
        message: (
          <StoresImportResult
            dryRun={dryRun}
            storesUntouched={result.storesUntouched}
            storesDeleted={result.storesDeleted}
            storesCreated={result.storesCreated}
          />
        ),
      })
      setAcceptingStores([])
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
  })

  const goBack = () => {
    if (!acceptingStores.length) {
      navigate('/stores')
    } else {
      setAcceptingStores([])
    }
  }

  const preparedStoresForImport = acceptingStores.map(store => {
    const storeData = store.data
    return {
      name: storeData.name,
      street: storeData.street,
      houseNumber: storeData.houseNumber,
      postalCode: storeData.postalCode,
      location: storeData.location,
      latitude: Number(storeData.latitude),
      longitude: Number(storeData.longitude),
      telephone: storeData.telephone,
      email: storeData.email,
      homepage: storeData.homepage,
      discountDE: storeData.discountDE,
      discountEN: storeData.discountEN,
      categoryId: Number(storeData.categoryId),
    }
  })

  const onImportStores = () => {
    importStores({
      variables: {
        stores: preparedStoresForImport,
        dryRun,
      },
    })
  }

  const downloadStoreCsv = () => {
    try {
      downloadDataUri(generateCsv(preparedStoresForImport), `${t('csvFileName')}.csv`)
    } catch {
      appToaster?.show({
        message: 'exportCsvNotPossible',
        intent: 'danger',
      })
    }
  }

  return (
    <>
      {(isApplyingStoreTransaction || isLoadingCoordinates) && <CenteredSpinner />}
      {acceptingStores.length === 0 ? (
        <StoresCSVInput
          setAcceptingStores={setAcceptingStores}
          fields={fields}
          setIsLoadingCoordinates={setIsLoadingCoordinates}
        />
      ) : (
        <StoresTable fields={fields} acceptingStores={acceptingStores} />
      )}
      <StoresButtonBar
        goBack={goBack}
        downloadStoreCsv={downloadStoreCsv}
        acceptingStores={acceptingStores}
        importStores={onImportStores}
        dryRun={dryRun}
        setDryRun={setDryRun}
      />
    </>
  )
}

const StoresImportController = (): ReactElement => {
  const storesManagement = useContext(ProjectConfigContext).storesManagement
  const { t } = useTranslation('errors')

  return (
    <RenderGuard
      allowedRoles={[Role.ProjectStoreManager]}
      condition={storesManagement.enabled}
      error={{ description: t('notAuthorizedToManageStores') }}>
      {storesManagement.enabled && <StoresImport fields={storesManagement.fields} />}
    </RenderGuard>
  )
}

export default StoresImportController
