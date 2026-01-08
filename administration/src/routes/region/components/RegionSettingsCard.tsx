import { Button, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BaseCheckbox from '../../../components/BaseCheckbox'
import SettingsCard, { SettingsCardButtonBox } from '../../../components/SettingsCard'

const RegionSettingsCard = ({
  onSave,
  loading,
  defaultApplicationActivation,
  defaultConfirmationMailActivation,
}: {
  onSave: (activatedForApplication: boolean, activatedForConfirmationMail: boolean) => void
  loading: boolean
  defaultApplicationActivation: boolean
  defaultConfirmationMailActivation: boolean
}): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const [activatedForApplication, setActivatedForApplication] = useState<boolean>(
    defaultApplicationActivation,
  )
  const [activatedForCardConfirmationMail, setActivatedForCardConfirmationMail] = useState<boolean>(
    defaultConfirmationMailActivation,
  )

  return (
    <SettingsCard title={t('regionSettings')}>
      <BaseCheckbox
        checked={activatedForApplication}
        onChange={checked => setActivatedForApplication(checked)}
        label={<Typography>{t('activatedForApplication')}</Typography>}
        hasError={false}
        errorMessage={undefined}
      />
      <BaseCheckbox
        checked={activatedForCardConfirmationMail}
        onChange={checked => setActivatedForCardConfirmationMail(checked)}
        label={<Typography>{t('activatedForCardConfirmationMail')}</Typography>}
        hasError={false}
        errorMessage={undefined}
      />
      <SettingsCardButtonBox>
        <Button
          onClick={() => onSave(activatedForApplication, activatedForCardConfirmationMail)}
          loading={loading}
        >
          {t('save')}
        </Button>
      </SettingsCardButtonBox>
    </SettingsCard>
  )
}

export default RegionSettingsCard
