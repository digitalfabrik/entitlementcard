import { CreditCard } from '@mui/icons-material'
import { styled } from '@mui/material'
import { amber, blue, brown } from '@mui/material/colors'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { BavariaCardType } from '../../../graphql'

const CardTypeLabel = styled('span')(({ theme }) => ({
  padding: theme.spacing(0.5, 1.25),
  fontSize: theme.typography.body2.fontSize,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '2em',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  whiteSpace: 'nowrap',
}))

export const CardTypeIndicator = ({ type }: { type: BavariaCardType }): ReactElement => {
  const { t } = useTranslation('applicationsOverview')
  const isGold = type === BavariaCardType.Golden
  const color = isGold ? brown[600] : blue[800]

  return (
    <CardTypeLabel
      sx={{ color, borderColor: color, backgroundColor: isGold ? amber[50] : blue[50] }}
    >
      <CreditCard sx={{ fontSize: 16 }} />
      {t(isGold ? 'cardTypeGold' : 'cardTypeBlue')}
    </CardTypeLabel>
  )
}
