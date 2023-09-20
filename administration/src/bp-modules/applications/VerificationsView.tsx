import { Colors, H5, Icon, Tooltip } from '@blueprintjs/core'
import { ReactNode } from 'react'
import styled from 'styled-components'

import { GetApplicationsQuery } from '../../generated/graphql'

const UnFocusedDiv = styled.div`
  :focus {
    outline: none;
  }
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

const getIconByStatus = (status: VerificationStatus) => {
  switch (status) {
    case VerificationStatus.Verified:
      return verifiedIcon
    case VerificationStatus.Awaiting:
      return awaitingIcon
    case VerificationStatus.Rejected:
      return rejectedIcon
  }
}

const getIntentByStatus = (status: VerificationStatus) => {
  switch (status) {
    case VerificationStatus.Verified:
      return 'success'
    case VerificationStatus.Awaiting:
      return 'warning'
    case VerificationStatus.Rejected:
      return 'danger'
  }
}

const Indicator = ({ status, text }: { status: VerificationStatus; text: ReactNode }) => {
  return (
    <span style={{ padding: '4px' }}>
      <Icon icon={getIconByStatus(status)} intent={getIntentByStatus(status)} />: {text}
    </span>
  )
}

export const getStatus = (verification: Application['verifications'][number]) => {
  if (!!verification.verifiedDate) {
    return VerificationStatus.Verified
  } else if (!!verification.rejectedDate) {
    return VerificationStatus.Rejected
  } else {
    return VerificationStatus.Awaiting
  }
}

export const VerificationsQuickIndicator = ({ verifications }: { verifications: Application['verifications'] }) => {
  const verificationStati = verifications.map(getStatus)
  return (
    <Tooltip
      content={
        <div>
          <b>Bestätigung(en) durch Organisationen:</b>
          <br />
          Bestätigt/Ausstehend/Widersprochen
        </div>
      }>
      <UnFocusedDiv>
        <Indicator
          status={VerificationStatus.Verified}
          text={verificationStati.filter(v => v === VerificationStatus.Verified).length}
        />
        <Indicator
          status={VerificationStatus.Awaiting}
          text={verificationStati.filter(v => v === VerificationStatus.Awaiting).length}
        />
        <Indicator
          status={VerificationStatus.Rejected}
          text={verificationStati.filter(v => v === VerificationStatus.Rejected).length}
        />
      </UnFocusedDiv>
    </Tooltip>
  )
}

const VerificationListItem = styled.li<{ $color: string }>`
  position: relative;
  padding-left: 10px;
  border-left: 2px solid ${props => props.$color};
`

const VerificationContainer = styled.ul`
  list-style-type: none;
  padding-left: 0px;
  li:not(:last-child) {
    margin-bottom: 15px;
  }
`

const VerificationsView = ({ verifications }: { verifications: Application['verifications'] }) => {
  return (
    <>
      <H5>Bestätigung(en) durch Organisationen</H5>
      <VerificationContainer>
        {verifications.map((verification, index) => {
          const status = getStatus(verification)
          const text = verification.verifiedDate
            ? `Bestätigt am ${new Date(verification.verifiedDate).toLocaleString('de')}`
            : verification.rejectedDate
            ? `Widersprochen am ${new Date(verification.rejectedDate).toLocaleString('de')}`
            : 'Ausstehend'
          return (
            <VerificationListItem
              key={index}
              $color={
                verification.verifiedDate ? Colors.GREEN2 : verification.rejectedDate ? Colors.RED2 : Colors.ORANGE2
              }>
              <table cellPadding='2px'>
                <tbody>
                  <tr>
                    <td>Organisation:</td>
                    <td>{verification.organizationName}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>{verification.contactEmailAddress}</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td>
                      <Indicator status={status} text={text} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </VerificationListItem>
          )
        })}
      </VerificationContainer>
      {verifications.length === 0 ? <i>(keine)</i> : null}
    </>
  )
}

export default VerificationsView
