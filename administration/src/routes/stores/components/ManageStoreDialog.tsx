import { Edit } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../components/ConfirmDialog'
import { AcceptingStoresData } from '../../applications/types/types'
import StoreForm from './StoreForm'

const ManageStoreDialog = ({
  open,
  onClose,
  activeStore,
  onConfirm,
  loading,
  isEditMode,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  activeStore?: AcceptingStoresData
  isEditMode: boolean
  loading: boolean
}): ReactElement => {
  const { t } = useTranslation('stores')

  // TODO adjust data to be in correct format (accepting store)

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? t('storeEditDialogHeadline') : t('storedAddDialogHeadline')}
      id={isEditMode ? 'edit-store-dialog' : 'add-store-dialog'}
      onConfirm={onConfirm}
      loading={loading}
      confirmButtonText={t('misc:save')}
      confirmButtonIcon={<Edit />}>
      <Stack sx={{ gap: 2 }}>
        <Typography variant='body1' sx={{ color: grey[700] }}>
          {isEditMode ? t('storesEditDialogDescription') : t('storesAddDialogDescription')}
        </Typography>
        <div>{activeStore?.name}</div>
        <StoreForm />
      </Stack>
    </ConfirmDialog>
  )
}

export default ManageStoreDialog
