import { Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CardStatisticsResultModel } from '../../../generated/graphql'
import { toLowerCaseFirstLetter } from '../../../util/helper'

const Container = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  margin-top: 12px;
  margin-bottom: 24px;
  white-space: pre;
`

type StatisticsTotalCountProps = {
  statistics: CardStatisticsResultModel[]
}

type TotalAmountResultModel = {
  totalCardsCreated: number
  totalCardsActivated: number
  totalCardsBlue: number
  totalCardsGolden: number
}

const sumTotalAmounts = (statistics: CardStatisticsResultModel[]): TotalAmountResultModel => ({
  totalCardsCreated: statistics.reduce((sum, current) => sum + current.cardsCreated, 0),
  totalCardsActivated: statistics.reduce((sum, current) => sum + current.cardsActivated, 0),
  totalCardsBlue: statistics.reduce((sum, current) => sum + current.cardsActivatedBlue, 0),
  totalCardsGolden: statistics.reduce((sum, current) => sum + current.cardsActivatedGolden, 0),
})
const StatisticsTotalCardsCount = ({ statistics }: StatisticsTotalCountProps): ReactElement => {
  const { t } = useTranslation('statistics')
  return (
    <Container>
      <Typography variant='h6' margin={0} textAlign='center'>
        {t('allRegions')}
      </Typography>
      <Typography variant='body2' component='span' data-testid='totalCardsCreated'>
        {` ${sumTotalAmounts(statistics).totalCardsCreated} ${toLowerCaseFirstLetter(t('cardsCreated'))} / `}
      </Typography>
      <Typography variant='body2' component='span' data-testid='totalCardsActivated'>
        {`${sumTotalAmounts(statistics).totalCardsActivated} ${toLowerCaseFirstLetter(t('cardsActivated'))}`}
      </Typography>
      <Typography variant='body2' component='span' data-testid='totalCardsActivatedBlue'>
        {` (${sumTotalAmounts(statistics).totalCardsBlue} ${toLowerCaseFirstLetter(t('totalCardsBlue'))}, `}
      </Typography>
      <Typography variant='body2' component='span' data-testid='totalCardsActivatedGolden'>
        {`${sumTotalAmounts(statistics).totalCardsGolden} ${toLowerCaseFirstLetter(t('totalCardsGolden'))})`}
      </Typography>
    </Container>
  )
}

export default StatisticsTotalCardsCount
