package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetPersonDataInvalidException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_PERSON_DATA_INVALID,
)
