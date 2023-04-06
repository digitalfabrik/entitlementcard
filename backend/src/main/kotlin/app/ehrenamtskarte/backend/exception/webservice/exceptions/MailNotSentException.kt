package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class MailNotSentException() : GraphQLBaseException(GraphQLExceptionCode.MAIL_NOT_SENT)
