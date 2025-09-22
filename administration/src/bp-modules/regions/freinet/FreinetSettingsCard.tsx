import { Button, Checkbox, H2 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { FreinetAgency } from '../../../generated/graphql'
import SettingsCard from '../../user-settings/SettingsCard'

const Headline = styled(H2)`
  margin-bottom: 16px;
`

const ButtonContainer = styled.div`
  text-align: right;
  padding: 8px 0;
`

const Table = styled.table`
  margin: 32px 0;
  width: 100%;

  & th {
    text-align: start;
    min-width: 80px;
  }
`

type FreinetSettingsCardProps = {
  agencyInformation: FreinetAgency
  onSave: (dataTransferActivated: boolean) => void
  dataTransferActivated: boolean
  setDataTransferActivated: (dataTransferActivated: boolean) => void
}

const FreinetSettingsCard = ({
  agencyInformation,
  onSave,
  setDataTransferActivated,
  dataTransferActivated,
}: FreinetSettingsCardProps): ReactElement => {
  const { t } = useTranslation('regionSettings')
  const { agencyId, apiAccessKey, agencyName } = agencyInformation

  return (
    <SettingsCard>
      <Headline>{t('freinetHeadline')}</Headline>
      <p>
        <Trans i18nKey='regionSettings:freinetExplanation' />
      </p>
      <Table>
        <thead>
          <tr>
            <th>{t('freinetAgencyName')}</th>
            <th>{t('freinetAgencyId')}</th>
            <th>{t('freinetAgencyAccessKey')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{agencyName}</td>
            <td>{agencyId}</td>
            <td>{apiAccessKey}</td>
          </tr>
        </tbody>
      </Table>
      <Checkbox
        checked={dataTransferActivated}
        onChange={e => setDataTransferActivated(e.currentTarget.checked)}
        label={t('freinetActivateDataTransferCheckbox')}
      />
      <ButtonContainer>
        <Button text={t('save')} intent='primary' onClick={() => onSave(dataTransferActivated)} />
      </ButtonContainer>
    </SettingsCard>
  )
}

export default FreinetSettingsCard
