import {CardType} from "../../models/CardType";

const MAX_NAME_LENGTH = 100

export interface CardCreationModel {
    id: number,
    forename: string,
    surname: string,
    expirationDate: Date,
    cardType: CardType
}

export const isNameValid = (value: string) => value.length > 0 && value.length < MAX_NAME_LENGTH

export const isExpirationDateValid = (value: Date) => value > new Date()

export const isValid = (cardCreationModel: CardCreationModel) =>
    isNameValid(cardCreationModel.forename)
    && isNameValid(cardCreationModel.surname)
    && isExpirationDateValid(cardCreationModel.expirationDate)
