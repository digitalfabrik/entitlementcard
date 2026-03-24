import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useMutation } from 'urql'

import CenteredCircularProgress from '../../../components/CenteredCircularProgress'
import RenderGuard from '../../../components/RenderGuard'
import messageFromGraphQlError from '../../../errors/getMessageFromApolloError'
import { ImportAcceptingStoresDocument, Role } from '../../../graphql'
import { StoresFieldConfig } from '../../../project-configs'
import { ProjectConfigContext } from '../../../provider/ProjectConfigContext'
import StoresButtonBar from './components/StoresButtonBar'
import StoresCSVInput from './components/StoresCSVInput'
import StoresImportResult from './components/StoresImportResult'
import StoresTable from './components/StoresTable'
import { AcceptingStoresEntry } from './utils/acceptingStoresEntry'

type StoreImportProps = {
  fields: StoresFieldConfig[]
}

export type StoresData = {
  [key: string]: string
}
const StoresImport = ({ fields }: StoreImportProps): ReactElement => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [acceptingStores, setAcceptingStores] = useState<AcceptingStoresEntry[]>([])
  const [dryRun, setDryRun] = useState<boolean>(false)
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false)
  const [importStoresState, importStoresMutation] = useMutation(ImportAcceptingStoresDocument)

  const goBack = () => {
    if (!acceptingStores.length) {
      navigate('/stores')
    } else {
      setAcceptingStores([])
    }
  }

  const onImportStores = async () => {
    const storesToImport = acceptingStores.map(store => {
      const storeData = store.data
      return {
        name: storeData.name,
        categoryId: Number(storeData.categoryId),
        discountDE: storeData.discountDE,
        discountEN: storeData.discountEN,
        email: storeData.email,
        homepage: storeData.homepage,
        houseNumber: storeData.houseNumber,
        latitude: Number(storeData.latitude),
        longitude: Number(storeData.longitude),
        location: storeData.location,
        postalCode: storeData.postalCode,
        street: storeData.street,
        telephone: storeData.telephone,
      }
    })

    const result = await importStoresMutation({
      stores: storesToImport,
      dryRun,
    })
    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else if (result.data) {
      const { result: importResult } = result.data
      enqueueSnackbar(
        <StoresImportResult
          dryRun={dryRun}
          storesUntouched={importResult.storesUntouched}
          storesDeleted={importResult.storesDeleted}
          storesCreated={importResult.storesCreated}
        />,
        {
          persist: true,
        },
      )
      setAcceptingStores([])
    }
  }

  return (
    <>
      {(importStoresState.fetching || isLoadingCoordinates) && <CenteredCircularProgress />}
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
      error={{ description: t('notAuthorizedToManageStores') }}
    >
      {storesManagement.enabled && <StoresImport fields={storesManagement.fields} />}
    </RenderGuard>
  )
}

export default StoresImportController
