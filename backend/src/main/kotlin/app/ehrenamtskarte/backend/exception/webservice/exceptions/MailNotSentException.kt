package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.GraphQLBaseException
import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class MailNotSentException(mailAddress: String) : GraphQLBaseException(
    GraphQLExceptionCode.MAIL_NOT_SENT,
    mapOf("recipient" to mailAddress),
)
