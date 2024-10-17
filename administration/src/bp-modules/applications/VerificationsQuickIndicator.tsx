import { Tooltip } from '@blueprintjs/core'
import React, { memo } from 'react'
import styled from 'styled-components'

import { Application } from './ApplicationsOverview'
import { Indicator, VerificationStatus, getStatus } from './VerificationsView'

export const UnFocusedDiv = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  :focus {
    outline: none;
  }
  height: 25px;
`

const VerificationQuickIndicator = memo(({ verifications }: { verifications: Application['verifications'] }) => {
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
          text={`: ${verificationStati.filter(v => v === VerificationStatus.Verified).length}`}
        />
        <Indicator
          status={VerificationStatus.Awaiting}
          text={`: ${verificationStati.filter(v => v === VerificationStatus.Awaiting).length}`}
        />
        <Indicator
          status={VerificationStatus.Rejected}
          text={`: ${verificationStati.filter(v => v === VerificationStatus.Rejected).length}`}
        />
      </UnFocusedDiv>
    </Tooltip>
  )
})

export default memo(VerificationQuickIndicator)
