import { AddBusinessOutlined, FileUpload, AddBusiness } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Blankslate from '../../../components/Blankslate'
import { AcceptingStoresData } from '../../applications/types/types'
import ManageStoreDialog from './ManageStoreDialog'
import { AcceptingStoreFormData } from './StoreForm'
import StoresListTable from './StoresListTable'
import { isDevelopmentEnvironment } from '../../../util/helper'

const mapAcceptingStoreFormData = (store: AcceptingStoresData): AcceptingStoreFormData => ({
  id: store.id,
  name: store.name ?? '',
  street: store.physicalStore?.address.street ?? '',
  postalCode: store.physicalStore?.address.postalCode ?? '',
  city: store.physicalStore?.address.location ?? '',
  telephone: store.contact.telephone ?? '',
  email: store.contact.email ?? '',
  homepage: store.contact.website ?? '',
  descriptionDe: store.description ?? '',
  // TODO 2692 map english description field
  descriptionEn: '',
  categoryId: store.category.id,
})
const StoresListOverview = ({ data }: { data: AcceptingStoresData[] }): ReactElement => {
  const { t } = useTranslation('stores')
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [acceptingStore, setAcceptingStore] = useState<AcceptingStoreFormData>()
  const { enqueueSnackbar } = useSnackbar()

  const editStore = (storeId: number) => {
    const activeStore = data.find(store => store.id === storeId)
    if (activeStore) {
      setOpenEditDialog(true)
      setAcceptingStore(mapAcceptingStoreFormData(activeStore))
    }
  }

  // TODO #2472 send data to the addStore endpoint
  const addStore = () => {
      setOpenEditDialog(true)
  }

  // TODO 2692 send data to the editStore endpoint
  const saveStore = () => {
    enqueueSnackbar('Save action not yet implemented.', { variant: 'warning' })
  }

  const updateStore = <K extends keyof AcceptingStoreFormData>(field: K, value: AcceptingStoreFormData[K]) => {
    setAcceptingStore(
      prevStore =>
        ({
          ...prevStore,
          [field]: value,
        } as AcceptingStoreFormData)
    )
  }

  const fileUploadButton = (
    <Button color='primary' startIcon={<FileUpload />} href='./import'>
      {t('storesCsvImport')}
    </Button>
  )

  const addStoreButton = (
    <Button color='primary' variant='contained' startIcon={<AddBusiness />} onClick={addStore}>
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
          description={t('storesListOverviewNoEntryDescription')}>
          {addStoreButton}
          {fileUploadButton}
        </Blankslate>
      ) : (
        <>
          <Box sx={{ py: 2, justifyContent: 'flex-end', display: 'flex', gap:2 }}>
            {/* TODO 2692 remove this button when the addStore endpoint is implemented */}
            {isDevelopmentEnvironment() && addStoreButton}
            {fileUploadButton}
          </Box>
          <StoresListTable data={data} editStore={editStore} />
        </>
      )}
      <ManageStoreDialog
        loading={false}
        open={openEditDialog}
        isEditMode={acceptingStore !== undefined}
        acceptingStore={acceptingStore}
        updateStore={updateStore}
        onClose={() => setOpenEditDialog(false)}
        onConfirm={saveStore}
      />
    </>
  )
}

export default StoresListOverview
