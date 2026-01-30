import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { ReactElement, useId } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../../cards/extensions/components/CardTextField'
import AlertBox from '../../../../components/AlertBox'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../../types'
import {
  cityValidation,
  houseNumberValidation,
  postalCodeValidation,
  streetValidation,
} from './validation'

const AddressSection = ({
  onUpdateStore,
  formSendAttempt,
  getAddressCoordinates,
  showAddressError,
  acceptingStore,
}: {
  onUpdateStore: UpdateStoreFunction
  formSendAttempt: boolean
  getAddressCoordinates: () => void
  showAddressError: boolean
  acceptingStore?: AcceptingStoreFormData
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  const streetLabelId = useId()
  const houseNumberLabelId = useId()
  const postalCodelabelId = useId()
  const cityLabelId = useId()

  return (
    <>
      <Typography variant='h6' marginY={0.5}>
        {t('addressSection')}
      </Typography>
      <Box sx={{ flexDirection: 'row', gap: 2, display: 'flex' }}>
        <CardTextField
          id={streetLabelId}
          label={t('streetLabel')}
          placeholder={t('streetPlaceholder')}
          forceError={formSendAttempt}
          value={acceptingStore?.street ?? ''}
          onBlur={getAddressCoordinates}
          onChange={value => onUpdateStore('street', value)}
          showError={streetValidation(acceptingStore?.street).invalid}
          errorMessage={streetValidation(acceptingStore?.street).message}
          required
        />
        <CardTextField
          id={houseNumberLabelId}
          label={t('houseNumberLabel')}
          placeholder={t('houseNumberPlaceholder')}
          forceError={formSendAttempt}
          value={acceptingStore?.houseNumber ?? ''}
          onBlur={getAddressCoordinates}
          onChange={value => onUpdateStore('houseNumber', value)}
          showError={houseNumberValidation(acceptingStore?.houseNumber).invalid}
          errorMessage={houseNumberValidation(acceptingStore?.houseNumber).message}
          required
          sx={{ flex: '0 0 25%' }}
        />
      </Box>
      <Box sx={{ flexDirection: 'row', gap: 2, display: 'flex' }}>
        <CardTextField
          id={postalCodelabelId}
          label={t('postalCodeLabel')}
          placeholder={t('postalCodePlaceholder')}
          value={acceptingStore?.postalCode ?? ''}
          forceError={formSendAttempt}
          onChange={value => onUpdateStore('postalCode', value)}
          showError={postalCodeValidation(acceptingStore?.postalCode).invalid}
          errorMessage={postalCodeValidation(acceptingStore?.postalCode).message}
          required
          sx={{ flex: '0 0 25%' }}
        />
        <CardTextField
          id={cityLabelId}
          label={t('cityLabel')}
          placeholder={t('cityPlaceholder')}
          value={acceptingStore?.city ?? ''}
          required
          onBlur={getAddressCoordinates}
          forceError={formSendAttempt}
          onChange={value => onUpdateStore('city', value)}
          showError={cityValidation(acceptingStore?.city).invalid}
          errorMessage={cityValidation(acceptingStore?.city).message}
        />
      </Box>
      {showAddressError && (
        <AlertBox title={t('errorAddressNotFound')} fullWidth severity='error' />
      )}
    </>
  )
}

export default AddressSection
