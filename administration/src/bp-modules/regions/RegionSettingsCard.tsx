import { Checkbox } from '@blueprintjs/core'
import { Button, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import SettingsCard from '../user-settings/SettingsCard'

const ButtonContainer = styled.div`
  text-align: right;
  padding: 8px 0;
`

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
  const [activatedForApplication, setActivatedForApplication] = useState<boolean>(defaultApplicationActivation)
  const [activatedForCardConfirmationMail, setActivatedForCardConfirmationMail] = useState<boolean>(
    defaultConfirmationMailActivation
  )

  return (
    <SettingsCard>
      <Typography variant='h4' marginBottom={2}>
        {t('regionSettings')}
      </Typography>
      <Checkbox
        checked={activatedForApplication}
        onChange={e => setActivatedForApplication(e.currentTarget.checked)}
        label={t('activatedForApplication')}
      />
      <Checkbox
        checked={activatedForCardConfirmationMail}
        onChange={e => setActivatedForCardConfirmationMail(e.currentTarget.checked)}
        label={t('activatedForCardConfirmationMail')}
      />
      <ButtonContainer>
        <Button onClick={() => onSave(activatedForApplication, activatedForCardConfirmationMail)} loading={loading}>
          {t('save')}
        </Button>
      </ButtonContainer>
    </SettingsCard>
  )
}

export default RegionSettingsCard
