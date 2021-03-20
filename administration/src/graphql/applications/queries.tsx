
import {gql} from "@apollo/client";

export const GET_APPLICATIONS = gql`
query getApplications($regionId: Int!) {
    applications: getApplications(regionId: $regionId) {
        id,
        createdDate,
        jsonValue
    }
}
`
