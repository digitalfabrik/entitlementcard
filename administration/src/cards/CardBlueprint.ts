import { add } from 'date-fns'

const MAX_NAME_LENGTH = 100

export enum BavariaCardTypeBlueprint {
  standard = 'Standard',
  gold = 'Goldkarte',
}


/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export interface CardBlueprint {
  id: number
  forename: string
  surname: string
  expirationDate: Date | null
  cardType: BavariaCardTypeBlueprint // FIXME
}

export const isNameValid = (value: string) => value.length > 0 && value.length < MAX_NAME_LENGTH

export const isExpirationDateValid = (value: Date | null) => value !== null && value > new Date()

export const isValid = (cardCreationInfo: CardBlueprint) =>
  isNameValid(cardCreationInfo.forename) &&
  isNameValid(cardCreationInfo.surname) &&
  (isExpirationDateValid(cardCreationInfo.expirationDate) || cardCreationInfo.cardType === BavariaCardTypeBlueprint.gold)

let idCounter = 0

export const createEmptyCard = (): CardBlueprint => ({
  id: idCounter++,
  forename: '',
  surname: '',
  expirationDate: add(Date.now(), { years: 2 }),
  cardType: BavariaCardTypeBlueprint.standard, // FIXME
})
