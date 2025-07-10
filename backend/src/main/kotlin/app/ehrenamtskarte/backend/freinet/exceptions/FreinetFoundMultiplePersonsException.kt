package app.ehrenamtskarte.backend.freinet.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetFoundMultiplePersonsException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_FOUND_MULTIPLE_PERSONS,
)
