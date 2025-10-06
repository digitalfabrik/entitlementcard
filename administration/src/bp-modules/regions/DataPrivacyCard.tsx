import { Button, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import SettingsCard from '../user-settings/SettingsCard'

const ButtonContainer = styled.div`
  text-align: right;
  padding: 8px 0;
`

const DataPrivacyCard = (): ReactElement => {
  const navigate = useNavigate()
  const { t } = useTranslation('regionSettings')
  return (
    <SettingsCard>
      <Typography variant='h4'>{t('dataPrivacyHeading')}</Typography>
      <Typography component='p' variant='body2'>
        {t('dataPrivacyExplanation')}
      </Typography>
      <ButtonContainer>
        <Button onClick={() => navigate('/region/data-privacy-policy')}>{t('open')}</Button>
      </ButtonContainer>
    </SettingsCard>
  )
}

export default DataPrivacyCard
