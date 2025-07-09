import { EditNote } from '@mui/icons-material'
import { Box, Stack, Tooltip } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import type { JsonField } from './JsonFieldView'
import { findValue } from './JsonFieldView'
import {
  PreVerifiedEntitlementType,
  getPreVerifiedEntitlementType,
  preVerifiedEntitlements,
} from './PreVerifiedEntitlementType'
import { ApplicationNoteTooltip } from './components/ApplicationNoteTooltip'
import VerificationIndicator from './components/VerificationIndicator'
import { GetApplicationsType, GetApplicationsVerificationType, VerificationStatus } from './types'
import { verificationStatus } from './utils'

export const VerificationQuickIndicator = ({
  verifications,
}: {
  verifications: GetApplicationsVerificationType[]
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const verificationStatuses = verifications.map(verificationStatus)

  return (
    <Tooltip
      title={
        <Box>
          <b>{t('confirmationsByOrganizations')}</b>
          <br />
          <br />
          {t('verified/pending/rejected')}
        </Box>
      }>
      <Stack direction='row' sx={{ height: '25px', alignItems: 'center', '&:focus': { outline: 'none' } }}>
        <VerificationIndicator
          status={VerificationStatus.Verified}
          text={`: ${verificationStatuses.filter(v => v === VerificationStatus.Verified).length}`}
        />
        <VerificationIndicator
          status={VerificationStatus.Pending}
          text={`: ${verificationStatuses.filter(v => v === VerificationStatus.Pending).length}`}
        />
        <VerificationIndicator
          status={VerificationStatus.Rejected}
          text={`: ${verificationStatuses.filter(v => v === VerificationStatus.Rejected).length}`}
        />
      </Stack>
    </Tooltip>
  )
}

type PreVerifiedLabelMetaData = {
  backgroundColor: string
  fontColor: string
  labelText: string
}

const preVerifiedLabelMetaData: Record<PreVerifiedEntitlementType, PreVerifiedLabelMetaData> = {
  [preVerifiedEntitlements.Juleica]: {
    backgroundColor: '#bfd4f2',
    fontColor: '#000000',
    labelText: 'Juleica',
  },
  [preVerifiedEntitlements.Verein360]: {
    backgroundColor: '#0366D6',
    fontColor: '#ffffff',
    labelText: 'Verein360',
  },
  [preVerifiedEntitlements.HonoredByMinisterPresident]: {
    backgroundColor: '#FBCA01',
    fontColor: '#000000',
    labelText: 'Ehrenzeichen',
  },
}

const PreVerifiedLabel = styled.span<{ type: PreVerifiedEntitlementType }>`
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${({ type }) => preVerifiedLabelMetaData[type].backgroundColor};
  color: ${({ type }) => preVerifiedLabelMetaData[type].fontColor};
  border-radius: 2em;
  line-height: 1;
  margin-right: 6px;
  display: inline-block;
  white-space: nowrap;
`

export const PreVerifiedQuickIndicator = ({ type }: { type: PreVerifiedEntitlementType }): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  return (
    <Tooltip
      title={
        <div>
          <b>{t('confirmationsByOrganizations')}</b>
          <br />
          {t('noConfirmationNeeded')}
        </div>
      }>
      <Stack direction='row' sx={{ height: '25px', alignItems: 'center', '&:focus': { outline: 'none' } }}>
        <PreVerifiedLabel type={type}>{preVerifiedLabelMetaData[type].labelText}</PreVerifiedLabel>
        <VerificationIndicator status={VerificationStatus.Verified} />
      </Stack>
    </Tooltip>
  )
}

export const ApplicationIndicators = ({
  application,
  applicationJsonData,
}: {
  application: GetApplicationsType
  applicationJsonData: JsonField<'Array'>
}): ReactElement => {
  const preVerifiedEntitlementType = getPreVerifiedEntitlementType(
    findValue(applicationJsonData, 'applicationDetails', 'Array') ?? applicationJsonData
  )

  return (
    <Stack direction='row' spacing={2} sx={{ displayPrint: 'none' }}>
      {(application.note ?? '').trim().length > 0 && (
        <ApplicationNoteTooltip application={application}>
          <EditNote />
        </ApplicationNoteTooltip>
      )}
      {preVerifiedEntitlementType !== undefined ? (
        <PreVerifiedQuickIndicator type={preVerifiedEntitlementType} />
      ) : (
        <VerificationQuickIndicator verifications={application.verifications} />
      )}
    </Stack>
  )
}
