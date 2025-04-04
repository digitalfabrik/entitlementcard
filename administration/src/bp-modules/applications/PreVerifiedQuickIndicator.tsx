import { Tooltip } from '@blueprintjs/core'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import JuleicaLogo from '../../assets/juleica.svg'
import Verein360Logo from '../../assets/verein360.svg'
import { UnFocusedDiv } from './VerificationsQuickIndicator'
import VerificationIndicator from './components/VerificationIndicator'
import { VerificationStatus } from './constants'

export enum PreVerifiedQuickIndicatorType {
  Juleica,
  Verein360,
}

const PreVerifiedQuickIndicator = memo(({ type }: { type: PreVerifiedQuickIndicatorType }) => {
  const logo = type === PreVerifiedQuickIndicatorType.Juleica ? JuleicaLogo : Verein360Logo
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
        <VerificationIndicator status={VerificationStatus.Verified} />
        <img src={logo} alt={type.toString()} height='100%' />
      </UnFocusedDiv>
    </Tooltip>
  )
})

export default memo(PreVerifiedQuickIndicator)
