import { Button, H2 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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
        <Button text={t('open')} intent='primary' onClick={() => navigate('/region/data-privacy-policy')} />
      </ButtonContainer>
    </SettingsCard>
  )
}

export default DataPrivacyCard
