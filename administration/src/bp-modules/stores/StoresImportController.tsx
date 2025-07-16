import { CircularProgress, styled } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Role, useImportAcceptingStoresMutation } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { StoresFieldConfig } from '../../project-configs/getProjectConfig'
import { useAppToaster } from '../AppToaster'
import { AcceptingStoresEntry } from './AcceptingStoresEntry'
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

export type StoresData = {
  [key: string]: string
}
const StoresImport = ({ fields }: StoreImportProps): ReactElement => {
  const { projectId } = useContext(ProjectConfigContext)
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

  const onImportStores = () => {
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

    importStores({
      variables: {
        stores: storesToImport,
        project: projectId,
        dryRun,
      },
    })
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
