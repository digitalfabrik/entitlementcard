import { Typography, styled } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ApplicationApplicant, ApplicationStatus, ApplicationVerificationView } from '../graphql'
import { getCertificateVerifications } from '../util/certificateVerifications'
import { VerificationStatus, verificationStatus } from '../util/verifications'
import CertificateVerificationListItem from './CertificateVerificationListItem'
import { JsonField } from './JsonFieldView'
import VerificationListItem from './VerificationListItem'

const VerificationContainer = styled('ul')`
  list-style-type: none;
  padding-left: 0;
  li:not(:last-child) {
    margin-bottom: 15px;
  }
`

const VerificationsView = ({
  application,
  baseUrl,
  isAdminView = false,
}: {
  application: Pick<ApplicationApplicant, 'id' | 'status'> & {
    jsonValue: JsonField<'Array'>
    verifications: Readonly<
      Pick<
        ApplicationVerificationView,
        | 'organizationName'
        | 'contactEmailAddress'
        | 'verificationId'
        | 'rejectedDate'
        | 'verifiedDate'
      >[]
    >
  }
  /** Base url of the application, used to download attached certificates */
  baseUrl: string
  /** Displayed in an administration page, so show administrative UI */
  isAdminView?: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const certificateVerifications = getCertificateVerifications(application.jsonValue)

  return (
    <>
      <Typography variant='h6'>{t('confirmationsByOrganizations')}</Typography>
      <VerificationContainer>
        {application.verifications.map(verification => {
          const key = verification.organizationName + verification.contactEmailAddress
          return (
            <VerificationListItem
              key={key}
              verification={verification}
              applicationId={application.id}
              showResendApprovalEmailButton={
                isAdminView &&
                verificationStatus(verification) === VerificationStatus.Pending &&
                application.status === ApplicationStatus.Pending
              }
            />
          )
        })}
        {certificateVerifications.map(verification => (
          <CertificateVerificationListItem
            key={verification.certificate.value.fileIndex}
            verification={verification}
            baseUrl={baseUrl}
            attachmentAccessible={isAdminView}
          />
        ))}
      </VerificationContainer>
      {application.verifications.length === 0 && certificateVerifications.length === 0 ? (
        <Typography sx={{ fontStyle: 'italic' }} role='note'>
          ({t('none')})
        </Typography>
      ) : null}
    </>
  )
}

export default VerificationsView
