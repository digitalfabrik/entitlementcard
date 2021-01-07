
import {gql} from "@apollo/client";

const ACCEPTING_STORES = gql`
query AcceptingStoreSummaryById($ids: IdsParamsInput!) {
    physicalStoresById(params: $ids) {
        id,
        store {
            name
            description
        }
    }
}
`
