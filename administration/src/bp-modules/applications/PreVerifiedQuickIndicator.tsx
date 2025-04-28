import { Tooltip } from '@blueprintjs/core'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { UnFocusedDiv } from './VerificationsQuickIndicator'
import VerificationIndicator from './components/VerificationIndicator'
import { VerificationStatus } from './constants'

export enum PreVerifiedQuickIndicatorType {
  Juleica,
  Verein360,
}

type PreVerifiedLabelMetaData = {
  backgroundColor: string
  fontColor: string
  labelText: string
}

const preVerifiedLabelMetaData: Record<PreVerifiedQuickIndicatorType, PreVerifiedLabelMetaData> = {
  [PreVerifiedQuickIndicatorType.Juleica]: {
    backgroundColor: '#bfd4f2',
    fontColor: '#000000',
    labelText: 'Juleica',
  },
  [PreVerifiedQuickIndicatorType.Verein360]: {
    backgroundColor: '#0366D6',
    fontColor: '#ffffff',
    labelText: 'Verein360',
  },
}

const PreVerifiedLabel = styled.span<{ type: PreVerifiedQuickIndicatorType }>`
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

const PreVerifiedQuickIndicator = memo(({ type }: { type: PreVerifiedQuickIndicatorType }) => {
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
