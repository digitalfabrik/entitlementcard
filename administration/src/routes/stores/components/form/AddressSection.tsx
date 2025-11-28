import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../../cards/extensions/components/CardTextField'
import AlertBox from '../../../../components/AlertBox'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../StoreForm'
import { cityValidation, postalCodeValidation, streetValidation } from './validation'

const AddressSection = ({
  updateStore,
  formSendAttempt,
  getAddressCoordinates,
  showAddressError,
  acceptingStore,
}: {
  updateStore: UpdateStoreFunction
  formSendAttempt: boolean
  getAddressCoordinates: () => void
  showAddressError: boolean
  acceptingStore?: AcceptingStoreFormData
}): ReactElement => {
  const { t } = useTranslation('storeForm')

  return (
    <>
      <Typography variant='h6' marginY={0.5}>
        {t('addressSection')}
      </Typography>
      <CardTextField
        id='store-street-input'
        label={t('streetLabel')}
        placeholder={t('streetPlaceholder')}
        forceError={formSendAttempt}
        value={acceptingStore?.street ?? ''}
        onBlur={getAddressCoordinates}
        onChange={value => updateStore('street', value)}
        showError={streetValidation(acceptingStore?.street).invalid}
        errorMessage={streetValidation(acceptingStore?.street).message}
        required
      />
      <Box sx={{ flexDirection: 'row', gap: 2, display: 'flex' }}>
        <CardTextField
          id='store-postalCode-input'
          label={t('postalCodeLabel')}
          placeholder={t('postalCodePlaceholder')}
          value={acceptingStore?.postalCode ?? ''}
          forceError={formSendAttempt}
          onChange={value => updateStore('postalCode', value)}
          showError={postalCodeValidation(acceptingStore?.postalCode).invalid}
          errorMessage={postalCodeValidation(acceptingStore?.postalCode).message}
          required
          sx={{ flex: '0 0 25%' }}
        />
        <CardTextField
          id='store-city-input'
          label={t('cityLabel')}
          placeholder={t('cityPlaceholder')}
          value={acceptingStore?.city ?? ''}
          required
          onBlur={getAddressCoordinates}
          forceError={formSendAttempt}
          onChange={value => updateStore('city', value)}
          showError={cityValidation(acceptingStore?.city).invalid}
          errorMessage={cityValidation(acceptingStore?.city).message}
        />
      </Box>
      {showAddressError && <AlertBox title={t('errorAddressNotFound')} fullWidth severity='error' />}
    </>
  )
}

export default AddressSection
