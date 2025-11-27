import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import CustomSelect from '../../../../components/CustomSelect'
import { Category } from '../../../../generated/graphql'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../StoreForm'

const CategorySection = ({
  acceptingStore,
  updateStore,
  categories,
  formSendAttempt,
}: {
  acceptingStore?: AcceptingStoreFormData
  updateStore: UpdateStoreFunction
  categories: Category[]
  formSendAttempt: boolean
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  const categorySelected = acceptingStore?.categoryId !== undefined
  return (
    <Box>
      <Typography variant='h6' marginTop={1} marginBottom={2}>
        {t('categorySection')}
      </Typography>
      <CustomSelect
        options={categories}
        forceError={formSendAttempt}
        onChange={value => updateStore('categoryId', Number(value))}
        id='store-category'
        label={t('selectCategory')}
        fullWidth
        required
        value={acceptingStore?.categoryId}
        showError={!categorySelected}
        errorMessage={t('errorRequiredField')}
      />
    </Box>
  )
}

export default CategorySection
