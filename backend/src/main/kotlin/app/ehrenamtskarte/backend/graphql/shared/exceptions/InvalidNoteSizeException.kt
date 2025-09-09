package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

open class InvalidNoteSizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_NOTE_SIZE,
    mapOf("maxSize" to maxSize),
)
