import { Card } from '../../../cards/card'
import { FreinetCardInput } from '../../../graphql'

export const getFreinetCardFromCards = (cards: Card[]): FreinetCardInput => {
  if (cards.length !== 1) {
    throw Error('For freinet data transfer only one card is allowed.')
  }

  if (!cards[0].extensions.bavariaCardType) {
    throw Error('Card data invalid, bavarianCardType missing.')
  }

  return {
    expirationDate:
      cards[0].expirationDate !== null ? cards[0].expirationDate.toString() : undefined,
    cardType: cards[0].extensions.bavariaCardType,
  }
}
