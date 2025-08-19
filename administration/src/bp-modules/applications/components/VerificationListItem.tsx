import { Colors } from '@blueprintjs/core'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { Box, Button } from '@mui/material'
import { TFunction } from 'i18next'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ApplicationVerificationView, useSendApprovalMailToOrganisationMutation } from '../../../generated/graphql'
import { useAppToaster } from '../../AppToaster'
import EmailLink from '../../EmailLink'
import { VerificationStatus } from '../types'
import { verificationStatus } from '../utils'
import { isEmailValid } from '../utils/verificationHelper'
import { VerificationIcon } from './VerificationIcon'

const ListItem = styled.li<{ $color: string }>`
  position: relative;
  padding-left: 10px;
  border-left: 2px solid ${props => props.$color};
`

export type Verification = Omit<ApplicationVerificationView, 'contactName'>

const getStatusMetaData = (verification: Verification, t: TFunction): { text: string; color: string } => {
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
  verification: Verification
  applicationId: number
  showResendApprovalEmailButton: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const appToaster = useAppToaster()
  const [isApprovalRequestSent, setIsApprovalRequestSent] = useState(false)

  const status = verificationStatus(verification)
  const { text, color } = getStatusMetaData(verification, t)

  const [sendApprovalEmail, sendApprovalEmailResult] = useSendApprovalMailToOrganisationMutation({
    onError: () => {
      appToaster?.show({ intent: 'danger', message: t('failedToSendApprovalRequest') })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('approvalRequestSentSuccessfully') })
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
    <ListItem $color={color}>
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
                <span>{verification.contactEmailAddress}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>{t('status')}:</td>
            <td>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <VerificationIcon status={status} /> {text}
              </Box>
            </td>
          </tr>
        </tbody>
      </table>
      {showResendApprovalEmailButton && status === VerificationStatus.Pending && (
        <Button
          variant='contained'
          color='default'
          onClick={() => onSendApprovalEmailClick()}
          startIcon={<ForwardToInboxIcon />}
          sx={{ displayPrint: 'none', mt: 1 }}
          disabled={Boolean(sendApprovalEmailResult.loading) || isApprovalRequestSent}>
          {isApprovalRequestSent ? t('approvalRequestHasBeenSent') : t('resendApprovalRequest')}
        </Button>
      )}
    </ListItem>
  )
}

export default VerificationListItem
