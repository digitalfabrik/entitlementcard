package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

class InvalidInputException(reason: String) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_INPUT,
    mapOf("reason" to reason),
)
