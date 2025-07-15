/* eslint-disable react/destructuring-assignment */
import { EditNote } from '@mui/icons-material'
import { Box, Stack, Tooltip } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import type { JsonField } from '../JsonFieldView'
import { findValue } from '../JsonFieldView'
import {
  PreVerifiedEntitlementType,
  getPreVerifiedEntitlementType,
  preVerifiedEntitlements,
} from '../PreVerifiedEntitlementType'
import { type GetApplicationsType, type GetApplicationsVerificationType, VerificationStatus } from '../types'
import { verificationStatus } from '../utils'
import { ApplicationNoteTooltip } from './ApplicationNoteTooltip'
import { VerificationIcon } from './VerificationIcon'

const VerificationItem = (p: { status: VerificationStatus; count: number }): ReactElement => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center' }} data-testid={`indicator-${p.status}`}>
    <VerificationIcon status={p.status} />: {p.count}
  </Box>
)

export const VerificationIndicator = (p: { verifications: GetApplicationsVerificationType[] }): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const verificationStatuses = p.verifications.map(verificationStatus)

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
      <Stack direction='row' sx={{ height: '25px', alignItems: 'center', gap: 1 }}>
        <VerificationItem
          status={VerificationStatus.Verified}
          count={verificationStatuses.reduce((count, s) => (s === VerificationStatus.Verified ? count + 1 : count), 0)}
        />
        <VerificationItem
          status={VerificationStatus.Pending}
          count={verificationStatuses.reduce((count, s) => (s === VerificationStatus.Pending ? count + 1 : count), 0)}
        />
        <VerificationItem
          status={VerificationStatus.Rejected}
          count={verificationStatuses.reduce((count, s) => (s === VerificationStatus.Rejected ? count + 1 : count), 0)}
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

export const PreVerifiedIndicator = ({ type }: { type: PreVerifiedEntitlementType }): ReactElement => {
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
        <VerificationIcon status={VerificationStatus.Verified} />
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
        <PreVerifiedIndicator type={preVerifiedEntitlementType} />
      ) : (
        <VerificationIndicator verifications={application.verifications} />
      )}
    </Stack>
  )
}
