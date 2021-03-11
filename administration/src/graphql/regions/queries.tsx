
import {gql} from "@apollo/client";

export const GET_REGIONS = gql`
query getRegions {
    regions {
        id,
        prefix,
        name,
        regionIdentifier
    }
}
`
