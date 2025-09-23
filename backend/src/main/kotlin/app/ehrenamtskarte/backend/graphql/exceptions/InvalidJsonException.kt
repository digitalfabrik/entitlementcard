package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode
import graphql.ErrorType

open class InvalidJsonException(reason: String) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_JSON,
    mapOf("reason" to reason),
    ErrorType.ValidationError,
)
