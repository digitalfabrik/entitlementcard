import { Card } from '../../../cards/Card'
import { FreinetCardInput } from '../../../generated/graphql'

export const getFreinetCardFromCards = (cards: Card[]): FreinetCardInput => {
  if (cards.length !== 1) {
    throw Error('For freinet data transfer only one card is allowed.')
  }

  if (!cards[0].extensions.bavariaCardType) {
    throw Error('Card data invalid, bavarianCardType missing.')
  }

  return {
    expirationDate: cards[0].expirationDate?.format('yyyy-MM-dd'),
    cardType: cards[0].extensions.bavariaCardType,
  }
}
