import { Button, Checkbox, H2 } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { FreinetAgency } from '../../../generated/graphql'
import SettingsCard from '../../user-settings/SettingsCard'

const Headline = styled(H2)`
  margin-bottom: 16px;
`

const ButtonContainer = styled.div`
  text-align: right;
  padding: 10px 0;
`

const Label = styled.span`
  font-weight: bold;
`

const InformationContainer = styled.div`
  margin: 16px 0;
`

type FreinetSettingsCardProps = {
  agencyInformation: FreinetAgency
  onSave: (dataTransferActivated: boolean) => void
  loading: boolean
}

const FreinetSettingsCard = ({ agencyInformation, onSave, loading }: FreinetSettingsCardProps): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const { agencyId, apiAccessKey, agencyName, dataTransferActivated: dbDataTransferActivated } = agencyInformation
  const [dataTransferActivated, setDataTransferActivated] = useState(dbDataTransferActivated)
  return (
    <SettingsCard>
      <Headline>{t('freinetHeadline')}</Headline>
      <p>
        <Trans i18nKey='regionSettings:freinetExplanation' />
      </p>
      <InformationContainer>
        <div>
          <Label>{t('freinetAgencyName')}: </Label>
          <span>{agencyName}</span>
        </div>
        <div>
          <Label>{t('freinetAgencyId')}: </Label>
          <span>{agencyId}</span>
        </div>
        <div>
          <Label>{t('freinetAgencyAccessKey')}: </Label>
          <span>{apiAccessKey}</span>
        </div>
      </InformationContainer>
      <Checkbox
        checked={dataTransferActivated}
        onChange={e => setDataTransferActivated(e.currentTarget.checked)}
        label={t('freinetActivateDataTransferCheckbox')}
      />

      <ButtonContainer>
        <Button text={t('save')} intent='primary' onClick={() => onSave(dataTransferActivated)} loading={loading} />
      </ButtonContainer>
    </SettingsCard>
  )
}

export default FreinetSettingsCard
