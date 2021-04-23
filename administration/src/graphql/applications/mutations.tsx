
import {gql} from "@apollo/client";

export const DELETE_APPLICATION = gql`
mutation deleteApplication($applicationId: Int!) {
    deleted: deleteApplication(applicationId: $applicationId)
}
`