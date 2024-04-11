package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.GraphqlErrorException

class MailNotSentException(mailAddress: String) : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", GraphQLExceptionCode.MAIL_NOT_SENT),
            Pair("recipient", mailAddress)
        )
    )
)
