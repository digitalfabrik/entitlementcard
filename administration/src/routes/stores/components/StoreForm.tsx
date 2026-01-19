import { Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../cards/extensions/components/CardTextField'
import { Category } from '../../../generated/graphql'
import { AcceptingStoreFormData, UpdateStoreFunction } from '../types'
import AddressSection from './form/AddressSection'
import CategorySection from './form/CategorySection'
import ContactSection from './form/ContactSection'
import DescriptionSection from './form/DescriptionSection'
import { nameValidation } from './form/validation'

const StoreForm = ({
  categories,
  onUpdateStore,
  formSendAttempt,
  getAddressCoordinates,
  showAddressError,
  acceptingStore,
}: {
  categories: Category[]
  onUpdateStore: UpdateStoreFunction
  formSendAttempt: boolean
  getAddressCoordinates: () => void
  showAddressError: boolean
  acceptingStore?: AcceptingStoreFormData
}): ReactElement => {
  const { t } = useTranslation('storeForm')

  return (
    <Stack sx={{ gap: 2 }} direction='column'>
      <Typography variant='h6' marginY={0.5}>
        {t('nameSection')}
      </Typography>
      <CardTextField
        id='store-name-input'
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        value={acceptingStore?.name ?? ''}
        forceError={formSendAttempt}
        onChange={value => onUpdateStore('name', value)}
        showError={nameValidation(acceptingStore?.name).invalid}
        errorMessage={nameValidation(acceptingStore?.name).message}
        required
      />
      <AddressSection
        acceptingStore={acceptingStore}
        onUpdateStore={onUpdateStore}
        formSendAttempt={formSendAttempt}
        getAddressCoordinates={getAddressCoordinates}
        showAddressError={showAddressError}
      />
      <CategorySection
        acceptingStore={acceptingStore}
        onUpdateStore={onUpdateStore}
        categories={categories}
        formSendAttempt={formSendAttempt}
      />
      <ContactSection
        acceptingStore={acceptingStore}
        onUpdateStore={onUpdateStore}
        formSendAttempt={formSendAttempt}
      />
      <DescriptionSection acceptingStore={acceptingStore} onUpdateStore={onUpdateStore} />
    </Stack>
  )
}

export default StoreForm
