package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

open class InvalidApplicationConfirmationNoteSizeException(maxSize: Int) : GraphQLBaseException(
    GraphQLExceptionCode.INVALID_APPLICATION_CONFIRMATION_NOTE_SIZE,
    mapOf("maxSize" to maxSize),
)
