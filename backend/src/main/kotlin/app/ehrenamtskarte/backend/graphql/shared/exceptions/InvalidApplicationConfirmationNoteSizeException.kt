package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.graphql.shared.schema.GraphQLExceptionCode

open class InvalidApplicationConfirmationNoteSizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_APPLICATION_CONFIRMATION_NOTE_SIZE,
    mapOf("maxSize" to maxSize),
)
