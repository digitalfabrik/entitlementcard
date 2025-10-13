/* eslint-disable react/destructuring-assignment */
import { CancelOutlined, CheckCircleOutlined, RemoveCircleOutline } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { ApplicationStatus } from '../../../generated/graphql'
import AlertBox from '../../../mui-modules/base/AlertBox'

const statusTranslationKey = (applicationStatus: ApplicationStatus, isAdminView: boolean): string | undefined => {
  switch (applicationStatus) {
    case ApplicationStatus.Approved:
    case ApplicationStatus.ApprovedCardCreated:
      return isAdminView ? 'noticeApprovedAdmin' : 'noticeApprovedPublic'
    case ApplicationStatus.Rejected:
      return isAdminView ? 'noticeRejectedAdmin' : 'noticeRejectedPublic'
    case ApplicationStatus.Withdrawn:
      return 'noticeWithdrawn'
    case ApplicationStatus.Pending:
      return undefined
  }
}

const statusColor = (applicationStatus: ApplicationStatus): 'success' | 'error' | 'warning' | 'inherit' => {
  switch (applicationStatus) {
    case ApplicationStatus.Approved:
    case ApplicationStatus.ApprovedCardCreated:
      return 'success'
    case ApplicationStatus.Rejected:
      return 'error'
    case ApplicationStatus.Withdrawn:
      return 'warning'
    case ApplicationStatus.Pending:
      return 'inherit'
  }
}

const icon = (applicationStatus: ApplicationStatus): ReactElement | undefined => {
  switch (applicationStatus) {
    case ApplicationStatus.Pending:
      return undefined
    case ApplicationStatus.Approved:
    case ApplicationStatus.ApprovedCardCreated:
      return <CheckCircleOutlined fontSize='small' color={statusColor(applicationStatus)} />
    case ApplicationStatus.Rejected:
      return <CancelOutlined fontSize='small' color={statusColor(applicationStatus)} />
    case ApplicationStatus.Withdrawn:
      return <RemoveCircleOutline fontSize='small' color={statusColor(applicationStatus)} />
  }
}

export const ApplicationStatusNote = (p: {
  statusResolvedDate: Date
  status: ApplicationStatus
  reason?: string | undefined
  adminView?: boolean
  showIcon?: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationStatusNote')
  const translationKey = statusTranslationKey(p.status, p.adminView === true)
  const color = statusColor(p.status)
  const showIcon = p.showIcon ?? true

  return (
    <AlertBox
      sx={{ border: 'none', padding: 0, maxWidth: 'none' }}
      customIcon={showIcon && <>{icon(p.status)}&ensp;</>}
      description={
        translationKey !== undefined ? (
          <Trans
            t={t}
            i18nKey={translationKey}
            values={{
              date: format(p.statusResolvedDate, 'dd. MMMM yyyy', { locale: de }),
              time: format(p.statusResolvedDate, 'HH:mm', { locale: de }),
              reason: p.reason !== undefined ? t('reason', { message: p.reason }) : '',
            }}
            components={{
              resolution: <Typography component='span' fontWeight='bold' fontSize='inherit' color={color} />,
            }}
          />
        ) : undefined
      }
    />
  )
}
