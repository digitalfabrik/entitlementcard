import { render } from '@testing-library/react'

import { CardStatisticsResultModel } from '../../../generated/graphql'
import StatisticsTotalCardsCount from './StatisticsTotalCardsCount'

describe('StatisticTotalCardsCount', () => {
  const statistics: CardStatisticsResultModel[] = [
    {
      cardsActivated: 5,
      cardsCreated: 10,
      cardsActivatedBlue: 3,
      cardsActivatedGolden: 2,
      region: 'Stadt Augsburg',
    },
    {
      cardsActivated: 10,
      cardsCreated: 20,
      cardsActivatedBlue: 5,
      cardsActivatedGolden: 5,
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

  it('should display the correct amount of blue activated cards', async () => {
    const { getByTestId } = render(<StatisticsTotalCardsCount statistics={statistics} />)
    expect(getByTestId('totalCardsActivatedBlue')).toHaveTextContent('8')
  })

  it('should display the correct amount of golden activated cards', async () => {
    const { getByTestId } = render(<StatisticsTotalCardsCount statistics={statistics} />)
    expect(getByTestId('totalCardsActivatedGolden')).toHaveTextContent('7')
  })
})
