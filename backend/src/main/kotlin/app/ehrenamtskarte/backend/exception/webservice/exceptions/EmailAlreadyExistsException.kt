package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class EmailAlreadyExistsException() : GraphQLBaseException(GraphQLExceptionCode.EMAIL_ALREADY_EXISTS)
