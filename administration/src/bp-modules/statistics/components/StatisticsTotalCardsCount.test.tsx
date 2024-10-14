import { render } from '@testing-library/react'
import React from 'react'

import { CardStatisticsResultModel } from '../../../generated/graphql'
import StatisticsTotalCardsCount from './StatisticsTotalCardsCount'

describe('StatisticTotalCardsCount', () => {
  const statistics: CardStatisticsResultModel[] = [
    {
      cardsActivated: 5,
      cardsCreated: 10,
      region: 'Stadt Augsburg',
    },
    {
      cardsActivated: 10,
      cardsCreated: 20,
      region: 'Landkreis Augsburg',
    },
  ]

  it('should display the correct amount of activated cards', async () => {
    const { getByTestId } = render(<StatisticsTotalCardsCount statistics={statistics} />)
    expect(getByTestId('totalCardsActivated')).toHaveTextContent('15')
  })

  it('should display the correct amount of created cards', async () => {
    const { getByTestId } = render(<StatisticsTotalCardsCount statistics={statistics} />)
    expect(getByTestId('totalCardsCreated')).toHaveTextContent('30')
  })
})
