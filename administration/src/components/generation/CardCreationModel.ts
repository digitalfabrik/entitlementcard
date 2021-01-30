import {CardType} from "../../models/CardType";

const MAX_NAME_LENGTH = 100

export interface CardCreationModel {
    id: number,
    forename: string,
    surname: string,
    expirationDate: Date,
    cardType: CardType
}

export function isForenameValid(value: string) {
    return value.length > 0 && value.length < MAX_NAME_LENGTH
}

export function isSurnameValid(value: string) {
    return value.length > 0 && value.length < MAX_NAME_LENGTH
}

export function isExpirationDateValid(value: Date) {
    return value > new Date();
}

export function isValid(cardCreationModel: CardCreationModel) {
    return isForenameValid(cardCreationModel.forename)
        && isSurnameValid(cardCreationModel.surname)
        && isExpirationDateValid(cardCreationModel.expirationDate);
}
