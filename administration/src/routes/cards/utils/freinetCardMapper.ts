import { Card } from '../../../cards/card'
import { FreinetCardInput, FreinetCardWithUserIdInput } from '../../../graphql'

export const getFreinetCardFromCard = (card: Card): FreinetCardInput => {
  if (!card.extensions.bavariaCardType) {
    throw Error('Card data invalid, bavarianCardType missing.')
  }

  return {
    expirationDate: card.expirationDate?.toString() ?? null,
    cardType: card.extensions.bavariaCardType,
  }
}

export const getFreinetCardWithUserIdFromCard = (card: Card): FreinetCardWithUserIdInput => {
  if (!card.extensions.bavariaCardType) {
    throw Error('Card data invalid, bavarianCardType missing.')
  }

  if (!card.extensions.freinetUserId) {
    throw Error('Card data invalid, freinetUserId missing.')
  }

  return {
    expirationDate: card.expirationDate?.toString() ?? null,
    cardType: card.extensions.bavariaCardType,
    userId: parseInt(card.extensions.freinetUserId, 10),
  }
}
