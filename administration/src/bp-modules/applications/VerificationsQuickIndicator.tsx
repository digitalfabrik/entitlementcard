import { Tooltip } from '@blueprintjs/core'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import type { Application } from './ApplicationsOverview'
import VerificationIndicator from './components/VerificationIndicator'
import { VerificationStatus } from './constants'
import { getVerificationStatus } from './utils'

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
  const verificationStati = verifications.map(getVerificationStatus)
  const { t } = useTranslation('applications')
  return (
    <Tooltip
      content={
        <div>
          <b>{t('confirmationsByOrganizations')}</b>
          <br />
          {t('verified/pending/rejected')}
        </div>
      }>
      <UnFocusedDiv>
        <VerificationIndicator
          status={VerificationStatus.Verified}
          text={`: ${verificationStati.filter(v => v === VerificationStatus.Verified).length}`}
        />
        <VerificationIndicator
          status={VerificationStatus.Awaiting}
          text={`: ${verificationStati.filter(v => v === VerificationStatus.Awaiting).length}`}
        />
        <VerificationIndicator
          status={VerificationStatus.Rejected}
          text={`: ${verificationStati.filter(v => v === VerificationStatus.Rejected).length}`}
        />
      </UnFocusedDiv>
    </Tooltip>
  )
})

export default memo(VerificationQuickIndicator)
