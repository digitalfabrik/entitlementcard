import { Button, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { FreinetAgency } from '../../../generated/graphql'
import BaseCheckbox from '../../../mui-modules/base/BaseCheckbox'
import SettingsCard, { SettingsCardButtonBox } from '../../user-settings/SettingsCard'

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
    <SettingsCard title={t('freinetHeadline')}>
      <Typography component='p' variant='body2'>
        <Trans i18nKey='regionSettings:freinetExplanation' />
      </Typography>
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
      <BaseCheckbox
        checked={dataTransferActivated}
        onChange={checked => setDataTransferActivated(checked)}
        label={t('freinetActivateDataTransferCheckbox')}
        hasError={false}
        errorMessage={undefined}
      />
      <SettingsCardButtonBox>
        <Button onClick={() => onSave(dataTransferActivated)}>{t('save')}</Button>
      </SettingsCardButtonBox>
    </SettingsCard>
  )
}

export default FreinetSettingsCard
