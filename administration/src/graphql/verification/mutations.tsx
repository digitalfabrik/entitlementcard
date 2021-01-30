
import {gql} from "@apollo/client";

export const ADD_CARD = gql`
mutation addCard($card: CardInput!) {
    success: addCard(card: $card)
}
`
