package app.ehrenamtskarte.backend.exception.webservice.exceptions

import app.ehrenamtskarte.backend.exception.webservice.schema.GraphQLExceptionCode
import graphql.GraphqlErrorException

open class InvalidJsonException(reason: String) : GraphqlErrorException(
    newErrorException().extensions(
        mapOf(
            Pair("code", GraphQLExceptionCode.INVALID_JSON),
            Pair("reason", reason)
        )
    )
)
