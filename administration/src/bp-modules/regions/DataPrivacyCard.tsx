import { H2 } from '@blueprintjs/core'
import { Button } from '@mui/material'
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
      <H2>{t('dataPrivacyHeading')}</H2>
      <p>{t('dataPrivacyExplanation')}</p>
      <ButtonContainer>
        <Button onClick={() => navigate('/region/data-privacy-policy')}>{t('open')}</Button>
      </ButtonContainer>
    </SettingsCard>
  )
}

export default DataPrivacyCard
