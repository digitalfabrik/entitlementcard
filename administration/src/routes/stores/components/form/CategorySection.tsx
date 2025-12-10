import { Box, Typography } from '@mui/material'
import React, { ReactElement, useId } from 'react'
import { useTranslation } from 'react-i18next'

import CustomSelect from '../../../../components/CustomSelect'
import { Category } from '../../../../generated/graphql'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../../types'

const CategorySection = ({
  acceptingStore,
  onUpdateStore,
  categories,
  formSendAttempt,
}: {
  acceptingStore?: AcceptingStoreFormData
  onUpdateStore: UpdateStoreFunction
  categories: Category[]
  formSendAttempt: boolean
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  const categorySelected = acceptingStore?.categoryId !== undefined
  const labelId = useId()
  return (
    <Box>
      <Typography variant='h6' marginTop={1} marginBottom={2}>
        {t('categorySection')}
      </Typography>
      <CustomSelect
        options={categories}
        forceError={formSendAttempt}
        onChange={value => onUpdateStore('categoryId', Number(value))}
        id={labelId}
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
