package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class FreinetApiNotReachableException : GraphQLBaseException(
    GraphQLExceptionCode.FREINET_API_NOT_REACHABLE,
)
