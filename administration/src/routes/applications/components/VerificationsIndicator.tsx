/* eslint-disable react/destructuring-assignment */
import { EditNote } from '@mui/icons-material'
import { Box, Stack, Tooltip, Typography, styled, useTheme } from '@mui/material'
import { blue, yellow } from '@mui/material/colors'
import { Theme } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { VerificationIcon } from '../../../shared/components/VerificationIcon'
import { VerificationStatus, verificationStatus } from '../../../shared/verifications'
import { Application, ApplicationVerification } from '../types/types'
import {
  PreVerifiedEntitlementType,
  getPreVerifiedEntitlementType,
  preVerifiedEntitlements,
} from '../utils/preVerifiedEntitlements'
import { ApplicationNoteTooltip } from './ApplicationNoteTooltip'

const VerificationItem = (p: { status: VerificationStatus; count: number }): ReactElement => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center' }} data-testid={`indicator-${p.status}`}>
    <VerificationIcon status={p.status} />: {p.count}
  </Box>
)

export const VerificationIndicator = (p: { verifications: ApplicationVerification[] }): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const verificationStatuses = p.verifications.map(verificationStatus)

  return (
    <Tooltip
      title={
        <Box>
          <Typography>
            <b>{t('confirmationsByOrganizations')}</b>
            <br />
            <br />
            {t('verified/pending/rejected')}
          </Typography>
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

const preVerifiedLabelMetaData = (theme: Theme): Record<PreVerifiedEntitlementType, PreVerifiedLabelMetaData> => ({
  [preVerifiedEntitlements.Juleica]: {
    backgroundColor: '#bfd4f2',
    fontColor: theme.palette.common.black,
    labelText: 'Juleica',
  },
  [preVerifiedEntitlements.Verein360]: {
    backgroundColor: blue[500],
    fontColor: theme.palette.common.white,
    labelText: 'Verein360',
  },
  [preVerifiedEntitlements.HonoredByMinisterPresident]: {
    backgroundColor: yellow[700],
    fontColor: theme.palette.common.black,
    labelText: 'Ehrenzeichen',
  },
})

const PreVerifiedLabel = styled('span')<{ itemType: PreVerifiedEntitlementType }>(({ theme, itemType }) => ({
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: 600,
  backgroundColor: preVerifiedLabelMetaData(theme)[itemType].backgroundColor,
  color: preVerifiedLabelMetaData(theme)[itemType].fontColor,
  borderRadius: '2em',
  lineHeight: 1,
  marginRight: theme.spacing(1), // Using MUI theme for spacing
  display: 'inline-block',
  whiteSpace: 'nowrap',
}))

export const PreVerifiedIndicator = ({ type }: { type: PreVerifiedEntitlementType }): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()
  return (
    <Tooltip
      title={
        <div>
          <Typography>
            <b>{t('confirmationsByOrganizations')}</b>
            <br />
            {t('noConfirmationNeeded')}
          </Typography>
        </div>
      }>
      <Stack direction='row' sx={{ height: '25px', alignItems: 'center', '&:focus': { outline: 'none' } }}>
        <PreVerifiedLabel itemType={type}>{preVerifiedLabelMetaData(theme)[type].labelText}</PreVerifiedLabel>
        <VerificationIcon status={VerificationStatus.Verified} />
      </Stack>
    </Tooltip>
  )
}

export const ApplicationIndicators = ({ application }: { application: Application }): ReactElement => {
  const preVerifiedEntitlementType = getPreVerifiedEntitlementType(application.jsonValue)

  return (
    <Stack direction='row' spacing={2} sx={{ displayPrint: 'none' }}>
      {(application.note ?? '').trim().length > 0 && (
        <ApplicationNoteTooltip application={application}>
          <EditNote color='primary' />
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
