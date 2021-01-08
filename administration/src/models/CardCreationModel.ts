import {CardType} from "./CardType";

export interface CardCreationModel {
    forename: string,
    surname: string,
    expirationDate: string,
    cardType: CardType
}
