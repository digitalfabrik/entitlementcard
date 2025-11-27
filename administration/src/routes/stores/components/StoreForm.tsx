import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../cards/extensions/components/CardTextField'
import FormAlert from '../../../components/FormAlert'
import { AcceptingStoresData } from '../../applications/types/types'
import AddressSection from './form/AddressSection'
import ContactSection from './form/ContactSection'
import DescriptionSection from './form/DescriptionSection'

export type UpdateStoreFunction = <K extends keyof AcceptingStoreFormData>(
  field: K,
  value: AcceptingStoreFormData[K]
) => void

export type AcceptingStoreFormData = {
  name: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  categoryId: number
  telephone: string
  email: string
  homepage: string
  descriptionDe: string
  descriptionEn: string
}

const StoreForm = ({ activeStore }: { activeStore?: AcceptingStoresData }): ReactElement => {
  const [acceptingStore, setAcceptingStore] = useState<AcceptingStoreFormData>()
  const [categoryTouched, setCategoryTouched] = useState(false)

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
      <Typography variant='h6' marginY={1}>
        {t('categorySection')}
      </Typography>
      <FormControl fullWidth size='small' required>
        <InputLabel id='category-label' shrink={acceptingStore?.categoryId !== undefined}>
          {t('selectCategory')}
        </InputLabel>
        <Select
          notched={acceptingStore?.categoryId !== undefined}
          size='small'
          fullWidth
          labelId='category-label'
          label={t('selectRole')}
          value={acceptingStore?.categoryId ?? ''}
          onBlur={() => setCategoryTouched(true)}
          onChange={e => updateStore('categoryId', Number(e.target.value))}>
          <MenuItem value={1}>Test</MenuItem>
        </Select>
      </FormControl>
      {categoryTouched && acceptingStore?.categoryId === undefined && (
        <FormAlert errorMessage={t('errorRequiredField')} />
      )}
      <ContactSection acceptingStore={acceptingStore} updateStore={updateStore} />

      <DescriptionSection acceptingStore={acceptingStore} updateStore={updateStore} />
    </Stack>
  )
}

export default StoreForm
