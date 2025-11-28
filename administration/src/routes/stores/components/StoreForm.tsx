import { Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../cards/extensions/components/CardTextField'
import { Category } from '../../../generated/graphql'
import AddressSection from './form/AddressSection'
import CategorySection from './form/CategorySection'
import ContactSection from './form/ContactSection'
import DescriptionSection from './form/DescriptionSection'
import { nameValidation } from './form/validation'

export type UpdateStoreFunction = <K extends keyof AcceptingStoreFormData>(
  field: K,
  value: AcceptingStoreFormData[K]
) => void

export type AcceptingStoreFormData = {
  id: number
  name: string
  street: string
  postalCode: string
  city: string
  categoryId: number
  telephone: string
  email: string
  homepage: string
  descriptionDe: string
  descriptionEn: string
  longitude?: number
  latitude?: number
}

const StoreForm = ({
  categories,
  updateStore,
  formSendAttempt,
  getAddressCoordinates,
  showAddressError,
  acceptingStore,
}: {
  categories: Category[]
  updateStore: UpdateStoreFunction
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
        onChange={value => updateStore('name', value)}
        showError={nameValidation(acceptingStore?.name).invalid}
        errorMessage={nameValidation(acceptingStore?.name).message}
        required
      />
      <AddressSection
        acceptingStore={acceptingStore}
        updateStore={updateStore}
        formSendAttempt={formSendAttempt}
        getAddressCoordinates={getAddressCoordinates}
        showAddressError={showAddressError}
      />
      <CategorySection
        acceptingStore={acceptingStore}
        updateStore={updateStore}
        categories={categories}
        formSendAttempt={formSendAttempt}
      />
      <ContactSection acceptingStore={acceptingStore} updateStore={updateStore} formSendAttempt={formSendAttempt} />
      <DescriptionSection acceptingStore={acceptingStore} updateStore={updateStore} />
    </Stack>
  )
}

export default StoreForm
