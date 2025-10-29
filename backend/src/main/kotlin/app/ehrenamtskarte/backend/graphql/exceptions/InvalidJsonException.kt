package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import graphql.ErrorType

open class InvalidJsonException(message: String) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_JSON,
    message = message,
    errorType = ErrorType.ValidationError,
)
