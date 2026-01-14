import { Typography, styled } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ApplicationPublic,
  ApplicationStatus,
  ApplicationVerificationView,
} from '../generated/graphql'
import { VerificationStatus, verificationStatus } from '../util/verifications'
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
  isAdminView = false,
}: {
  application: Pick<ApplicationPublic, 'id' | 'status'> & {
    verifications: Array<
      Pick<
        ApplicationVerificationView,
        | 'organizationName'
        | 'contactEmailAddress'
        | 'verificationId'
        | 'rejectedDate'
        | 'verifiedDate'
      >
    >
  }
  /** Displayed in an administration page, so show administrative UI */
  isAdminView?: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

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
      </VerificationContainer>
      {application.verifications.length === 0 ? (
        <Typography fontStyle='italic' role='note'>
          ({t('none')})
        </Typography>
      ) : null}
    </>
  )
}

export default VerificationsView
