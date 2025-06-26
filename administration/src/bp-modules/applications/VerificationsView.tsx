import { H5 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { GetApplicationsQuery } from '../../generated/graphql'
import VerificationListItem from './components/VerificationListItem'

export type Application = GetApplicationsQuery['applications'][number]

const VerificationContainer = styled.ul`
  list-style-type: none;
  padding-left: 0;
  li:not(:last-child) {
    margin-bottom: 15px;
  }
`

const VerificationsView = ({ application }: { application: Application }): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const { verifications, id } = application
  return (
    <>
      <H5>{t('confirmationsByOrganizations')}</H5>
      <VerificationContainer>
        {verifications.map(verification => {
          const key = verification.organizationName + verification.contactEmailAddress
          return <VerificationListItem verification={verification} applicationId={id} key={key} />
        })}
      </VerificationContainer>
      {verifications.length === 0 ? <i role='note'>({t('none')})</i> : null}
    </>
  )
}

export default VerificationsView
