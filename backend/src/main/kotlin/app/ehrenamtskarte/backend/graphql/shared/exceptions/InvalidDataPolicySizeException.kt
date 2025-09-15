package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

open class InvalidDataPolicySizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_DATA_POLICY_SIZE,
    mapOf("maxSize" to maxSize),
)
