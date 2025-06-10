import { Stack, Tooltip, useTheme } from '@mui/material'
import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import VerificationIndicator from './components/VerificationIndicator'
import { GetApplicationsVerificationType, VerificationStatus } from './types'
import { verificationStatus } from './utils'

const ToolTipContent = forwardRef<HTMLDivElement, unknown>((p, ref) => {
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()

  return (
    <Stack
      ref={ref}
      sx={{
        backgroundColor: theme.palette.defaultInverted.main,
        color: theme.palette.defaultInverted.contrastText,
        padding: 2,
        borderRadius: 2,
      }}>
      <b>{t('confirmationsByOrganizations')}</b>
      <br />
      {t('verified/pending/rejected')}
    </Stack>
  )
})

const VerificationQuickIndicator = ({ verifications }: { verifications: GetApplicationsVerificationType[] }) => {
  const verificationStatuses = verifications.map(verificationStatus)

  return (
    <Tooltip
      title='title'
      slots={{
        tooltip: ToolTipContent,
      }}>
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

export default memo(VerificationQuickIndicator)
