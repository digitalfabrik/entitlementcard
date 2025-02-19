import { H5, Icon, Intent } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { GetApplicationsQuery } from '../../generated/graphql'
import VerificationListItem from './components/VerificationListItem'

const StyledIndicator = styled.span`
  display: inline-block;
  padding: 4px;
`

type Application = GetApplicationsQuery['applications'][number]

const verifiedIcon = 'tick-circle'
const rejectedIcon = 'cross-circle'
const awaitingIcon = 'help'

export enum VerificationStatus {
  Verified,
  Rejected,
  Awaiting,
}

export const getIconByStatus = (status: VerificationStatus): 'tick-circle' | 'cross-circle' | 'help' => {
  switch (status) {
    case VerificationStatus.Verified:
      return verifiedIcon
    case VerificationStatus.Awaiting:
      return awaitingIcon
    case VerificationStatus.Rejected:
      return rejectedIcon
  }
}

export const getIntentByStatus = (status: VerificationStatus): Intent => {
  switch (status) {
    case VerificationStatus.Verified:
      return 'success'
    case VerificationStatus.Awaiting:
      return 'warning'
    case VerificationStatus.Rejected:
      return 'danger'
  }
}

export const Indicator = ({ status, text }: { status: VerificationStatus; text?: string }): ReactElement => (
  <StyledIndicator data-testid={`indicator-${status}`}>
    <Icon icon={getIconByStatus(status)} intent={getIntentByStatus(status)} />
    {text}
  </StyledIndicator>
)

export const getStatus = (verification: Application['verifications'][number]): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Awaiting
}

const VerificationContainer = styled.ul`
  list-style-type: none;
  padding-left: 0;
  li:not(:last-child) {
    margin-bottom: 15px;
  }
`

const VerificationsView = ({ verifications }: { verifications: Application['verifications'] }): ReactElement => {
  const { t } = useTranslation('applications')
  return (
    <>
      <H5>{t('confirmationsByOrganizations')}</H5>
      <VerificationContainer>
        {verifications.map(verification => {
          const key = verification.organizationName + verification.contactEmailAddress
          return <VerificationListItem verification={verification} key={key} />
        })}
      </VerificationContainer>
      {verifications.length === 0 ? <i role='note'>({t('none')})</i> : null}
    </>
  )
}

export default VerificationsView
