import { Button, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import SettingsCard, { SettingsCardButtonBox } from '../../../components/SettingsCard'

const DataPrivacyCard = (): ReactElement => {
  const navigate = useNavigate()
  const { t } = useTranslation('regionSettings')
  return (
    <SettingsCard title={t('dataPrivacyHeading')}>
      <Typography component='p'>{t('dataPrivacyExplanation')}</Typography>
      <SettingsCardButtonBox>
        <Button onClick={() => navigate('/region/data-privacy-policy')}>{t('open')}</Button>
      </SettingsCardButtonBox>
    </SettingsCard>
  )
}

export default DataPrivacyCard
