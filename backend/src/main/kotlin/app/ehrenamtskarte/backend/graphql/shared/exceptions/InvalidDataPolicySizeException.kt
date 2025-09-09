package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

open class InvalidDataPolicySizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_DATA_POLICY_SIZE,
    mapOf("maxSize" to maxSize),
)
