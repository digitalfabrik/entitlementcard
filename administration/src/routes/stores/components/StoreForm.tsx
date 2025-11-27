import { Stack, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../cards/extensions/components/CardTextField'
import { Category } from '../../../generated/graphql'
import AddressSection from './form/AddressSection'
import CategorySection from './form/CategorySection'
import ContactSection from './form/ContactSection'
import DescriptionSection from './form/DescriptionSection'

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
}

const StoreForm = ({
  activeStore,
  categories,
}: {
  activeStore?: AcceptingStoreFormData
  categories: Category[]
}): ReactElement => {
  const [acceptingStore, setAcceptingStore] = useState<AcceptingStoreFormData | undefined>(activeStore)

  const { t } = useTranslation('storeForm')
  const updateStore = <K extends keyof AcceptingStoreFormData>(field: K, value: AcceptingStoreFormData[K]) => {
    setAcceptingStore(
      prevStore =>
        ({
          ...prevStore,
          [field]: value,
        } as AcceptingStoreFormData)
    )
  }

  console.log(activeStore)
  console.log(acceptingStore)
  return (
    <Stack sx={{ gap: 2 }} direction='column'>
      <Typography variant='h6' marginY={1}>
        {t('nameSection')}
      </Typography>
      <CardTextField
        id='store-name-input'
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        value={acceptingStore?.name ?? ''}
        onChange={value => updateStore('name', value)}
        showError={!acceptingStore?.name}
        errorMessage={t('errorRequiredField')}
        required
      />
      <AddressSection acceptingStore={acceptingStore} updateStore={updateStore} />
      <CategorySection acceptingStore={acceptingStore} updateStore={updateStore} categories={categories} />
      <ContactSection acceptingStore={acceptingStore} updateStore={updateStore} />

      <DescriptionSection acceptingStore={acceptingStore} updateStore={updateStore} />
    </Stack>
  )
}

export default StoreForm
