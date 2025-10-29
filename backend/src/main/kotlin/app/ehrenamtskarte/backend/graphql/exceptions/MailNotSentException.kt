package app.ehrenamtskarte.backend.graphql.exceptions

import app.ehrenamtskarte.backend.graphql.shared.types.GraphQLExceptionCode

class MailNotSentException(mailAddress: String) : GraphQLBaseException(
    GraphQLExceptionCode.MAIL_NOT_SENT,
    mapOf("recipient" to mailAddress),
)
