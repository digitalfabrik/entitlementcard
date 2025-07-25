import { H5 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import VerificationListItem from './components/VerificationListItem'
import type { Application } from './types'

const VerificationContainer = styled.ul`
  list-style-type: none;
  padding-left: 0;
  li:not(:last-child) {
    margin-bottom: 15px;
  }
`

const VerificationsView = ({
  application,
  showResendApprovalEmailButton,
}: {
  application: Application
  showResendApprovalEmailButton: boolean
}): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const { verifications, id } = application
  return (
    <>
      <H5>{t('confirmationsByOrganizations')}</H5>
      <VerificationContainer>
        {verifications.map(verification => {
          const key = verification.organizationName + verification.contactEmailAddress
          return (
            <VerificationListItem
              key={key}
              verification={verification}
              applicationId={id}
              showResendApprovalEmailButton={showResendApprovalEmailButton}
            />
          )
        })}
      </VerificationContainer>
      {verifications.length === 0 ? <i role='note'>({t('none')})</i> : null}
    </>
  )
}

export default VerificationsView
