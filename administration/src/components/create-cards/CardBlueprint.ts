import { CardType } from '../../models/CardType'

const MAX_NAME_LENGTH = 100

/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export interface CardBlueprint {
  id: number
  forename: string
  surname: string
  expirationDate: Date | null
  cardType: CardType
}

export const isNameValid = (value: string) => value.length > 0 && value.length < MAX_NAME_LENGTH

export const isExpirationDateValid = (value: Date | null) => value !== null && value > new Date()

export const isValid = (cardCreationInfo: CardBlueprint) =>
  isNameValid(cardCreationInfo.forename) &&
  isNameValid(cardCreationInfo.surname) &&
  (isExpirationDateValid(cardCreationInfo.expirationDate) || cardCreationInfo.cardType === CardType.gold)
