import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../../cards/extensions/components/CardTextField'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../../types'
import { emailValidation, homepageValidation, phoneValidation } from './validation'

const ContactSection = ({
  acceptingStore,
  updateStore,
  formSendAttempt,
}: {
  acceptingStore?: AcceptingStoreFormData
  updateStore: UpdateStoreFunction
  formSendAttempt: boolean
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  return (
    <>
      <Typography variant='h6' marginY={0.5}>
        {t('contactSection')}
      </Typography>
      <Box sx={{ flexDirection: 'row', gap: 2, display: 'flex' }}>
        <CardTextField
          id='store-telephone-input'
          label={t('telephoneLabel')}
          placeholder={t('telephonePlaceholder')}
          value={acceptingStore?.telephone ?? ''}
          onChange={value => updateStore('telephone', value)}
          showError={phoneValidation(acceptingStore?.telephone).invalid}
          forceError={formSendAttempt}
          errorMessage={phoneValidation(acceptingStore?.telephone).message}
          sx={{ flex: '0 0 50%' }}
        />
        <CardTextField
          id='store-email-input'
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={acceptingStore?.email ?? ''}
          forceError={formSendAttempt}
          onChange={value => updateStore('email', value)}
          showError={emailValidation(acceptingStore?.email).invalid}
          errorMessage={emailValidation(acceptingStore?.email).message}
        />
      </Box>
      <CardTextField
        id='store-homepage-input'
        label={t('homepageLabel')}
        placeholder={t('homepagePlaceholder')}
        value={acceptingStore?.homepage ?? ''}
        forceError={formSendAttempt}
        onChange={value => updateStore('homepage', value)}
        showError={homepageValidation(acceptingStore?.homepage).invalid}
        errorMessage={homepageValidation(acceptingStore?.homepage).message}
      />
    </>
  )
}

export default ContactSection
