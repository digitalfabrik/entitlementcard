import { Edit } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../components/ConfirmDialog'
import { useGetStoreCategoriesQuery } from '../../../generated/graphql'
import { getBuildConfig } from '../../../util/getBuildConfig'
import getQueryResult from '../../../util/getQueryResult'
import { AcceptingStoreFormData, UpdateStoreFunction } from '../types'
import StoreForm from './StoreForm'

const ManageStoreDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
  isEditMode,
  onUpdateStore,
  closeOnConfirm,
  formSendAttempt,
  getAddressCoordinates,
  showAddressError,
  acceptingStore,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isEditMode: boolean
  loading: boolean
  closeOnConfirm: boolean
  onUpdateStore: UpdateStoreFunction
  formSendAttempt: boolean
  getAddressCoordinates: () => void
  showAddressError: boolean
  acceptingStore?: AcceptingStoreFormData
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
      title={isEditMode ? t('storeEditDialogHeadline') : t('storeAddDialogHeadline')}
      onConfirm={onConfirm}
      loading={loading}
      maxWidth='md'
      closeOnConfirm={closeOnConfirm}
      confirmButtonText={t('misc:save')}
      confirmButtonIcon={<Edit />}
    >
      <Stack sx={{ gap: 2 }}>
        <Typography variant='body1' sx={{ color: grey[700] }}>
          {isEditMode ? t('storeEditDialogDescription') : t('storeAddDialogDescription')}
        </Typography>
        <StoreForm
          getAddressCoordinates={getAddressCoordinates}
          showAddressError={showAddressError}
          acceptingStore={acceptingStore}
          onUpdateStore={onUpdateStore}
          formSendAttempt={formSendAttempt}
          categories={categories.filter(category => projectCategories.includes(category.id))}
        />
      </Stack>
    </ConfirmDialog>
  )
}

export default ManageStoreDialog
