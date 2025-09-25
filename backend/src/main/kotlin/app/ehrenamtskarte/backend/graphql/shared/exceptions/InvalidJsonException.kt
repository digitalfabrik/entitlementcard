package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import graphql.ErrorType

open class InvalidJsonException(reason: String) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_JSON,
    mapOf("reason" to reason),
    ErrorType.ValidationError,
)
