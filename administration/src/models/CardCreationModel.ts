import {CardType} from "./CardType";

export interface CardCreationModel {
    id: number,
    forename: string,
    surname: string,
    expirationDate: string,
    cardType: CardType
}
