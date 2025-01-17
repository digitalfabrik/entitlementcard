package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.ErrorType

open class InvalidJsonException(reason: String) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_JSON,
    mapOf("reason" to reason),
    ErrorType.ValidationError
)
