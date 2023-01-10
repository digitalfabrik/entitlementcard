import { add } from 'date-fns'

const MAX_NAME_LENGTH = 60 // TODO: Select proper max value

export enum BavariaCardTypeBlueprint {
  standard = 'Standard',
  gold = 'Goldkarte',
}


/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export interface CardBlueprint {
  name: string
  expirationDate: Date | null
  cardType: BavariaCardTypeBlueprint // FIXME
}

export const isNameValid = (value: string) => value.length > 0 && value.length < MAX_NAME_LENGTH

export const isExpirationDateValid = (value: Date | null) => value !== null && value > new Date()

export const isValid = (cardCreationInfo: CardBlueprint) =>
  isNameValid(cardCreationInfo.name) &&
  (isExpirationDateValid(cardCreationInfo.expirationDate) || cardCreationInfo.cardType === BavariaCardTypeBlueprint.gold)


export const createEmptyCard = (): CardBlueprint => ({
  name: '',
  expirationDate: add(Date.now(), { years: 2 }),
  cardType: BavariaCardTypeBlueprint.standard, // FIXME
})
