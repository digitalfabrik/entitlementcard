import { CreditCard } from '@mui/icons-material'
import { amber, blue, brown } from '@mui/material/colors'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { BaseChip } from '../../../components/BaseChip'
import { BavariaCardType } from '../../../graphql'

export const CardTypeIndicator = ({ type }: { type: BavariaCardType }): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const isGold = type === BavariaCardType.Golden

  return (
    <BaseChip
      label={t(isGold ? 'cardTypeGold' : 'cardTypeBlue')}
      icon={<CreditCard />}
      color={isGold ? brown[600] : blue[800]}
      backgroundColor={isGold ? amber[50] : blue[50]}
    />
  )
}
