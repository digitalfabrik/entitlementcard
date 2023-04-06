package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class WrongPasswordException() : GraphQLBaseException(GraphQLExceptionCode.WRONG_PASSWORD_EXCEPTION)
