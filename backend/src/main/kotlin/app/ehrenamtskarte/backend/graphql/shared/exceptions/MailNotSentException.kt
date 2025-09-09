package app.ehrenamtskarte.backend.graphql.shared.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode

class MailNotSentException(mailAddress: String) : GraphQLBaseException(
    GraphQLExceptionCode.MAIL_NOT_SENT,
    mapOf("recipient" to mailAddress),
)
