import { Colors } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ApplicationVerificationView } from '../../../generated/graphql'
import EmailLink from '../../EmailLink'
import { Indicator, getStatus } from '../VerificationsView'
import { isEmailValid } from '../utils/verificationHelper'

const ListItem = styled.li<{ $color: string }>`
  position: relative;
  padding-left: 10px;
  border-left: 2px solid ${props => props.$color};
`

export type Verification = Omit<ApplicationVerificationView, 'contactName'>

type VerificationListItemProps = {
  verification: Verification
}

const VerificationListItem = ({ verification }: VerificationListItemProps): ReactElement => {
  const { t } = useTranslation('applications')
  const status = getStatus(verification)
  const unverifiedText = verification.rejectedDate
    ? `${t('rejectedOn')} ${new Date(verification.rejectedDate).toLocaleString('de')}`
    : t('pending')
  const text = verification.verifiedDate
    ? `${t('verifiedOn')} ${new Date(verification.verifiedDate).toLocaleString('de')}`
    : unverifiedText
  const unverifiedColor = verification.rejectedDate ? Colors.RED2 : Colors.ORANGE2
  const color = verification.verifiedDate ? Colors.GREEN2 : unverifiedColor

  return (
    <ListItem $color={color} data-testid='verification-list-item'>
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
              <Indicator status={status} text={` ${text}`} />
            </td>
          </tr>
        </tbody>
      </table>
    </ListItem>
  )
}

export default VerificationListItem
