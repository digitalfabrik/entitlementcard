package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.GraphqlErrorException

open class InvalidDataPolicySizeException(maxSize: Int) : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", GraphQLExceptionCode.INVALID_DATA_POLICY_SIZE),
            Pair("maxSize", maxSize)
        )
    )
)
