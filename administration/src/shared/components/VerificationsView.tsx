import { H5 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ApplicationPublic, ApplicationStatus, ApplicationVerificationView } from '../../generated/graphql'
import VerificationListItem from './VerificationListItem'

const VerificationContainer = styled.ul`
  list-style-type: none;
  padding-left: 0;
  li:not(:last-child) {
    margin-bottom: 15px;
  }
`

const VerificationsView = ({
  application,
  isAdminView,
}: {
  application: Pick<ApplicationPublic, 'id' | 'status'> & {
    verifications: Array<
      Pick<
        ApplicationVerificationView,
        'organizationName' | 'contactEmailAddress' | 'verificationId' | 'rejectedDate' | 'verifiedDate'
      >
    >
  }
  /** Displayed in an administration page, so show administrative UI */
  isAdminView?: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <>
      <H5>{t('confirmationsByOrganizations')}</H5>
      <VerificationContainer>
        {application.verifications.map(verification => {
          const key = verification.organizationName + verification.contactEmailAddress
          return (
            <VerificationListItem
              key={key}
              verification={verification}
              applicationId={application.id}
              showResendApprovalEmailButton={isAdminView === true && application.status === ApplicationStatus.Pending}
            />
          )
        })}
      </VerificationContainer>
      {application.verifications.length === 0 ? <i role='note'>({t('none')})</i> : null}
    </>
  )
}

export default VerificationsView
