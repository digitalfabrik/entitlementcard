import {gql} from "@apollo/client";

export const SIGN_IN = gql`
    mutation signIn($authData: AuthDataInput!) {
        signInPayload: signIn(authData: $authData) {
            token
            user {
                email
            }
        }
    }
`
