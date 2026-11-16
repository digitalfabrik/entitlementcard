import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { Button, Typography, useTheme } from '@mui/material'
import { Theme } from '@mui/system'
import { TFunction } from 'i18next'
import { useSnackbar } from 'notistack'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'
import { useMutation } from 'urql'

import EmailLink from '../components/EmailLink'
import { ApplicationVerificationView, SendApprovalMailToOrganisationDocument } from '../graphql'
import { isEmailValid, verificationStatus } from '../util/verifications'
import VerificationDetails from './VerificationDetails'
import { VerificationIcon } from './VerificationIcon'

const getStatusMetaData = (
  verification: Pick<ApplicationVerificationView, 'rejectedDate' | 'verifiedDate'>,
  t: TFunction,
  theme: Theme,
): { text: string; color: string } => {
  const unverifiedText = verification.rejectedDate
    ? t('rejectedOn', { date: Temporal.Instant.from(verification.rejectedDate) })
    : t('pending')
  const text = verification.verifiedDate
    ? t('verifiedOn', { date: Temporal.Instant.from(verification.verifiedDate) })
    : unverifiedText
  const unverifiedColor = verification.rejectedDate
    ? theme.palette.error.main
    : theme.palette.warning.main
  const color = verification.verifiedDate ? theme.palette.success.main : unverifiedColor

  return { text, color }
}

const ContactVerificationListItem = ({
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

  const [sendApprovalEmailState, sendApprovalEmailMutation] = useMutation(
    SendApprovalMailToOrganisationDocument,
  )

  const onSendApprovalEmailClick = async () => {
    setIsApprovalRequestSent(true)
    const result = await sendApprovalEmailMutation({
      applicationId,
      applicationVerificationId: verification.verificationId,
    })

    if (result.error) {
      enqueueSnackbar(t('failedToSendApprovalRequest'), { variant: 'error' })
      setIsApprovalRequestSent(false)
    } else {
      enqueueSnackbar(t('approvalRequestSentSuccessfully'), { variant: 'success' })
    }
  }

  return (
    <Typography
      component='li'
      sx={{ borderLeft: `2px solid ${color}`, paddingLeft: 1.5, position: 'relative' }}
    >
      <VerificationDetails
        rows={[
          { label: t('organization'), value: verification.organizationName },
          {
            label: t('eMail'),
            value: isEmailValid(verification.contactEmailAddress) ? (
              <EmailLink email={verification.contactEmailAddress} />
            ) : (
              <Typography component='span'>{verification.contactEmailAddress}</Typography>
            ),
          },
          {
            label: t('status'),
            value: (
              <>
                <VerificationIcon status={status} /> {text}
              </>
            ),
          },
        ]}
      />
      {showResendApprovalEmailButton && (
        <Button
          variant='contained'
          onClick={() => onSendApprovalEmailClick()}
          startIcon={<ForwardToInboxIcon />}
          sx={{ displayPrint: 'none', mt: 1 }}
          disabled={Boolean(sendApprovalEmailState.fetching) || isApprovalRequestSent}
        >
          {isApprovalRequestSent ? t('approvalRequestHasBeenSent') : t('resendApprovalRequest')}
        </Button>
      )}
    </Typography>
  )
}

export default ContactVerificationListItem
