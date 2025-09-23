package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.exceptions.GraphQLExceptionCode

open class InvalidNoteSizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_NOTE_SIZE,
    mapOf("maxSize" to maxSize),
)
