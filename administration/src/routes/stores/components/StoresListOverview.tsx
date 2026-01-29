import { AddBusiness, AddBusinessOutlined, FileUpload } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Blankslate from '../../../components/Blankslate'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import {
  AcceptingStoreInput,
  useAddAcceptingStoreMutation,
  useEditAcceptingStoreMutation,
} from '../../../generated/graphql'
import { AcceptingStoresData } from '../../applications/types/types'
import { getStoreCoordinates } from '../../region/util/storeGeoDataService'
import { splitStreetAndHouseNumber } from '../import/utils/splitStreetAndHouseNumber'
import { AcceptingStoreFormData } from '../types'
import ManageStoreDialog from './ManageStoreDialog'
import StoresListTable from './StoresListTable'
import { isAddressInvalid, isStoreFormInvalid } from './form/validation'

const initializeAcceptingStoreForm = (store: AcceptingStoresData): AcceptingStoreFormData => ({
  id: store.id,
  name: store.name ?? '',
  street: splitStreetAndHouseNumber(store.physicalStore?.address.street).street,
  houseNumber: splitStreetAndHouseNumber(store.physicalStore?.address.street).houseNumber,
  postalCode: store.physicalStore?.address.postalCode ?? '',
  city: store.physicalStore?.address.location ?? '',
  telephone: store.contact.telephone ?? '',
  email: store.contact.email ?? '',
  homepage: store.contact.website ?? '',
  descriptionDe: store.descriptions?.find(desc => desc.locale === 'DE')?.text ?? '',
  descriptionEn: store.descriptions?.find(desc => desc.locale === 'EN')?.text ?? '',
  categoryId: store.category.id,
  longitude: store.physicalStore?.coordinates.lng ?? undefined,
  latitude: store.physicalStore?.coordinates.lat ?? undefined,
})

const mapFormDataToCsvAcceptingStore = (store: AcceptingStoreFormData): AcceptingStoreInput => ({
  name: store.name,
  street: store.street,
  houseNumber: store.houseNumber,
  postalCode: store.postalCode,
  location: store.city,
  telephone: store.telephone,
  email: store.email,
  homepage: store.homepage,
  discountDE: store.descriptionDe,
  discountEN: store.descriptionEn,
  categoryId: store.categoryId,
  longitude: store.longitude!,
  latitude: store.latitude!,
})

const StoresListOverview = ({
  data,
  refetchStores,
}: {
  data: AcceptingStoresData[]
  refetchStores: () => void
}): ReactElement => {
  const { t } = useTranslation('stores')
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [formSendAttempt, setFormSendAttempt] = useState(false)
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false)
  const [showAddressError, setShowAddressError] = useState(false)
  const [acceptingStore, setAcceptingStore] = useState<AcceptingStoreFormData>()
  const { enqueueSnackbar } = useSnackbar()
  const formFieldsAreValid = acceptingStore !== undefined && !isStoreFormInvalid(acceptingStore)
  const [addAcceptingStore, { loading: isAddingStore }] = useAddAcceptingStoreMutation({
    onCompleted: () => {
      enqueueSnackbar(t('storeAdded'), { variant: 'success' })
      setAcceptingStore(undefined)
      refetchStores()
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
  })

  const [editAcceptingStore, { loading: isEditingStore }] = useEditAcceptingStoreMutation({
    onCompleted: () => {
      enqueueSnackbar(t('storeEdited'), { variant: 'success' })
      setAcceptingStore(undefined)
      refetchStores()
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
  })

  const openEditStoreDialog = (storeId: number) => {
    const activeStore = data.find(store => store.id === storeId)
    if (activeStore) {
      setOpenEditDialog(true)
      setAcceptingStore(initializeAcceptingStoreForm(activeStore))
    }
  }
  const openAddStoreDialog = () => {
    setAcceptingStore(undefined)
    setOpenEditDialog(true)
  }

  const closeStoreDialog = () => {
    setFormSendAttempt(false)
    setShowAddressError(false)
    setOpenEditDialog(false)
  }

  const saveStore = () => {
    setFormSendAttempt(true)
    if (formFieldsAreValid) {
      const mappedStore = mapFormDataToCsvAcceptingStore(acceptingStore)
      if (acceptingStore.id == null) {
        addAcceptingStore({ variables: { store: mappedStore } })
      } else {
        editAcceptingStore({ variables: { storeId: acceptingStore.id, store: mappedStore } })
      }
    } else {
      enqueueSnackbar(t('storeForm:errorInvalidStoreForm'), { variant: 'error' })
    }
  }

  const updateStore = <K extends keyof AcceptingStoreFormData>(
    field: K,
    value: AcceptingStoreFormData[K],
  ) => {
    setAcceptingStore(
      prevStore =>
        ({
          ...prevStore,
          [field]: value,
        }) as AcceptingStoreFormData,
    )
  }

  const getAddressCoordinates = async () => {
    if (
      acceptingStore !== undefined &&
      acceptingStore.houseNumber &&
      acceptingStore.houseNumber.length > 0 &&
      acceptingStore.street &&
      acceptingStore.street.length > 0 &&
      acceptingStore.city &&
      acceptingStore.city.length > 0 &&
      !isAddressInvalid(acceptingStore)
    ) {
      try {
        setIsFetchingCoordinates(true)
        const position = await getStoreCoordinates(
          acceptingStore.city,
          `${acceptingStore.street} ${acceptingStore.houseNumber}`,
        )
        const hasValidPosition = position?.length === 2
        updateStore('longitude', hasValidPosition ? position[0] : undefined)
        updateStore('latitude', hasValidPosition ? position[1] : undefined)
        setShowAddressError(!hasValidPosition)
      } catch {
        enqueueSnackbar(t('storeForm:errorGeoServiceNotReachable'), { variant: 'error' })
      } finally {
        setIsFetchingCoordinates(false)
      }
    }
  }

  const fileUploadButton = (
    <Button color='primary' startIcon={<FileUpload />} href='./import'>
      {t('storesCsvImport')}
    </Button>
  )

  const addStoreButton = (
    <Button
      color='primary'
      variant='contained'
      startIcon={<AddBusiness />}
      onClick={openAddStoreDialog}
    >
      {t('addStoreButton')}
    </Button>
  )

  return (
    <>
      {data.length === 0 ? (
        <Blankslate
          containerSx={{ m: 4 }}
          icon={<AddBusinessOutlined color='disabled' sx={{ fontSize: '64px' }} />}
          title={t('storesListOverviewNoEntryTitle')}
          description={t('storesListOverviewNoEntryDescription')}
        >
          {addStoreButton}
          {fileUploadButton}
        </Blankslate>
      ) : (
        <>
          <Box sx={{ py: 2, justifyContent: 'flex-end', display: 'flex', gap: 2 }}>
            {addStoreButton}
            {fileUploadButton}
          </Box>
          <StoresListTable
            data={data}
            onEditStore={openEditStoreDialog}
            onDeleteStore={() => {
              /* TODO */
            }}
          />
        </>
      )}
      <ManageStoreDialog
        loading={isFetchingCoordinates || isAddingStore || isEditingStore}
        open={openEditDialog}
        showAddressError={showAddressError}
        isEditMode={acceptingStore?.id !== undefined}
        acceptingStore={acceptingStore}
        closeOnConfirm={formFieldsAreValid}
        onUpdateStore={updateStore}
        onClose={closeStoreDialog}
        onConfirm={saveStore}
        formSendAttempt={formSendAttempt}
        getAddressCoordinates={getAddressCoordinates}
      />
    </>
  )
}

export default StoresListOverview
