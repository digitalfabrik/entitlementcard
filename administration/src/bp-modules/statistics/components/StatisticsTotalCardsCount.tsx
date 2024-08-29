import { H4 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CardStatisticsResultModel } from '../../../generated/graphql'

const Headline = styled(H4)`
  text-align: center;
  margin: 0;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  margin-top: 12px;
  white-space: pre;
`

type StatisticsTotalCountProps = {
  statistics: CardStatisticsResultModel[]
}

type TotalAmountResultModel = {
  totalCardsCreated: number
  totalCardsActivated: number
}

const sumTotalAmounts = (statistics: CardStatisticsResultModel[]): TotalAmountResultModel => ({
  totalCardsCreated: statistics.reduce((sum, current) => sum + current.cardsCreated, 0),
  totalCardsActivated: statistics.reduce((sum, current) => sum + current.cardsActivated, 0),
})
const StatisticsTotalCardsCount = ({ statistics }: StatisticsTotalCountProps): ReactElement => (
  <Container>
    <Headline>Alle Regionen:</Headline>
    <span data-testid='totalCardsCreated'> {sumTotalAmounts(statistics).totalCardsCreated}</span> erstellte Karten /{' '}
    <span data-testid='totalCardsActivated'>{sumTotalAmounts(statistics).totalCardsActivated}</span> davon aktiviert
  </Container>
)

export default StatisticsTotalCardsCount
