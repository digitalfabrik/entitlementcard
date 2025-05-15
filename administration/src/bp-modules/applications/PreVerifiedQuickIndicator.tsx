import { Tooltip } from '@blueprintjs/core'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PreVerifiedEntitlementType } from './PreVerifiedEntitlementType'
import { UnFocusedDiv } from './VerificationsQuickIndicator'
import VerificationIndicator from './components/VerificationIndicator'
import { VerificationStatus } from './constants'

type PreVerifiedLabelMetaData = {
  backgroundColor: string
  fontColor: string
  labelText: string
}

const preVerifiedLabelMetaData: Record<PreVerifiedEntitlementType, PreVerifiedLabelMetaData> = {
  [PreVerifiedEntitlementType.Juleica]: {
    backgroundColor: '#bfd4f2',
    fontColor: '#000000',
    labelText: 'Juleica',
  },
  [PreVerifiedEntitlementType.Verein360]: {
    backgroundColor: '#0366D6',
    fontColor: '#ffffff',
    labelText: 'Verein360',
  },
  [PreVerifiedEntitlementType.HonoredByMinisterPresident]: {
    backgroundColor: '#FBCA01',
    fontColor: '#000000',
    labelText: 'Ehrenzeichen',
  },
}

const PreVerifiedLabel = styled.span<{ type: PreVerifiedEntitlementType }>`
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${({ type }) => preVerifiedLabelMetaData[type].backgroundColor};
  color: ${({ type }) => preVerifiedLabelMetaData[type].fontColor};
  border-radius: 2em;
  line-height: 1;
  margin-right: 6px;
  display: inline-block;
  white-space: nowrap;
`

const PreVerifiedQuickIndicator = memo(({ type }: { type: PreVerifiedEntitlementType }) => {
  const { t } = useTranslation('applicationsOverview')
  return (
    <Tooltip
      content={
        <div>
          <b>{t('confirmationsByOrganizations')}</b>
          <br />
          {t('noConfirmationNeeded')}
        </div>
      }>
      <UnFocusedDiv>
        <PreVerifiedLabel type={type}>{preVerifiedLabelMetaData[type].labelText}</PreVerifiedLabel>
        <VerificationIndicator status={VerificationStatus.Verified} />
      </UnFocusedDiv>
    </Tooltip>
  )
})

export default memo(PreVerifiedQuickIndicator)
