import { Icon, Intent } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { VerificationStatus } from '../types'

const StyledIndicator = styled.span`
  display: inline-block;
  padding: 4px;
`

type VerificationIndicatorProps = {
  status: VerificationStatus
  text?: string
}

const verifiedIcon = 'tick-circle'
const rejectedIcon = 'cross-circle'
const awaitingIcon = 'help'

const getIconByStatus = (status: VerificationStatus): 'tick-circle' | 'cross-circle' | 'help' => {
  switch (status) {
    case VerificationStatus.Verified:
      return verifiedIcon
    case VerificationStatus.Awaiting:
      return awaitingIcon
    case VerificationStatus.Rejected:
      return rejectedIcon
  }
}

const getIntentByStatus = (status: VerificationStatus): Intent => {
  switch (status) {
    case VerificationStatus.Verified:
      return 'success'
    case VerificationStatus.Awaiting:
      return 'warning'
    case VerificationStatus.Rejected:
      return 'danger'
  }
}

const VerificationIndicator = ({ status, text }: VerificationIndicatorProps): ReactElement => (
  <StyledIndicator data-testid={`indicator-${status}`}>
    <Icon icon={getIconByStatus(status)} intent={getIntentByStatus(status)} />
    {text}
  </StyledIndicator>
)

export default VerificationIndicator
