package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class InvalidLinkException() : GraphQLBaseException(GraphQLExceptionCode.INVALID_LINK)
