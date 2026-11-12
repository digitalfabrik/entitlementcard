import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BaseCheckbox from '../../../components/BaseCheckbox'
import SettingsCard from '../../../components/SettingsCard'
import { AvailableCardFormats } from '../../../graphql'

const RegionSettingsCard = ({
  onSave,
  loading,
  defaultApplicationActivation,
  defaultConfirmationMailActivation,
  defaultAvailableCardFormats,
  showAvailableCardFormats,
}: {
  onSave: (
    activatedForApplication: boolean,
    activatedForConfirmationMail: boolean,
    availableCardFormats: AvailableCardFormats,
  ) => void
  loading: boolean
  defaultApplicationActivation: boolean
  defaultConfirmationMailActivation: boolean
  defaultAvailableCardFormats: AvailableCardFormats
  showAvailableCardFormats: boolean
}): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const [activatedForApplication, setActivatedForApplication] = useState<boolean>(
    defaultApplicationActivation,
  )
  const [activatedForCardConfirmationMail, setActivatedForCardConfirmationMail] = useState<boolean>(
    defaultConfirmationMailActivation,
  )
  const [availableCardFormats, setAvailableCardFormats] = useState<AvailableCardFormats>(
    defaultAvailableCardFormats,
  )

  return (
    <SettingsCard
      title={t('regionSettings')}
      action={{
        label: t('save'),
        onSubmit: () =>
          onSave(activatedForApplication, activatedForCardConfirmationMail, availableCardFormats),
        loading,
      }}
    >
      <Stack>
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
      </Stack>
      {showAvailableCardFormats && (
        <FormControl sx={{ mt: 3 }}>
          <FormLabel id='available-card-formats-label'>{t('availableCardFormats')}</FormLabel>
          <RadioGroup
            aria-labelledby='available-card-formats-label'
            value={availableCardFormats}
            onChange={event => setAvailableCardFormats(event.target.value as AvailableCardFormats)}
          >
            <FormControlLabel
              value={AvailableCardFormats.Digital}
              control={<Radio />}
              label={t('availableCardFormatsDigital')}
            />
            <FormControlLabel
              value={AvailableCardFormats.DigitalAndPhysical}
              control={<Radio />}
              label={t('availableCardFormatsDigitalAndPhysical')}
            />
          </RadioGroup>
        </FormControl>
      )}
    </SettingsCard>
  )
}

export default RegionSettingsCard
