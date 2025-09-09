package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.ErrorType

open class InvalidJsonException(reason: String) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_JSON,
    mapOf("reason" to reason),
    ErrorType.ValidationError,
)
