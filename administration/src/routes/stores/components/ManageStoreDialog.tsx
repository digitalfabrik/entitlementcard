import { Edit } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../components/ConfirmDialog'
import { useGetStoreCategoriesQuery } from '../../../generated/graphql'
import { getBuildConfig } from '../../../util/getBuildConfig'
import getQueryResult from '../../../util/getQueryResult'
import { AcceptingStoresData } from '../../applications/types/types'
import StoreForm, { AcceptingStoreFormData } from './StoreForm'

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
  descriptionEn: '',
  categoryId: store.category.id,
})

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
  const projectCategories = getBuildConfig(window.location.hostname).common.categories
  const storeCategoryQuery = useGetStoreCategoriesQuery()
  const storeCategoryQueryResult = getQueryResult(storeCategoryQuery)
  if (!storeCategoryQueryResult.successful) {
    return storeCategoryQueryResult.component
  }

  const { categories } = storeCategoryQueryResult.data

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? t('storeEditDialogHeadline') : t('storedAddDialogHeadline')}
      id={isEditMode ? 'edit-store-dialog' : 'add-store-dialog'}
      onConfirm={onConfirm}
      loading={loading}
      maxWidth='md'
      confirmButtonText={t('misc:save')}
      confirmButtonIcon={<Edit />}>
      <Stack sx={{ gap: 2 }}>
        <Typography variant='body1' sx={{ color: grey[700] }}>
          {isEditMode ? t('storesEditDialogDescription') : t('storesAddDialogDescription')}
        </Typography>
        <StoreForm
          activeStore={activeStore ? mapAcceptingStoreFormData(activeStore) : undefined}
          categories={categories.filter(category => projectCategories.includes(category.id))}
        />
      </Stack>
    </ConfirmDialog>
  )
}

export default ManageStoreDialog
