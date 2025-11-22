import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { Button, Typography, useTheme } from '@mui/material'
import { Theme } from '@mui/system'
import { TFunction } from 'i18next'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ApplicationVerificationView, useSendApprovalMailToOrganisationMutation } from '../../generated/graphql'
import EmailLink from '../components/EmailLink'
import { isEmailValid, verificationStatus } from '../verifications'
import { VerificationIcon } from './VerificationIcon'

const getStatusMetaData = (
  verification: Pick<ApplicationVerificationView, 'rejectedDate' | 'verifiedDate'>,
  t: TFunction,
  theme: Theme
): { text: string; color: string } => {
  const unverifiedText = verification.rejectedDate
    ? `${t('rejectedOn')} ${new Date(verification.rejectedDate).toLocaleString('de')}`
    : t('pending')
  const text = verification.verifiedDate
    ? `${t('verifiedOn')} ${new Date(verification.verifiedDate).toLocaleString('de')}`
    : unverifiedText
  const unverifiedColor = verification.rejectedDate ? theme.palette.error.main : theme.palette.warning.main
  const color = verification.verifiedDate ? theme.palette.success.main : unverifiedColor

  return { text, color }
}

const VerificationListItem = ({
  verification,
  applicationId,
  showResendApprovalEmailButton,
}: {
  verification: Pick<
    ApplicationVerificationView,
    'verificationId' | 'verifiedDate' | 'rejectedDate' | 'organizationName' | 'contactEmailAddress'
  >
  applicationId: number
  showResendApprovalEmailButton: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const { enqueueSnackbar } = useSnackbar()
  const [isApprovalRequestSent, setIsApprovalRequestSent] = useState(false)
  const status = verificationStatus(verification)
  const theme = useTheme()
  const { text, color } = getStatusMetaData(verification, t, theme)

  const [sendApprovalEmail, sendApprovalEmailResult] = useSendApprovalMailToOrganisationMutation({
    onError: () => {
      enqueueSnackbar(t('failedToSendApprovalRequest'), { variant: 'error' })
    },
    onCompleted: () => {
      enqueueSnackbar(t('approvalRequestSentSuccessfully'), { variant: 'success' })
    },
  })
  const onSendApprovalEmailClick = () => {
    sendApprovalEmail({
      variables: {
        applicationId,
        applicationVerificationId: verification.verificationId,
      },
    })
    setIsApprovalRequestSent(true)
  }

  return (
    <Typography component='li' sx={{ borderLeft: `2px solid ${color}`, position: 'relative' }} paddingLeft={1.5}>
      <table cellPadding='2px'>
        <tbody>
          <tr>
            <td>{t('organization')}:</td>
            <td>{verification.organizationName}</td>
          </tr>
          <tr>
            <td>{t('eMail')}:</td>
            <td>
              {isEmailValid(verification.contactEmailAddress) ? (
                <EmailLink email={verification.contactEmailAddress} />
              ) : (
                <Typography component='span'>{verification.contactEmailAddress}</Typography>
              )}
            </td>
          </tr>
          <tr>
            <td>{t('status')}:</td>
            <td style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <VerificationIcon status={status} /> {text}
            </td>
          </tr>
        </tbody>
      </table>
      {showResendApprovalEmailButton && (
        <Button
          variant='contained'
          onClick={() => onSendApprovalEmailClick()}
          startIcon={<ForwardToInboxIcon />}
          sx={{ displayPrint: 'none', mt: 1 }}
          disabled={Boolean(sendApprovalEmailResult.loading) || isApprovalRequestSent}>
          {isApprovalRequestSent ? t('approvalRequestHasBeenSent') : t('resendApprovalRequest')}
        </Button>
      )}
    </Typography>
  )
}

export default VerificationListItem
