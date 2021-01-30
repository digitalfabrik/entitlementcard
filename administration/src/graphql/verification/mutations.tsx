
import {gql} from "@apollo/client";

const ADD_CARD = gql`
mutation addCard($card: CardInput!) {
    success: addCard(card: $card)
}
`
