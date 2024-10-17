import { Tooltip } from '@blueprintjs/core'
import React, { memo } from 'react'

import JuleicaLogo from '../../assets/juleica.svg'
import { UnFocusedDiv } from './VerificationsQuickIndicator'
import { Indicator, VerificationStatus } from './VerificationsView'

const JuleicaVerificationQuickIndicator = memo(() => (
  <Tooltip
    content={
      <div>
        <b>Bestätigung(en) durch Organisationen:</b>
        <br />
        Bestätigung ist nicht erforderlich
      </div>
    }>
    <UnFocusedDiv>
      <Indicator status={VerificationStatus.Verified} />
      <img src={JuleicaLogo} alt='juleica' height='100%' />
    </UnFocusedDiv>
  </Tooltip>
))

export default memo(JuleicaVerificationQuickIndicator)
