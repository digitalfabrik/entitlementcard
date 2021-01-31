
import {gql} from "@apollo/client";

export const ADD_CARD = gql`
mutation addCard($card: CardGenerationModelInput!) {
    success: addCard(card: $card)
}
`
