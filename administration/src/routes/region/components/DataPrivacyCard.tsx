import { Typography } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import SettingsCard from '../../../components/SettingsCard'

const DataPrivacyCard = (): ReactElement => {
  const navigate = useNavigate()
  const { t } = useTranslation('regionSettings')
  return (
    <SettingsCard
      title={t('dataPrivacyHeading')}
      action={{ label: t('open'), onSubmit: () => navigate('/region/data-privacy-policy') }}
    >
      <Typography component='p'>{t('dataPrivacyExplanation')}</Typography>
    </SettingsCard>
  )
}

export default DataPrivacyCard
