/* eslint-disable react/destructuring-assignment */
import { AttachFile, EditNote } from '@mui/icons-material'
import { Box, Stack, Tooltip, Typography, styled } from '@mui/material'
import { green } from '@mui/material/colors'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { VerificationIcon } from '../../../components/VerificationIcon'
import { VerificationStatus, verificationStatus } from '../../../util/verifications'
import { Application, ApplicationVerification } from '../types/types'
import {
  PreVerifiedEntitlementType,
  getPreVerifiedEntitlementType,
} from '../utils/preVerifiedEntitlements'
import { ApplicationNoteTooltip } from './ApplicationNoteTooltip'

const VerificationItem = (p: { status: VerificationStatus; count: number }): ReactElement => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center' }} data-testid={`indicator-${p.status}`}>
    <VerificationIcon status={p.status} />: {p.count}
  </Box>
)

export const VerificationIndicator = (p: {
  verifications: readonly ApplicationVerification[]
}): ReactElement => {
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
      }
    >
      <Stack direction='row' sx={{ height: '25px', alignItems: 'center', gap: 1 }}>
        <VerificationItem
          status={VerificationStatus.Verified}
          count={verificationStatuses.reduce(
            (count, s) => (s === VerificationStatus.Verified ? count + 1 : count),
            0,
          )}
        />
        <VerificationItem
          status={VerificationStatus.Pending}
          count={verificationStatuses.reduce(
            (count, s) => (s === VerificationStatus.Pending ? count + 1 : count),
            0,
          )}
        />
        <VerificationItem
          status={VerificationStatus.Rejected}
          count={verificationStatuses.reduce(
            (count, s) => (s === VerificationStatus.Rejected ? count + 1 : count),
            0,
          )}
        />
      </Stack>
    </Tooltip>
  )
}

type PreVerifiedLabelMetaData = {
  labelText: string
  attachment: boolean
}

const preVerifiedLabelMetaData: Record<PreVerifiedEntitlementType, PreVerifiedLabelMetaData> = {
  Juleica: {
    labelText: 'Juleica',
    attachment: true,
  },
  Verein360: {
    labelText: 'Verein360',
    attachment: false,
  },
  MilitaryReserve: {
    labelText: 'Wehrdienst',
    attachment: true,
  },
  VolunteerService: {
    labelText: 'Freiwilligendienst',
    attachment: true,
  },
  HonoredByMinisterPresident: {
    labelText: 'Ehrenzeichen',
    attachment: true,
  },
}

const PreVerifiedLabel = styled('span')<{ itemType: PreVerifiedEntitlementType }>(({ theme }) => ({
  padding: '4px 10px',
  fontSize: '14px',
  backgroundColor: green[50],
  borderColor: green[900],
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '2em',
  color: green[900],
  marginRight: theme.spacing(1), // Using MUI theme for spacing
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  whiteSpace: 'nowrap',
}))

export const PreVerifiedIndicator = ({
  type,
}: {
  type: PreVerifiedEntitlementType
}): ReactElement => {
  const { labelText, attachment } = preVerifiedLabelMetaData[type]
  return (
    <Stack
      direction='row'
      sx={{ height: '25px', alignItems: 'center', '&:focus': { outline: 'none' } }}
    >
      <PreVerifiedLabel itemType={type}>
        {attachment && <AttachFile sx={{ fontSize: 16 }} />}
        {labelText}
      </PreVerifiedLabel>
    </Stack>
  )
}

export const ApplicationIndicators = ({
  application,
}: {
  application: Application
}): ReactElement => {
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
