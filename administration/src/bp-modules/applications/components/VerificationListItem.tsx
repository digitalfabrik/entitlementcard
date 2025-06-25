import { Colors } from '@blueprintjs/core'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { Button } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ApplicationVerificationView, useSendApprovalMailToOrganisationMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { useAppToaster } from '../../AppToaster'
import EmailLink from '../../EmailLink'
import { VerificationStatus } from '../types'
import { verificationStatus } from '../utils'
import { isEmailValid } from '../utils/verificationHelper'
import VerificationIndicator from './VerificationIndicator'

const ListItem = styled.li<{ $color: string }>`
  position: relative;
  padding-left: 10px;
  border-left: 2px solid ${props => props.$color};
`

export type Verification = Omit<ApplicationVerificationView, 'contactName'>

type VerificationListItemProps = {
  verification: Verification
  applicationId: number
}

const VerificationListItem = ({ verification, applicationId }: VerificationListItemProps): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const appToaster = useAppToaster()
  const projectId = useContext(ProjectConfigContext).projectId
  const [isApprovalRequestSent, setIsApprovalRequestSent] = useState(false)

  const status = verificationStatus(verification)
  const unverifiedText = verification.rejectedDate
    ? `${t('rejectedOn')} ${new Date(verification.rejectedDate).toLocaleString('de')}`
    : t('pending')
  const text = verification.verifiedDate
    ? `${t('verifiedOn')} ${new Date(verification.verifiedDate).toLocaleString('de')}`
    : unverifiedText
  const unverifiedColor = verification.rejectedDate ? Colors.RED2 : Colors.ORANGE2
  const color = verification.verifiedDate ? Colors.GREEN2 : unverifiedColor

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
        project: projectId,
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
              <VerificationIndicator status={status} text={` ${text}`} />
            </td>
          </tr>
        </tbody>
      </table>
      {status === VerificationStatus.Pending && (
        <Button
          variant='contained'
          color='default'
          onClick={() => onSendApprovalEmailClick()}
          startIcon={<ForwardToInboxIcon />}
          sx={{ displayPrint: 'none', mt: 1 }}
          disabled={sendApprovalEmailResult.loading || isApprovalRequestSent}>
          {isApprovalRequestSent ? t('approvalRequestHasBeenSent') : t('resendApprovalRequest')}
        </Button>
      )}
    </ListItem>
  )
}

export default VerificationListItem
