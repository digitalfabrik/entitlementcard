import { Stack, Typography } from '@mui/material'
import React, { ReactElement, useId } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../../cards/extensions/components/CardTextField'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../../types'
import { emailValidation, homepageValidation, phoneValidation } from './validation'

const ContactSection = ({
  acceptingStore,
  onUpdateStore,
  formSendAttempt,
}: {
  acceptingStore?: AcceptingStoreFormData
  onUpdateStore: UpdateStoreFunction
  formSendAttempt: boolean
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  const telephoneLabelId = useId()
  const emailLabelId = useId()
  const homepageLabelId = useId()
  return (
    <>
      <Typography variant='h6' marginY={0.5}>
        {t('contactSection')}
      </Typography>
      <Stack sx={{ flexDirection: 'row', gap: 2 }}>
        <CardTextField
          id={telephoneLabelId}
          label={t('telephoneLabel')}
          placeholder={t('telephonePlaceholder')}
          value={acceptingStore?.telephone ?? ''}
          onChange={value => onUpdateStore('telephone', value)}
          showError={phoneValidation(acceptingStore?.telephone).invalid}
          forceError={formSendAttempt}
          errorMessage={phoneValidation(acceptingStore?.telephone).message}
          sx={{ flex: '0 0 50%' }}
        />
        <CardTextField
          id={emailLabelId}
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={acceptingStore?.email ?? ''}
          forceError={formSendAttempt}
          onChange={value => onUpdateStore('email', value)}
          showError={emailValidation(acceptingStore?.email).invalid}
          errorMessage={emailValidation(acceptingStore?.email).message}
        />
      </Stack>
      <CardTextField
        id={homepageLabelId}
        label={t('homepageLabel')}
        placeholder={t('homepagePlaceholder')}
        value={acceptingStore?.homepage ?? ''}
        forceError={formSendAttempt}
        onChange={value => onUpdateStore('homepage', value)}
        showError={homepageValidation(acceptingStore?.homepage).invalid}
        errorMessage={homepageValidation(acceptingStore?.homepage).message}
      />
    </>
  )
}

export default ContactSection
