import { Colors } from '@blueprintjs/core'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { Button, Typography } from '@mui/material'
import { TFunction } from 'i18next'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import EmailLink from '../../bp-modules/EmailLink'
import { ApplicationVerificationView, useSendApprovalMailToOrganisationMutation } from '../../generated/graphql'
import { isEmailValid, verificationStatus } from '../verifications'
import { VerificationIcon } from './VerificationIcon'

const getStatusMetaData = (
  verification: Pick<ApplicationVerificationView, 'rejectedDate' | 'verifiedDate'>,
  t: TFunction
): { text: string; color: string } => {
  const unverifiedText = verification.rejectedDate
    ? `${t('rejectedOn')} ${new Date(verification.rejectedDate).toLocaleString('de')}`
    : t('pending')
  const text = verification.verifiedDate
    ? `${t('verifiedOn')} ${new Date(verification.verifiedDate).toLocaleString('de')}`
    : unverifiedText
  const unverifiedColor = verification.rejectedDate ? Colors.RED2 : Colors.ORANGE2
  const color = verification.verifiedDate ? Colors.GREEN2 : unverifiedColor

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
  const { text, color } = getStatusMetaData(verification, t)

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
