package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode
import graphql.ErrorType

class InvalidInputException(message: String) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_INPUT,
    message = message,
    errorType = ErrorType.ValidationError,
)
