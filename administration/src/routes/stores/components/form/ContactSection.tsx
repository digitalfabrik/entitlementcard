import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../../cards/extensions/components/CardTextField'
import { AcceptingStoreFormData, UpdateStoreFunction } from '../StoreForm'

const ContactSection = ({
  acceptingStore,
  updateStore,
}: {
  acceptingStore?: AcceptingStoreFormData
  updateStore: UpdateStoreFunction
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  return (
    <>
      <Typography variant='h6' marginY={1}>
        {t('contactSection')}
      </Typography>
      <Box sx={{ flexDirection: 'row', gap: 2, display: 'flex' }}>
        <CardTextField
          id='store-telephone-input'
          label={t('telephoneLabel')}
          placeholder={t('telephonePlaceholder')}
          value={acceptingStore?.telephone ?? ''}
          onChange={value => updateStore('telephone', value)}
          showError={false}
          errorMessage={null}
          sx={{ flex: '0 0 50%' }}
        />
        <CardTextField
          id='store-email-input'
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={acceptingStore?.email ?? ''}
          onChange={value => updateStore('email', value)}
          showError={false}
          errorMessage={null}
        />
      </Box>
      <CardTextField
        id='store-homepage-input'
        label={t('homepageLabel')}
        placeholder={t('homepagePlaceholder')}
        value={acceptingStore?.homepage ?? ''}
        onChange={value => updateStore('homepage', value)}
        showError={false}
        errorMessage={null}
      />
    </>
  )
}

export default ContactSection
